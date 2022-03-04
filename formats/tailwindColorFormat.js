/** @format */

const _ = require('lodash');
const { fileHeader } = require('style-dictionary/lib/common/formatHelpers');

const tailwindColorFormat = function ({
  dictionary: { allTokens },
  options: { cssVariable },
  file,
}) {
  const toCssVariable = (path) => {
    return `var(--${path.join('-').toLowerCase()})`;
  };

  const colors = {};

  allTokens.forEach((token) => {
    const { path, value } = token;

    _.setWith(
      colors,
      path.slice(1).join('.'),
      cssVariable ? toCssVariable(path) : value,
      Object
    );
  });

  return (
    fileHeader({ file }) +
    'module.exports' +
    ' = ' +
    JSON.stringify(colors, null, 2) +
    ';'
  );
};

module.exports = tailwindColorFormat;
