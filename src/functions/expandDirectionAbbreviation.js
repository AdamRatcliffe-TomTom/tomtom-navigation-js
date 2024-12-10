const endRegExp = /\b([NSEW])\s*$/;
const startRegExp = /^\s*([NSEW])\b/;
const directionMapping = {
  N: "North",
  E: "East",
  S: "South",
  W: "West"
};

export default function expandDirectionAbbreviation(inputString) {
  const endMatch = inputString.match(endRegExp);

  if (endMatch && endMatch[1]) {
    const abbreviation = endMatch[1];
    const expandedDirection = directionMapping[abbreviation];
    const expandedString = inputString.replace(
      new RegExp(abbreviation + "\\s*$"),
      expandedDirection
    );

    return expandedString;
  }

  const beginningMatch = inputString.match(startRegExp);

  if (beginningMatch && beginningMatch[1]) {
    const abbreviation = beginningMatch[1];
    const expandedDirection = directionMapping[abbreviation];

    const expandedString = inputString.replace(
      new RegExp("^" + abbreviation + "\\s*"),
      expandedDirection
    );

    return expandedString;
  }

  return inputString;
}
