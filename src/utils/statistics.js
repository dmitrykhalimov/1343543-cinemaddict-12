import {diffWithCurrentDate} from "../utils/transform.js";
import {StatsMode} from "../const.js";

const DatePatterns = {
  ALL: {
    MODE: `days`,
    MAX_LIMIT: Infinity,
  },
  TODAY: {
    MODE: `days`,
    MAX_LIMIT: 1,
  },
  WEEK: {
    MODE: `days`,
    MAX_LIMIT: 7,
  },
  MONTH: {
    MODE: `months`,
    MAX_LIMIT: 1,
  },
  YEAR: {
    MODE: `years`,
    MAX_LIMIT: 1,
  },
};

export const generateStats = (films, mode) => {
  let filmsStats = films.slice();
  let genres = [];

  /* Не самый изящный метод сортировки, но ничего лаконичнее придумать не смог */
  // 1. Отфильтровать фильмы по дате и собрать все жанры подходящих фильмов
  filmsStats = filmsStats.filter((film) => {
    if (diffWithCurrentDate(film.watchingDate, DatePatterns[mode].MODE) < DatePatterns[mode].MAX_LIMIT) {
      genres = genres.concat(Array.from(film.genres));
      return true;
    }
    return false;
  });

  // 2. Узнать какие жанры есть и создать объект
  let genresQuantity = {};

  for (let genre of genres) {
    if (!genresQuantity[genre]) {
      genresQuantity[genre] = 0;
    }
    genresQuantity[genre]++;
  }

  // 3. Отсортировать объект
  genresQuantity = new Map(Object.entries(genresQuantity));
  genresQuantity = new Map([...genresQuantity.entries()].sort((a, b) => b[1] - a[1]));

  return {
    watched: filmsStats.length,
    topGenre: Array.from(genresQuantity)[0][0],
    stats: Array.from(genresQuantity),
  };
};
