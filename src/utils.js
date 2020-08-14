export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFromArray = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getOnlyYearFromDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`});
};

export const getDateDetailed = (date) => {
  return date.toLocaleString(`en-GB`, {year: `numeric`, day: `2-digit`, month: `long`});
};

export const getDateComment = (date) => {
  return date.toLocaleString(`en-ZA`);
};
