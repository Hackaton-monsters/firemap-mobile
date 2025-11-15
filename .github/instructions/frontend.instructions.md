---
applyTo: "src/**"
---

This document describes **how Copilot should generate code and structure the project** based on the required tech stack and conventions.

## Tech Stack

Always use the following stack:

- **React Native (Expo)**
- **TypeScript**
- **React (functional components)**
- **State Manager** – but use it **only for auth state** (e.g., Zustand)
- **`@tanstack/react-query`** for API data fetching and caching

## General Principles

1. All application code must live inside the `src` directory.
2. All components must be written as **functional components**:

   ```ts
   type IProps = {
     // define props here
   };

   const Component = ({}: /* props */ IProps) => {
     // component body
   };

   export default Component;
   ```
3. Always use TypeScript:
  - typed props (IProps)
  - typed API responses
  - typed state, auth store, navigation params, etc.
  - Use React.FC for functional components with props
  - When writing types for React components, for props use IProps, for state use IState, place them before component definition
  - Prefer Unions over Enums
  - Prefer Types over Interfaces
  - Prefer immutable data (const, readonly)
  - Utilize TypeScript's strict mode
  - Use optional chaining (?.) and nullish coalescing (??) operators
  - Prefer optional chaining (`?.`) over using `&&` for property access (`@typescript-eslint/prefer-optional-chain`)
  - Define guards inside `.guards.ts` files, ensure they have the correct prefix (e.g. guardIsUser)
4.	Naming conventions:
	-	Components and screens — PascalCase (LoginScreen, UserCard)
	-	Helpers and regular functions — camelCase (formatDate, buildQueryParams)
	-	Hooks — prefix with use (useAuthStore, useLoginMutation)


### Project Structure

We use some sort of feature-sliced design to achieve code isolation, here is common isolated module structure:

```
src/
  ├── api                 # API hooks built on top of react-query. Contains all API calls with hooks.
  ├── app                 # Default expo app folder. Exports the screens, providers, etc from different modules.
  ├── features            # Features (simplified feature-sliced style)
  │   └── feature-name
  │       ├── components
  │       ├── helpers
  │       └── screens
  └── shared              # Shared utilities and UI (helpers, uikit, etc.)
```

#### src/app

This folder is the default entry point for Expo apps. It should re-export the main application component from `src/app`.

#### src/api

Purpose: API hooks built on top of @tanstack/react-query.

Example structure:
```tsx
src/api/
  client.ts          # base API client (fetch/axios configuration)
  auth/
    hooks.ts         # useLoginMutation, useMeQuery, etc.
  users/
    hooks.ts         # useUsersQuery, useUserByIdQuery
  ...
```

##### Rules for Copilot:
	1.	Create a separate folder per domain/entity (auth, users, etc.).
	2.	Inside, expose hooks like useXXXQuery and useXXXMutation:

```tsx
// src/api/auth/hooks.ts
import { useMutation, useQuery } from '@tanstack/react-query';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const useLoginMutation = () =>
  useMutation<LoginResponse, Error, LoginPayload>(async (payload) => {
    // API request implementation
  });
```

	3.	Do not place components inside api, only:
	  -	hooks
	  -	API call functions
	  -	related types


#### src/features

Features are logical slices of functionality.

Example structure:

```tsx
src/features/
  auth/
    components/
      LoginForm.tsx
    screens/
      LoginScreen.tsx
    helpers/
      validateLoginForm.ts
  profile/
    components/
      ProfileHeader.tsx
    screens/
      ProfileScreen.tsx
    helpers/
      mapUserToViewModel.ts
```

Rules:
	-	Each feature has its own directory.
	-	Inside each feature, always use these base folders:
	-	components/ — small, reusable components scoped to the feature
	-	screens/ — navigation screens (page-level components)
	-	helpers/ — helpers/utilities specific to this feature

#### src/shared

Shared, reusable pieces that are not tied to a single feature.

Example structure:

```tsx
src/shared/
  helpers/
    formatDate.ts
    isEmailValid.ts
  uikit/
    Button/
      Button.tsx
    Input/
      Input.tsx
  // more directories can be added if needed
```

##### src/shared/helpers
	-	Generic helpers/utilities:
	-	date formatting
	-	validation
	-	common mappers
