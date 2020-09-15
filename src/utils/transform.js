// Функции обработки представления данных
import moment from "moment";

const MIN_DAYS_TO_DATE = 10;

/* функции работы с датой и временем */

// трансформация даты комментария
export const getDateComment = (date, transformType) => {

  if (moment(Date.now()).diff(moment(date), `days`) >= MIN_DAYS_TO_DATE) {
    return transformDateTime(date, transformType);
  }

  return moment(date).fromNow();
};

// общая трансформации даты
export const transformDateTime = (dateTime, transformType) => {
  return moment(dateTime).format(transformType);
};

export const diffWithCurrentDate = (dateToCompare, mode) => {
  return moment(Date.now()).diff(moment(dateToCompare), mode, true);
};

// трансформации длительности фильма
export const translateMinutesToText = (duration) => {
  const MS_IN_MIN = 1000;
  const MIN_IN_HOUR = 60;

  const durationInMoment = moment.duration(duration * MS_IN_MIN * MIN_IN_HOUR);
  const formatted = moment.utc(durationInMoment.asMilliseconds()).format(`H[h ]m[m]`);

  return formatted;
};

/* функции сортировки */

export const sortDate = (prevFilm, nextFilm) => {
  return nextFilm.filmDate.getTime() - prevFilm.filmDate.getTime();
};

export const sortRating = (prevFilm, nextFilm) => {
  return nextFilm.rating - prevFilm.rating;
};

/* сортировка для блоков top */
export const generateTopRated = (films) => {
  return films.slice()
    .filter((film) => Number(film.rating) > 0)
    .sort(sortRating);
};

export const generateTopCommented = (films) => {
  return films.slice()
    .filter((film) => film.comments.length > 0)
    .sort((prevFilm, nextFilm) => nextFilm.comments.length - prevFilm.comments.length);
};

