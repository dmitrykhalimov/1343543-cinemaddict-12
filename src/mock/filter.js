const countFilter = (nameFilter) => {
  return (accumulator, film) => {
    return accumulator + film[nameFilter];
  };
};

const taskToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.reduce(countFilter(`isInWatchlist`), 0),
  watched: (films) => films.reduce(countFilter(`isWatched`), 0),
  favorites: (films) => films.reduce(countFilter(`isFavorite`), 0),
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
