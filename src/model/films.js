
import Observer from "../utils/observer.js";

const ServerNames = {
  FILM_INFO: `film_info`,
  AGE_RATING: `age_rating`,
  COMMENTS: `comments`,
  ALTERNATIVE_TITLE: `alternative_title`,
  RELEASE_COUNTRY: `release_country`,
  TOTAL_RATING: `total_rating`,
  USER_DETAILS: `user_details`,
  ALREADY_WATCHED: `already_watched`,
  WATCHING_DATE: `watching_date`,
  FAVORITE: `favorite`,
  WATCHLIST: `watchlist`,
  ACTORS: `actors`,
  DESCRIPTION: `description`,
  DIRECTOR: `director`,
  GENRE: `genre`,
  POSTER: `poster`,
  RELEASE: `release`,
  DATE: `date`,
  RUNTIME: `runtime`,
  TITLE: `title`,
  WRITERS: `writers`,
};

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
        }
    );

    delete adaptedFilm.comments;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

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

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          author: comment.nickname,
          date: comment.dateComment.toISOString(),
          emotion: comment.emoji,
        }
    );

    delete adaptedComment.nickname;
    delete adaptedComment.dateComment;
    delete adaptedComment.emoji;

    return adaptedComment;
  }

  static adaptNewCommentToServer(comment) {
    const adaptedComment = comment;
    delete adaptedComment.filmId;
    return adaptedComment;
  }

  static adaptNewCommentToClient(movieAndComment) {
    const adaptedMovie = this.adaptFilmsToClient(movieAndComment.movie);
    let adaptedComments = movieAndComment.comments;
    adaptedComments = adaptedComments.map((comment) => {
      return this.adaptCommentsToClient(comment);
    });
    adaptedMovie[`comments`] = adaptedComments;
    return adaptedMovie;
  }

  static adaptFilmToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          [ServerNames.COMMENTS]: film.commentsId,
          [ServerNames.FILM_INFO]: {
            [ServerNames.ACTORS]: film.cast.split(`, `),
            [ServerNames.AGE_RATING]: film.age,
            [ServerNames.ALTERNATIVE_TITLE]: film.titleOriginal,
            [ServerNames.DESCRIPTION]: film.description,
            [ServerNames.DIRECTOR]: film.director,
            [ServerNames.GENRE]: Array.from(film.genres),
            [ServerNames.POSTER]: film.poster,
            [ServerNames.RELEASE]: {
              [ServerNames.DATE]: film.filmDate.toISOString(),
              [ServerNames.RELEASE_COUNTRY]: film.country,
            },
            [ServerNames.RUNTIME]: film.duration,
            [ServerNames.TITLE]: film.title,
            [ServerNames.TOTAL_RATING]: film.rating,
            [ServerNames.WRITERS]: film.writers.split(`, `),
          },
          [ServerNames.USER_DETAILS]: {
            [ServerNames.ALREADY_WATCHED]: film.isWatched,
            [ServerNames.FAVORITE]: film.isFavorite,
            [ServerNames.WATCHING_DATE]: (film.watchingDate === null) ? null : film.watchingDate.toISOString(),
            [ServerNames.WATCHLIST]: film.isInWatchlist,
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
    delete adaptedFilm.isInWatchlist;
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
