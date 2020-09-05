// Функции обработки представления данных
import moment from "moment";

/* функции работы с датой и временем */

// трансформация даты комментария
export const getDateComment = (date, transformType) => {
  const MIN_DAYS_TO_DATE = 10;

  if (moment(Date.now()).diff(moment(date), `days`) >= MIN_DAYS_TO_DATE) {
    return transformDateTime(date, transformType);
  }

  return moment(date).fromNow();
};

// общая трансформации даты
export const transformDateTime = (dateTime, transformType) => {
  return moment(dateTime).format(transformType);
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

export const sortDate = (filmA, filmB) => {
  return filmB.filmDate.getTime() - filmA.filmDate.getTime();
};

export const sortRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

