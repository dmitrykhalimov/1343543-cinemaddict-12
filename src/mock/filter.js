export const generateFilter = (films) => {
  const initialValue = {
    all: 0,
    watchlist: 0,
    watched: 0,
    favorites: 0,
  };

  return films.reduce((acc, film) => {
    return {
      all: acc.all + 1,
      watchlist: acc.watchlist + film.isInWatchlist,
      watched: acc.watched + film.isWatched,
      favorites: acc.favorites + film.isFavorite
    };
  }, initialValue);
};
