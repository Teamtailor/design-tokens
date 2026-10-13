# Teamtailor Design tokens

Repository for converting Figma design tokens into readable format for Tailwind to be used in all Teamtailor apps.

## Install

```
yarn add -D @teamtailor/design-tokens
```

## Usage

### Tailwind v4

Import the generated `@theme` block after Tailwind's own theme. It adds the spectrum (`bg-zinc-100`) and the functional colours (`bg-neutral`, `text-icon-success`, `border-neutral-medium`, `outline-focus`, `shadow-canvas`).

```css
@import 'tailwindcss/theme.css' layer(theme);
@import '@teamtailor/design-tokens/src/output/tailwind-theme.css';
```

The functional colours point at variables, so the theme files below are still needed at runtime, and `colors-spectrum.css` if your own CSS uses `var(--color-zinc-100)` and similar.

### Tailwind v3

To use this inside your Tailwind config you should import the relevant config into `tailwind.config.js` inside your project and override the theme conf for that setting.

#### Example

```javascript
// tailwind.config.js
const { tokenColors, themeColors } = require("@teamtailor/design-tokens")

module.exports = {
  // ...
  theme: {
    colors: {
      ...tokenColors,
    },
    extend: {
      backgroundColor: {
        ...themeColors.background,
      },
      textColor: {
        ...themeColors.text,
        icon: {
          ...themeColors.icon,
        },
      },
      borderColor: {
        ...themeColors.border,
      },
    },
  },
};
```

### Themes

Make sure to import the specific theme css files to be able to use functional color names.

Css files are located here and are apply by using `.theme-light` or `.theme-dark`, on a wrapper.

```
@teamtailor/design-tokens/src/output/theme-light.css';
@teamtailor/design-tokens/src/output/theme-dark.css';
```

## Change colors

1. Create a branch and make changes in `tokens.json`
2. Push it. GitHub Actions regenerates `src/output` and `dist/output` and commits them to your branch (or run `npm install && npm run build` yourself)
3. Create a PR. Merging bumps the version and publishes the package
4. Update package.json in your repo with the new version
