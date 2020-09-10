import {FilterType, FilterMode} from "../const.js";

export const makeFilters = (films, mode) => {
  const initialValue = {
    [FilterType.ALL]: [],
    [FilterType.WATCHLIST]: [],
    [FilterType.HISTORY]: [],
    [FilterType.FAVORITES]: [],
  };

  const filteredFilms = films.reduce((acc, film) => {
    acc[FilterType.ALL].push(film);
    if (film.isInWatchlist) {
      acc[FilterType.WATCHLIST].push(film);
    }
    if (film.isWatched) {
      acc[FilterType.HISTORY].push(film);
    }
    if (film.isFavorite) {
      acc[FilterType.FAVORITES].push(film);
    }
    return acc;
  }, initialValue);

  if (mode === FilterMode.COUNT) {
    return {
      [FilterType.ALL]: filteredFilms[FilterType.ALL].length,
      [FilterType.WATCHLIST]: filteredFilms[FilterType.WATCHLIST].length,
      [FilterType.HISTORY]: filteredFilms[FilterType.HISTORY].length,
      [FilterType.FAVORITES]: filteredFilms[FilterType.FAVORITES].length,
    };
  }
  return filteredFilms;
};
