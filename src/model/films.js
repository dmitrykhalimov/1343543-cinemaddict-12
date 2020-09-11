import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          age: film.film_info.age_rating,
          cast: film.film_info.actors.join(`, `),
          commentsId: film.comments,
          country: film.film_info.release.release_country,
          description: film.film_info.description,
          director: film.film_info.director,
          duration: film.film_info.runtime,
          filmDate: new Date(film.film_info.release.date),
          genres: new Set(film.film_info.genre),
          id: film.id,
          isFavorite: film.user_details.favorite,
          isInWatchList: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          title: film.film_info.title,
          titleOriginal: film.film_info.alternative_title,
          watchingDate: new Date(film.user_details.watching_date),
          writers: film.film_info.writers.join(`, `),
        }
    );

    delete adaptedFilm.comments;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }
}
