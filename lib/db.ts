import { blink } from '@/lib/_core/api';

export interface Save {
  id: string;
  userId: string;
  name: string;
  mode: 'manager' | 'player' | 'sporting_director' | 'create_a_club';
  clubId?: string;
  seasonYear: number;
  currentWeek: number;
  managerName?: string;
  playerName?: string;
  gameData?: string;
  createdAt: string;
  lastPlayedAt: string;
}

export interface Club {
  id: string;
  leagueId: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  stadiumName: string;
  budget: number;
  reputation: number;
}

export interface Player {
  id: string;
  clubId: string;
  name: string;
  nationality: string;
  age: number;
  position: string;
  rating: number;
  potential: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  value: number;
  wage: number;
}

export const db = {
  saves: {
    list: async (userId: string) => {
      const result = await blink.db.saves.list({
        where: { userId },
        orderBy: { lastPlayedAt: 'desc' }
      });
      return result as unknown as Save[];
    },
    get: async (id: string) => {
      const result = await blink.db.saves.get(id);
      return result as unknown as Save | null;
    },
    create: async (save: Omit<Save, 'id' | 'createdAt' | 'lastPlayedAt'>) => {
      const id = `save_${Date.now()}`;
      const now = new Date().toISOString();
      const result = await blink.db.saves.create({
        ...save,
        id,
        createdAt: now,
        lastPlayedAt: now
      });
      return result as unknown as Save;
    },
    update: async (id: string, updates: Partial<Save>) => {
      const now = new Date().toISOString();
      const result = await blink.db.saves.update(id, {
        ...updates,
        lastPlayedAt: now
      });
      return result as unknown as Save;
    },
    delete: async (id: string) => {
      return await blink.db.saves.delete(id);
    }
  },
  clubs: {
    list: async (leagueId?: string) => {
      const options = leagueId ? { where: { leagueId } } : {};
      const result = await blink.db.clubs.list(options);
      return result as unknown as Club[];
    },
    get: async (id: string) => {
      const result = await blink.db.clubs.get(id);
      return result as unknown as Club | null;
    }
  },
  players: {
    listByClub: async (clubId: string) => {
      const result = await blink.db.players.list({
        where: { clubId }
      });
      return result as unknown as Player[];
    },
    search: async (query?: string, filters?: { minRating?: number, maxAge?: number, position?: string }) => {
      let where: any = {};
      if (query) {
        where.name = { LIKE: `%${query}%` };
      }
      if (filters?.minRating) {
        where.rating = { GTE: filters.minRating };
      }
      if (filters?.position) {
        where.position = filters.position;
      }
      
      const result = await blink.db.players.list({
        where,
        limit: 50,
        orderBy: { rating: 'desc' }
      });
      return result as unknown as Player[];
    },
    get: async (id: string) => {
      const result = await blink.db.players.get(id);
      return result as unknown as Player | null;
    }
  },
  leagues: {
    list: async () => {
      const result = await blink.db.leagues.list();
      return result as any[];
    }
  }
};
