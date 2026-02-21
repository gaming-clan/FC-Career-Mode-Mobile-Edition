/**
 * Global Game State Context
 * Manages the current career game state and provides it to all components
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CareerGameState } from "./career-engine";
import { initializeCareer } from "./career-engine";
import { getAllSaves, updateSave } from "./career-storage";

interface GameStateContextType {
  gameState: CareerGameState | null;
  isLoading: boolean;
  error: string | null;
  currentSaveId: string | null;
  
  // Actions
  initializeNewGame: (club: any, season: number) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  saveGame: () => Promise<void>;
  updateGameState: (newState: CareerGameState) => void;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

/**
 * Provider component for game state
 */
export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<CareerGameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);

  // Initialize a new game
  const initializeNewGame = useCallback(async (club: any, season: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const newGameState = initializeCareer(club, season);
      setGameState(newGameState);
      setCurrentSaveId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize game");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load an existing game
  const loadGame = useCallback(async (saveId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const saves = await getAllSaves();
      const save = saves.find((s) => s.id === saveId);
      
      if (!save) {
        throw new Error("Save not found");
      }

      setGameState(save.gameData as CareerGameState);
      setCurrentSaveId(saveId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save the current game
  const saveGame = useCallback(async () => {
    if (!gameState || !currentSaveId) {
      setError("No active game to save");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await updateSave(currentSaveId, {
        gameData: gameState,
        currentSeason: gameState.currentSeason,
        currentWeek: gameState.currentMatchday,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save game");
    } finally {
      setIsLoading(false);
    }
  }, [gameState, currentSaveId]);

  // Update game state
  const updateGameState = useCallback((newState: CareerGameState) => {
    setGameState(newState);
    // Auto-save after state update
    if (currentSaveId) {
      updateSave(currentSaveId, {
        gameData: newState,
        currentSeason: newState.currentSeason,
        currentWeek: newState.currentMatchday,
      }).catch((err) => {
        console.error("Auto-save failed:", err);
      });
    }
  }, [currentSaveId]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(null);
    setCurrentSaveId(null);
    setError(null);
  }, []);

  const value: GameStateContextType = {
    gameState,
    isLoading,
    error,
    currentSaveId,
    initializeNewGame,
    loadGame,
    saveGame,
    updateGameState,
    resetGame,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

/**
 * Hook to use game state context
 */
export function useGameState(): GameStateContextType {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within GameStateProvider");
  }
  return context;
}

/**
 * Hook to use only the game state (read-only)
 */
export function useGameStateData(): CareerGameState | null {
  const { gameState } = useGameState();
  return gameState;
}

/**
 * Hook to use only the game actions
 */
export function useGameActions() {
  const {
    initializeNewGame,
    loadGame,
    saveGame,
    updateGameState,
    resetGame,
  } = useGameState();

  return {
    initializeNewGame,
    loadGame,
    saveGame,
    updateGameState,
    resetGame,
  };
}
