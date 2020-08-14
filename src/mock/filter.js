const taskToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
  watched: (films) => films.filter((film) => film.isWatched).length,
  favorites: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilter = (films) => {
  // return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
  return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(films),
    };
  });
};
