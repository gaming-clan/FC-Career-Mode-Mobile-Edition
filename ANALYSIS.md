# Codebase Analysis: Football Career Manager (Android)

This analysis provides a comprehensive overview of the current state of the repository, identified blockers, and steps required to create a functioning Android project.

---

## 1. Project Overview

**FC Career Mode Mobile Edition** is a football management simulator designed for Android using a modern mobile development stack.

### Key Technologies
- **Framework:** [Expo](https://expo.dev/) (SDK 54) with [React Native](https://reactnative.dev/).
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing).
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native).
- **API Strategy:** [tRPC](https://trpc.io/) for type-safe communication between frontend and backend.
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with a **MySQL** driver.
- **Authentication:** Manus OAuth (integrated via `@/lib/_core/auth`).
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query).

### Architecture
The project is split into a **Frontend (App)** and a **Backend (Server)**:
- **App:** Located in the `app/` directory, using Expo's managed workflow.
- **Server:** Located in the `server/` directory, intended to be a Node.js Express server providing the tRPC API.

---

## 2. Identified Blockers (Critical Missing Files)

The project is currently in a non-functional state due to several missing core framework files and directories. These are essential for the backend to start and for the frontend to communicate with the API.

### Missing Critical Files:
1. **`server/_core/index.ts`**: This is the main entry point for the backend server (referenced in `package.json` and `app.config.ts`).
2. **`server/_core/sdk.ts`**: Required for request authentication (referenced in `server/_core/context.ts`).
3. **`server/_core/trpc.ts`**: Defines the base tRPC router and procedures (referenced in `server/routers.ts`).
4. **`server/_core/systemRouter.ts`**: Handles system-level API calls (referenced in `server/routers.ts`).
5. **`server/_core/cookies.ts`**: Manages session cookies (referenced in `server/routers.ts`).
6. **`shared/` directory**: The entire shared directory (referenced in `tsconfig.json` as `@shared/*`) is missing. This likely contains shared constants and types (e.g., `shared/const.ts`).

### Recommendations for Resolution:
- These files appear to be part of a boilerplate or framework. If this project was generated from a template, ensure all template files were correctly committed.
- Reconstruct the missing files based on their usage in `server/routers.ts` and `server/db.ts`.

---

## 3. Setup and Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)
- A running **MySQL** instance.

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
# Database connection string
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# OAuth Configuration (Provided by Manus platform)
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=your_portal_url
OAUTH_SERVER_URL=your_server_url
```

### Step 3: Database Setup
Push the schema to your MySQL database:
```bash
pnpm db:push
```

### Step 4: Start Development Servers
This command starts both the Metro bundler (for the app) and the Express server (for the API):
```bash
pnpm dev
```

---

## 4. Android Development & Build

### Running on Android
To run the app on an Android emulator or a physical device (via Expo Go or a Development Build):
```bash
pnpm android
```

### Android Configuration (`app.config.ts`)
- **Package Name:** `space.manus.football.career.manager.t20260201115908` (automatically normalized).
- **Minimum SDK:** 24 (Android 7.0).
- **Build Architectures:** `armeabi-v7a`, `arm64-v8a`.
- **Deep Linking:** Uses the `manus20260201115908` scheme for OAuth callbacks.

### Building the APK/AAB
The project is configured for EAS (Expo Application Services) or local builds.
1. **Install EAS CLI:** `npm install -g eas-cli`
2. **Login:** `eas login`
3. **Build:** `eas build --platform android`

---

## 5. Technical Discrepancies
- **Database:** The `README.md` mentions SQLite for local persistence, but `drizzle.config.ts` and `package.json` are strictly configured for **MySQL**. For a true mobile-only offline experience, the project should migrate to `expo-sqlite` or similar.
- **Orientation:** The app is locked to `portrait` in `app.config.ts`, which is optimal for management simulators.
