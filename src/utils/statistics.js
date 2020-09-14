import {diffWithCurrentDate} from "../utils/transform.js";


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

const RANKS = [
  {
    '': 0
  },
  {
    'Novice': 10
  },
  {
    'Fan': 20
  },
  {
    'Movie buff': Infinity
  }
];

export const getRankName = (films) => {
  const quantityWatched = films.filter((film) => film.isWatched).length;
  for (let i = 0; i < RANKS.length; i++) {
    if (quantityWatched <= Object.values(RANKS[i])) {
      return Object.keys(RANKS[i])[0];
    }
  }
  return ``;
};

export const generateStats = (films, mode) => {
  let filmsStats = films.slice();
  let genres = [];
  let totalDuration = 0;

  /* Не самый изящный метод сортировки, но ничего лаконичнее придумать не смог */
  // 1. Отфильтровать фильмы по дате и собрать все жанры подходящих фильмов. Предполагается, что структура данных нормальная, и невозможна ситуация когда isWatched = false, а время просмотра не null;

  const initialValue = {
    filmsWatched: [],
    genres: [],
    totalDuration: 0,
    genresQuantity: {}
  };

  const filmStatsNew = films.slice().reduce((acc, film) => {
    if ((diffWithCurrentDate(film.watchingDate, DatePatterns[mode].MODE) < DatePatterns[mode].MAX_LIMIT) && film.isWatched) {
      acc.filmsWatched.push(film);
      acc.genres = acc.genres.concat(Array.from(film.genres));
      acc.totalDuration += film.duration;

      for (const genre of film.genres) {
        if (!acc.genresQuantity[genre]) {
          acc.genresQuantity[genre] = 0;
        }
        acc.genresQuantity[genre]++;
      }
    }
    return acc;
  }, initialValue);

  filmsStats = filmsStats.filter((film) => {
    if (diffWithCurrentDate(film.watchingDate, DatePatterns[mode].MODE) < DatePatterns[mode].MAX_LIMIT && film.isWatched) {
      genres = genres.concat(Array.from(film.genres));
      totalDuration += film.duration;
      return true;
    }
    return false;
  });

  console.log('старый метод');
  console.log(filmsStats);
  console.log(genres);
  console.log(totalDuration);
  console.log('новый метод')
  console.log(filmStatsNew);
  // 2. Узнать какие жанры есть и создать объект с
  let genresQuantity = {};

  for (let genre of genres) {
    if (!genresQuantity[genre]) {
      genresQuantity[genre] = 0;
    }
    genresQuantity[genre]++;
  }

  console.log(genresQuantity);
  // 3. Отсортировать объект
  genresQuantity = new Map(Object.entries(genresQuantity));
  genresQuantity = new Map([...genresQuantity.entries()].sort((next, prev) => prev[1] - next[1]));

  // 4. Подготовить данные в формате 'график коллеги'

  genresQuantity = Array.from(genresQuantity);

  const sortedGenres = [];
  const sortedNumbers = [];

  genresQuantity.forEach((element) => {
    sortedGenres.push(element[0]);
    sortedNumbers.push(element[1]);
  });

  return {
    watched: filmsStats.length,
    topGenre: genresQuantity.length > 0 ? genresQuantity[0][0] : ``,
    genres: sortedGenres,
    numbers: sortedNumbers,
    durationHours: Math.trunc(totalDuration / 60),
    durationMinutes: totalDuration - Math.trunc(totalDuration / 60) * 60,
    rank: getRankName(films),
  };
};
