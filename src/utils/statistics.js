import {getDifferenceWithCurrentDate} from "../utils/transform.js";


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
  for (const rank of RANKS) {
    if (quantityWatched <= Object.values(rank)) {
      return Object.keys(rank)[0];
    }
  }
  return ``;
};

export const generateStats = (films, mode) => {
  const initialStats = {
    filmsWatched: [],
    genres: [],
    totalDuration: 0,
    genresQuantity: new Map(),
  };

  const filmStats = films.reduce((acc, film) => {
    if ((getDifferenceWithCurrentDate(film.watchingDate, DatePatterns[mode].MODE) < DatePatterns[mode].MAX_LIMIT) && film.isWatched) {
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
  }, initialStats);

  filmStats.genresQuantity = new Map([...filmStats.genresQuantity].sort((next, prev) => prev[1] - next[1]));
  filmStats.genresQuantity = Array.from(filmStats.genresQuantity);

  const sortedForStats = filmStats.genresQuantity.reduce((acc, genre) => {
    acc.sortedGenres.push(genre[0]);
    acc.sortedNumbers.push(genre[1]);
    return acc;
  }, {
    sortedGenres: [],
    sortedNumbers: [],
  });

  return {
    watched: filmStats.filmsWatched.length,
    topGenre: filmStats.genresQuantity.length > 0 ? filmStats.genresQuantity[0][0] : ``,
    genres: sortedForStats.sortedGenres,
    numbers: sortedForStats.sortedNumbers,
    durationHours: Math.trunc(filmStats.totalDuration / 60),
    durationMinutes: filmStats.totalDuration - Math.trunc(filmStats.totalDuration / 60) * 60,
    rank: getRankName(films),
  };
};
