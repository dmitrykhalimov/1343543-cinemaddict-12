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
  const initialValue = {
    filmsWatched: [],
    genres: [],
    totalDuration: 0,
    genresQuantity: new Map(),
  };

  const filmStatsNew = films.reduce((acc, film) => {
    if ((diffWithCurrentDate(film.watchingDate, DatePatterns[mode].MODE) < DatePatterns[mode].MAX_LIMIT) && film.isWatched) {
      acc.filmsWatched.push(film);
      acc.genres = acc.genres.concat(Array.from(film.genres));
      acc.totalDuration += film.duration;

      for (const genre of film.genres) {
        if (!acc.genresQuantity.has(genre)) {
          acc.genresQuantity.set(genre, 0);
        }
        acc.genresQuantity.set(genre, acc.genresQuantity.get(genre) + 1);
      }
    }
    return acc;
  }, initialValue);

  // мне по-прежнему не нравится этот кусок, постараюсь чего-нибудь с reduce еще придумать
  filmStatsNew.genresQuantity = new Map([...filmStatsNew.genresQuantity].sort((next, prev) => prev[1] - next[1]));
  filmStatsNew.genresQuantity = Array.from(filmStatsNew.genresQuantity);

  const sortedGenres = [];
  const sortedNumbers = [];

  filmStatsNew.genresQuantity.forEach((element) => {
    sortedGenres.push(element[0]);
    sortedNumbers.push(element[1]);
  });

  return {
    watched: filmStatsNew.filmsWatched.length,
    topGenre: filmStatsNew.genresQuantity.length > 0 ? filmStatsNew.genresQuantity[0][0] : ``,
    genres: sortedGenres,
    numbers: sortedNumbers,
    durationHours: Math.trunc(filmStatsNew.totalDuration / 60),
    durationMinutes: filmStatsNew.totalDuration - Math.trunc(filmStatsNew.totalDuration / 60) * 60,
    rank: getRankName(films),
  };
};
