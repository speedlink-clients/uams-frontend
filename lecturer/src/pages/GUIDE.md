# App Directory Guide

This directory contains the main application structure, including pages and layouts.

## Conventions

### Pages (`src/pages`)
- **Organization**: Group pages by feature or route hierarchy For example, group authentication-related pages under auth/ (e.g., auth/login.tsx) and dashboard-related pages under dashboard/ (e.g., dashboard/overview.tsx). This makes the project easier to navigate, scale, and maintain.
- **Exports**: Use `default export` for the page component.

## Rules

1. **No Business Logic**: Keep pages lightweight. Delegate data fetching and complex logic to custom hooks (`src/hooks`) or stores (`src/stores`).
2. **Composition**: Compose pages using components from `src/components`.
3. **Routing**: Define routes in `src/routes`, not directly in the page files (unless using file-system routing which we are NOT using here).
