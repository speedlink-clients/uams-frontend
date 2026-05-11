# UAMS Lecturer Frontend — Project Guide

> **Quick Reference**: This README consolidates every `GUIDE.md` across the `src/` directory so you always have the full architectural conventions in one place.

---

## Project Structure Overview

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Atomic / primitive components (Buttons, Inputs, Dialogs)
│   └── shared/     # Composite, reusable business components (Forms, Tables)
├── configs/        # Global configuration files
├── forms/          # Form logic (react-hook-form + Zod)
├── hooks/          # Custom React hooks (data fetching & reusable logic)
├── pages/          # Page components (grouped by feature)
├── routes/         # Routing configuration
├── schemas/        # Zod validation schemas
├── services/       # API abstraction layer
├── stores/         # Global state management (Zustand)
├── types/          # Shared TypeScript type definitions
└── utils/          # Pure utility / helper functions
```

---

## 1. Components (`src/components/`)

Reusable UI components split into two tiers.

### Directory Structure

| Sub-directory | Purpose |
|---|---|
| `ui/` | Atomic, primitive components (Buttons, Inputs, Dialogs) — typically generated or adapted from a UI library (e.g., Chakra UI snippets, shadcn/ui). **Avoid modifying** unless necessary for global design-system changes. |
| `shared/` | Composite, reusable business components (Forms, Tables) — used across multiple pages or layouts. |

### Conventions

- **Naming**: PascalCase (e.g., `UserProfileCard.tsx`).

### Rules

1. **Presentational Only** — Components receive data via props. Avoid direct API calls or specialized state management within components (use hooks instead).
2. **Prop Drilling** — Use context or composition to avoid excessive prop drilling.
3. **Styling** — Strictly follow the project's theming system. **No** hardcoded colors or magic numbers.

---

## 2. Configs (`src/configs/`)

Global configuration files for the application.

### Conventions

- **Naming**: `*.config.ts` (e.g., `axios.config.ts`, `theme.config.ts`, `env.config.ts`).
- **Exports**: Use named exports or default exports consistently within a file.

### Specific Config Files

| File | Purpose | Key Rule |
|---|---|---|
| `env.config.ts` | Centralized access to environment variables | **NEVER** access `import.meta.env` directly in components. Always import from `@configs/env.config`. |
| `axios.config.ts` | Axios instance configuration | Always use the exported `axiosClient` to ensure interceptors (auth, error handling) are applied. |
| `providers.config.tsx` | Global providers wrapper | Add new global context providers (QueryClientProvider, ThemeProvider) here. |

### Rules

1. **Centralization** — All global settings must live here.
2. **Immutability** — Configuration objects should be treated as read-only runtime constants.

---

## 3. Forms (`src/forms/`)

Form logic separated from UI, powered by `react-hook-form` + Zod.

### Conventions

- **Naming**: `*.form.ts` (e.g., `login.form.ts`).
- **Hook Pattern**: Export a custom hook (e.g., `useLoginForm`) that returns `react-hook-form` methods.

### Example

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@schemas/auth/login.schema";

const useLoginForm = () => {
    return useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { ... }
    });
}
export default useLoginForm;
```

### Rules

1. **Separation of Concerns** — The `.form.ts` file handles schema validation integration and default values. The `.tsx` component handles the UI and submission logic.
2. **Schemas** — Always use Zod schemas imported from `@schemas` for validation.

---

## 4. Hooks (`src/hooks/`)

Custom React hooks for data fetching and reusable logic.

### Conventions

- **Naming**: `*.hook.ts` (e.g., `auth.hook.ts`).
- **Export Pattern**: Use a grouping object for related hooks (e.g., `export const AuthHook = { ... }`).

### Example

```typescript
export const AuthHook = {
    useLogin: (options?: UseMutationOptions<...>) => useMutation({
        mutationFn: (payload) => AuthService.login(payload),
        ...options
    })
}
```

### Rules

1. **React Query Wrappers** — Encapsulate `useQuery` and `useMutation` calls here. **Do not** make raw query calls in components.
2. **Service Integration** — Hooks should call functions from `@services`, which in turn call Axios.
3. **Type Safety** — Explicitly type the query data, error, variables, and context types.

---

## 5. Pages (`src/pages/`)

Page components — the main application views.

### Conventions

- **Organization**: Group pages by feature or route hierarchy. For example, group authentication-related pages under `auth/` (e.g., `auth/login.tsx`) and dashboard-related pages under `dashboard/` (e.g., `dashboard/overview.tsx`). This makes the project easier to navigate, scale, and maintain.
- **Exports**: Use `default export` for the page component.

### Rules

