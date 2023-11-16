export const textWrap = (minWidth: number, fontSize: number, text: string) => {
  const longestWordLength = text
    .split(" ")
    .reduce((acc, cur) => Math.max(acc, cur.length), 0);

  return Math.max(minWidth, longestWordLength * (fontSize - 3));
};
