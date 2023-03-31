/** @format */

const _ = require('lodash');
const { fileHeader } = require('style-dictionary/lib/common/formatHelpers');

const reactColorFormat= function ({
  dictionary: { allTokens },
  options: { theme },
  file,
}) {
  const colors = {};
  
  allTokens.forEach((token) => {
    const { path, value } = token;

    _.setWith(
      colors,
      path.slice(1).map(a => _.camelCase(a)).join('.'),
      value,
      Object
    );
  });

  return (
    fileHeader({ file }) +
    'module.exports' +
    ' = /** @type {const} */ ' +
    JSON.stringify(colors, null, 2) +
    ';'
  );
};

module.exports = reactColorFormat;
