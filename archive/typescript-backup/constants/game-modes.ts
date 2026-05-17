/**
 * Game Mode Configuration
 * Centralized definitions for all career modes to ensure consistency
 * across routing, navigation, and display logic.
 */

export type GameModeId = "manager" | "player" | "sporting_director" | "create_a_club";

export interface GameModeConfig {
  id: GameModeId;
  title: string;
  description: string;
  route: string;
}

/**
 * All available game modes with their configurations.
 * Each mode maps to a specific route in the app navigation.
 */
export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  manager: {
    id: "manager",
    title: "Manager Career",
    description: "Lead a club to glory. Handle transfers, tactics, and finances.",
    route: "/modes/manager",
  },
  player: {
    id: "player",
    title: "Player Career",
    description: "Rise from prospect to legend. Train, perform, and earn glory.",
    route: "/modes/player",
  },
  sporting_director: {
    id: "sporting_director",
    title: "Sporting Director",
    description: "Build a winning club. Scout, negotiate, and plan strategy.",
    route: "/modes/sporting_director",
  },
  create_a_club: {
    id: "create_a_club",
    title: "Create-a-Club",
    description: "Start from scratch. Build your club identity and rise.",
    route: "/modes/create_a_club",
  },
};

/**
 * Get a game mode configuration by ID.
 * @throws Error if mode ID is invalid
 */
export function getGameMode(id: string): GameModeConfig {
  const mode = GAME_MODES[id as GameModeId];
  if (!mode) {
    throw new Error(`Invalid game mode: ${id}`);
  }
  return mode;
}

/**
 * Get all available game modes as an array.
 */
export function getAllGameModes(): GameModeConfig[] {
  return Object.values(GAME_MODES);
}
