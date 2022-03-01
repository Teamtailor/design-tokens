/** @format */

const tailwindBorderColorFormat = function ({ dictionary, options }) {
  let colorsArray = dictionary.allTokens.filter(
    ({ type, attributes: { category } }) => {
      return type === 'color' && category === 'light';
    }
  );

  const uniqueTypes = colorsArray
    .map((item) => item.attributes.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  let colors = 'module.exports = {';
  let hasItem = false;

  uniqueTypes.map((uniqueType) => {
    colors += `'${uniqueType}': {\n`;

    colorsArray
      .filter(({ attributes: { type } }) => type === uniqueType)
      .map((token) => {
        let {
          attributes: { item, subitem, state },
          value,
        } = token;

        hasItem = !!item;

        if (item !== undefined) {
          colors += `${[item]}: '${value}',\n`;
        } else if (item === undefined) {
          colors = colors.slice(0, -3);
          colors += ` '${value}',\n`;
        }
      });
    if (hasItem) {
      colors += '},\n';
    }
  });
  //console.log(colors);
  colors += '}';

  return colors;
};

module.exports = tailwindBorderColorFormat;
