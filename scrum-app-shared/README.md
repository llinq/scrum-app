# @scrum-app/shared

Shared utilities and common code used across the scrum-app monorepo.

## Purpose

This package contains shared TypeScript code that is used by multiple workspace packages (API and Web). It ensures consistency and follows the DRY (Don't Repeat Yourself) principle.

## Contents

### URL Validation

The `isValidCallbackUrl` function validates callback URLs to prevent open redirect vulnerabilities.

```typescript
import { isValidCallbackUrl } from '@scrum-app/shared';

const url = '/retro/123';
if (isValidCallbackUrl(url)) {
  // Safe to redirect
}
```

## Usage

### In API (scrum-app-api)

```typescript
import { isValidCallbackUrl } from '@scrum-app/shared';
```

### In Web (scrum-app-web)

```typescript
import { isValidCallbackUrl } from '@scrum-app/shared';
```

## Development

### Build

```bash
cd scrum-app-shared
yarn build
```

This compiles TypeScript files from `src/` to `dist/` with type definitions.

### Adding New Utilities

1. Add new `.ts` files in `src/`
2. Export from `src/index.ts`
3. Run `yarn build`
4. Import in other packages using `@scrum-app/shared`

## Type Safety

The package generates TypeScript declaration files (`.d.ts`) ensuring full type safety when used in other workspace packages.
