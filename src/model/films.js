
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

  static adaptFilmsToClient(film) {
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
          isInWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          title: film.film_info.title,
          titleOriginal: film.film_info.alternative_title,
          watchingDate: new Date(film.user_details.watching_date),
          writers: film.film_info.writers.join(`, `),
          datesToReturn: {
            filmDate: film.film_info.release.date,
            watchingDate: film.user_details.watching_date,
          }
        }
    );

    delete adaptedFilm.comments;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    console.log(adaptedFilm);
    return adaptedFilm;
  }

  static adaptCommentsToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          nickname: comment.author,
          dateComment: new Date(comment.date),
          emoji: comment.emotion,
        }
    );

    delete adaptedComment.author;
    delete adaptedComment.date;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptFilmToServer(film) {
    /* eslint-disable camelcase */
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          comments: film.commentsId,
          film_info: {
            actors: film.cast.split(`, `),
            age_rating: film.age,
            alternative_title: film.titleOriginal,
            description: film.description,
            director: film.director,
            genre: Array.from(film.genres),
            poster: film.poster,
            release: {
              date: film.datesToReturn.filmDate,
              release_country: film.country,
            },
            runtime: film.duration,
            title: film.title,
            total_rating: film.rating,
            writers: film.writers.split(`, `),
          },
          user_details: {
            already_watched: film.isWatched,
            favorite: film.isFavorite,
            watching_date: film.datesToReturn.watchingDate,
            watchlist: film.isInWatchlist,
          }
        }
    );

    delete adaptedFilm.age;
    delete adaptedFilm.cast;
    delete adaptedFilm.commentsId;
    delete adaptedFilm.country;
    delete adaptedFilm.datesToReturn;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.duration;
    delete adaptedFilm.filmDate;
    delete adaptedFilm.genres;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isInWatchList;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.title;
    delete adaptedFilm.titleOriginal;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.writers;

    return adaptedFilm;
  }
}
