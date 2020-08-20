// Функции обработки представления данных

export const getOnlyYearFromDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`});
};

export const getDateDetailed = (date) => {
  return date.toLocaleString(`en-GB`, {year: `numeric`, day: `2-digit`, month: `long`});
};

export const getDateComment = (date) => {
  return date.toLocaleString(`en-ZA`);
};

export const translateMinutesToText = (duration) => {
  const MIN_IN_HOUR = 60;

  const hours = Math.trunc(duration / MIN_IN_HOUR);
  const minutes = duration - (hours * MIN_IN_HOUR);

  return `${hours}h ${minutes}m`;
};

export const sortDate = (filmA, filmB) => {
  return filmB.filmDate.getTime() - filmA.filmDate.getTime();
};

export const sortRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

