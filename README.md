# tt-design-tokens

Repository for converting Figma design tokens into readable format for Tailwind to be used in all Teamtailor apps.

## Install

Add the following line to your `package.json`

```
"tt-design-tokens": "git+ssh://git@github.com:Teamtailor/design-tokens.git"
```

## Usage

To use this inside your Tailwind config you should import the relevant config into `tailwind.config.js` inside your project and override the theme conf for that setting.

#### Example

```javascript
// tailwind.config.js
const tokenColors = require('tt-design-tokens/output/color.tokens.tailwind.js');

module.exports = {
  // ...
  theme: {
    colors: {
      ...tokenColors,
    },
  },
};
```

## Configs

These are the possible config files that you can use inside your tailwind.config.js

| Config | File path                       |
| ------ | ------------------------------- |
| colors | output/color.tokens.tailwind.js |
