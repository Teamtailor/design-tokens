/** @format */

const _ = require('lodash');
const { fileHeader } = require('style-dictionary/lib/common/formatHelpers');

const tailwindColorFormat = function ({
  dictionary: { allTokens },
  options: { cssVariable },
  file,
}) {
  const toCssVariable = (path) => {
    return `var(--${path.join('-')})`;
  };

  const colors = {};

  allTokens.forEach((token) => {
    const { path, value } = token;

    const cleanPath = path.filter((val) => val !== 'DEFAULT');

    _.setWith(
      colors,
      path.slice(1).join('.'),
      cssVariable ? toCssVariable(cleanPath) : value,
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