1. **No Business Logic** — Keep pages lightweight. Delegate data fetching and complex logic to custom hooks (`src/hooks`) or stores (`src/stores`).
2. **Composition** — Compose pages using components from `src/components`.
3. **Routing** — Define routes in `src/routes`, not directly in the page files (we are **not** using file-system routing).

---

## 6. Routes (`src/routes/`)

Application routing configuration.

### Conventions

- **Naming**: `*.route.tsx` (e.g., `auth.route.tsx`).
- **Index**: `index.route.tsx` is the main entry point that aggregates all other route files.

### Rules

1. **Modularization** — Break routes down by feature module (Auth, Dashboard, User) rather than one giant route file.
2. **Lazy Loading** — Use `React.lazy` for route components to improve performance.
3. **Layout Wrapping** — Define layout wrappers (e.g., `<Route element={<RootLayout />}>`) here to apply layouts to groups of routes.

---

## 7. Schemas (`src/schemas/`)

Zod validation schemas.

### Conventions

- **Naming**: `*.schema.ts` (e.g., `login.schema.ts`).
- **Structure**: Group schemas by feature / domain logic.

### Rules

1. **Validation** — Use Zod for all validation schemas.
2. **Inference** — Export the inferred type from the schema for use in forms and components:
   ```typescript
   export const userSchema = z.object({ ... });
   export type UserSchema = z.infer<typeof userSchema>;
   ```
3. **Usage** — Schemas should be used by `react-hook-form` via resolvers in `src/forms` or for API response validation in `src/hooks`.

---

## 8. Services (`src/services/`)

API abstraction layer — the **only** place that talks to the backend.

### Conventions

- **Naming**: `*.service.ts` (e.g., `auth.service.ts`).
- **Structure**: Export a simple object with methods.

### Example

```typescript
export const AuthService = {
    login: async (payload: LoginData) => {
        const { data } = await axiosClient.post("/auth/login", payload);
        return data; // Return only the data, not the full axios response object
    }
}
```

### Rules

1. **Stateless** — Services must be stateless functions. Do not store tokens or user data here (pass them as arguments or access current state from store if strictly necessary, but prefer passing args).
2. **Axios Client** — Always use `axiosClient` from `@configs/axios.config` to ensure interceptors work.
3. **No UI Logic** — Do not trigger UI updates (toasts, redirects) here unless handled by the global interceptor. Let the calling hook handle specific UI feedback if needed.

---

## 9. Stores (`src/stores/`)

Global state management using **Zustand**.

### Conventions

- **Naming**: `*.store.ts` (e.g., `user.store.ts`).
- **Persistence**: Use `persist` middleware for state that should survive page refreshes (like auth tokens).

### Example

```typescript
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
        }),
        { name: 'auth-storage' }
    )
);
```

### Rules

1. **Atomic Stores** — Prefer splitting stores by domain (Auth, User, UI) rather than one giant store.
2. **Selectors** — Although Zustand allows accessing the whole state, try to consume only what you need.
3. **Actions** — Define actions (functions to modify state) within the store itself.

---

## 10. Types (`src/types/`)

Shared TypeScript type definitions.

### Conventions

- **Naming**: `*.type.ts` (e.g., `auth.type.ts`, `user.type.ts`).

### Rules

1. **Shared Interfaces** — Put interfaces used by more than one file here (e.g., API response shapes, global data structures).
2. **Re-exporting** — You can re-export inferred types from schemas here if it makes sense contextually, but prefer importing directly from `@schemas` if it's strictly validation-related.
3. **Avoid Enums** — Prefer union types (`'ADMIN' | 'USER'`) or `as const` objects over TypeScript `enum`.

---

## 11. Utils (`src/utils/`)

Pure utility functions and helpers.

### Conventions

- **Naming**: `*.util.ts` (e.g., `date.util.ts`, `format.util.ts`).
- **Scope**: Generic, domain-agnostic helpers.

### Rules

1. **Pure Functions** — Utilities should be pure functions whenever possible (output depends only on input, no side effects).
2. **No Components** — Do not define React components here.
3. **No State** — Utilities should not access global store state directly. Pass necessary data as arguments.

---

## Data Flow Summary

The overall request/data flow follows this chain:

```
Component → Hook → Service → Axios (configured in configs)
    ↑                              ↓
    └── Store (Zustand) ←── API Response
```

1. **Components** render UI and delegate data fetching to **Hooks**.
2. **Hooks** wrap React Query calls and invoke **Services**.
3. **Services** make HTTP requests using the configured **Axios client** from **Configs**.
4. Responses flow back through the hook, optionally updating **Stores** for global state.
5. **Forms** use **Schemas** (Zod) for validation, and **Types** define shared interfaces.
6. **Routes** tie everything together, lazy-loading page components and applying layouts.

---

> 📁 Each directory also has its own `GUIDE.md` with the original, focused documentation.
