# Client (Simplified)

This README explains the simplified client structure for learners and how the pieces connect.

## Key files

- `src/api/`:
  - `axiosInstance.js` - single axios instance with base URL and auth token handling.
  - `authApi.js`, `tasksApi.js` - small functions that call the backend and return the `data` payload.

- `src/context/AuthContext.jsx` - Provides `useAuth()` hook and `AuthProvider`.

- `src/components/` - Small UI components: `FormInput.jsx`, `FormTextarea.jsx`, `Button.jsx`, `TaskForm.jsx`, `TaskCard.jsx`, `NavBar.jsx`, `Modal.jsx`, and `ProtectedRoute.jsx`.

- `src/pages/`:
  - `Landing.jsx` - public landing page at `/`.
  - `Home.jsx` - protected dashboard at `/home`.
  - `Tasks.jsx`, `Login.jsx`, `Register.jsx` - other pages.

## Routing

- `/` → Landing (public)
- `/home` → Home (protected)
- `/tasks` → Tasks (protected)
- `/login`, `/register` → auth pages

## How auth and createdBy work

- On login the server returns `{ status, message, data, token }` where `data` contains user fields.
- `authApi.login` stores `token` and `data` in `localStorage`.
- `axiosInstance` reads `authToken` from `localStorage` and sets `Authorization: Bearer TOKEN` header.
- `TaskForm` reads the user from `useAuth()` (or `localStorage`) and sets `createdBy` to `user.userId` (or other fallbacks) so backend validation succeeds.

## Quick test

1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Visit the app, register/login, then visit `/home` and create tasks.
