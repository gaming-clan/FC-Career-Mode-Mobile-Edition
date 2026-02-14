/**
 * Global type definitions for Node.js compatibility
 * Used for server-side files that need access to process
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV?: "development" | "production" | "test";
      DATABASE_URL?: string;
      API_SECRET?: string;
      OAUTH2_CLIENT_ID?: string;
      OAUTH2_CLIENT_SECRET?: string;
      OAUTH2_REDIRECT_URI?: string;
    }
  }

  const process: {
    env: NodeJS.ProcessEnv;
    exit(code?: number): never;
    cwd(): string;
  };
}

export {};
