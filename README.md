# tetra-ui

**shadcn/ui for React Native** — copy-paste components you own, built for mobile with Expo and Uniwind.

[![Documentation](https://img.shields.io/badge/docs-tetra--ui.com-blue)](https://tetra-ui.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[tetra-ui.com](https://tetra-ui.com) · [Documentation](https://tetra-ui.com/docs) · [Components](https://tetra-ui.com/docs/components)

## What is tetra-ui?

tetra-ui brings the [shadcn/ui](https://ui.shadcn.com) philosophy to React Native: beautiful defaults, open code, and a CLI that drops components straight into your app. You are not installing a black-box package — you are building a component library that is yours to shape.

```bash
npx shadcn@latest add @tetra-ui/button
```

Components are styled with [Uniwind](https://docs.uniwind.dev/) (Tailwind for React Native) and tuned for touch, accessibility, and mobile performance.

## Quick start

1. **Install Uniwind** — [docs.uniwind.dev](https://docs.uniwind.dev/)
2. **Add utilities** — `npm install class-variance-authority clsx tailwind-merge`
3. **Configure `components.json`** with the tetra-ui registry:

```json
{
  "registries": {
    "@tetra-ui": "https://tetra-ui.com/r/{name}.json"
  }
}
```

4. **Add a component:**

```bash
npx shadcn@latest add @tetra-ui/button
```

Full setup guide: [tetra-ui.com/docs/installation](https://tetra-ui.com/docs/installation)

## Requirements

- React 19
- React Native [**New Architecture**](https://reactnative.dev/architecture/landing-page)
- [Uniwind](https://docs.uniwind.dev/)
- [Expo](https://docs.expo.dev/) recommended

## Components

30+ components including Button, Card, Form, Select, Bottom Sheet, Native Sheet, Menu (Expo UI), Switch, Slider, and more.

| Component | Install |
|-----------|---------|
| Button | `npx shadcn@latest add @tetra-ui/button` |
| Form | `npx shadcn@latest add @tetra-ui/form` |
| Select | `npx shadcn@latest add @tetra-ui/select` |
| Bottom Sheet | `npx shadcn@latest add @tetra-ui/bottom-sheet` |
| Menu | `npx shadcn@latest add @tetra-ui/menu` |

[Browse all components →](https://tetra-ui.com/docs/components)

## Why tetra-ui?

- **Copy-paste ownership** — same workflow as shadcn/ui on the web
- **Mobile-native** — touch-first interactions, platform-aware patterns
- **Expo-ready** — native Menu, Switch, and Slider via `@expo/ui`
- **Accessible** — semantics and behavior built in from the start
- **Customizable** — edit component source directly in your repo
- **Dark mode** — light/dark theme tokens via CSS variables

## For AI coding agents

- Agent instructions: [AGENTS.md](./AGENTS.md)
- LLM context: [tetra-ui.com/llms.txt](https://tetra-ui.com/llms.txt)
- Full reference: [tetra-ui.com/llms-full.txt](https://tetra-ui.com/llms-full.txt)

## Monorepo structure

```
tetra-ui/
├── apps/
│   ├── docs/          # Documentation site (tetra-ui.com)
│   └── example/       # Expo example app
├── packages/
│   └── tetra-ui/      # Component source
```

## Development

```bash
pnpm install
pnpm dev:docs      # Documentation site
pnpm dev:example   # Expo example app
```

Rebuild the component registry after editing `apps/docs/registry/registry.json`:

```bash
pnpm --filter docs registry:build
```

## When to use tetra-ui

Choose tetra-ui when you want shadcn-style ownership on React Native with Expo and Uniwind. If you need identical components on web and native from one package, consider a universal kit like Tamagui instead.

## License

MIT — see [LICENSE](./LICENSE)
