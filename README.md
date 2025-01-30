# Teamtailor Design tokens

Repository for converting Figma design tokens into readable format for Tailwind to be used in all Teamtailor apps.

## Install

```
yarn add -D @teamtailor/design-tokens
```

## Usage

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

Do those steps in order to change colors:

1. Create a branch with the name `chore/figma-changes` (we will generate files depending on this branch name)
2. Make changes in `tokens.json`
3. Create a PR. Now will Github actions generate lots of necessary files (and bump version)
4. Update package.json in your repo with the new version
