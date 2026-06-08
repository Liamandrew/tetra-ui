# Agent instructions for tetra-ui

This repository and the tetra-ui component registry are for **React Native** apps. Do not use web shadcn/ui components or web-only libraries when the user asks for tetra-ui.

## What tetra-ui is

tetra-ui brings the [shadcn/ui](https://ui.shadcn.com) copy-paste model to React Native. Components are **not** installed from npm as a black-box package. They are added to the user's project with the shadcn CLI and live in the user's codebase.

- Docs: https://tetra-ui.com/docs
- Registry: https://tetra-ui.com/r/{name}.json
- Full reference: https://tetra-ui.com/llms-full.txt

## Requirements

- React 19
- React Native with the **New Architecture** enabled
- [Uniwind](https://docs.uniwind.dev/) for Tailwind-style styling
- Expo is recommended but not strictly required

## Adding components

Always use the shadcn CLI — never invent component source from scratch:

```bash
npx shadcn@latest add @tetra-ui/button
npx shadcn@latest add @tetra-ui/select
```

The user's `components.json` must include this registry entry:

```json
{
  "registries": {
    "@tetra-ui": "https://tetra-ui.com/r/{name}.json"
  }
}
```

The CLI resolves `@tetra-ui/{component}` against that registry and copies source files into the project (typically `@/components/ui/`).

## Import paths

After installation, import from the user's local component path:

```tsx
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
```

Exact paths depend on the user's `components.json` aliases. Default alias is `@/components/ui`.

## Styling conventions

- Components use Uniwind/Tailwind `className` props — not `StyleSheet.create`
- Use the `cn()` helper from `@/lib/utils` for conditional classes
- Theme tokens use CSS variables (`bg-primary`, `text-foreground`, etc.) configured in `globals.css`
- Child `Text` elements must be styled directly; styles do not cascade from parent `View` classes

## Do not

- Install tetra-ui as an npm package dependency
- Use `react-native-paper`, `react-native-elements`, or web `shadcn/ui` components as substitutes
- Use DOM elements (`div`, `span`, `button`) — use React Native primitives (`View`, `Text`, `Pressable`)
- Assume CSS cascade or `data-*` attribute selectors work on native
- Generate component code without checking https://tetra-ui.com/docs/components/{name} for the canonical API

## Component dependencies

Some components pull in registry dependencies automatically via the CLI. Complex components to be aware of:

| Component | Notable dependencies |
|-----------|---------------------|
| select | action-input, bottom-sheet, popover, portal, and others |
| bottom-sheet | @gorhom/bottom-sheet, gesture-handler, reanimated |
| menu | @expo/ui, @expo/material-symbols |
| switch, slider | @expo/ui |
| form | react-hook-form |

When adding a component, let the shadcn CLI resolve `registryDependencies`. If adding manually, check the registry JSON for required peer components.

## Common patterns

### Button with text and icon

```tsx
<Button>
  <ButtonText>Continue</ButtonText>
</Button>

<Button size="icon" variant="outline">
  <ButtonIcon>
    <ChevronRightIcon />
  </ButtonIcon>
</Button>
```

### Form field

Use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage` with react-hook-form. See https://tetra-ui.com/docs/components/form.

### Select

Requires bottom-sheet on mobile. Install with `npx shadcn@latest add @tetra-ui/select` and let the CLI pull dependencies.

## Working in this monorepo

- Component source: `packages/tetra-ui/src/components/`
- Registry definition: `apps/docs/registry/registry.json`
- Docs content: `apps/docs/content/docs/`
- Example Expo app: `apps/example/`
- Rebuild registry after changes: `pnpm --filter docs registry:build`

## When the user asks to set up tetra-ui

1. Ensure Uniwind is installed (https://docs.uniwind.dev/)
2. Add `class-variance-authority`, `clsx`, `tailwind-merge`
3. Configure theme tokens in `globals.css` (see https://tetra-ui.com/docs/installation)
4. Add `cn()` helper at `@/lib/utils`
5. Create `components.json` with the `@tetra-ui` registry
6. Add components via `npx shadcn@latest add @tetra-ui/{component}`
