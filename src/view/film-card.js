import AbstractView from "./abstract.js";
import {translateMinutesToText, transformDateTime} from "../utils/transform.js";
import {DateFormats} from "../const.js";

const MAX_DESCRIPTION_LENGTH = 140;

export const createFilmCard = (task) => {
  const {title, rating, filmDate, duration, genres, poster, description, isInWatchlist, isWatched, isFavorite, comments} = task;
  const returnActive = (item) => {
    const resultClass = item
      ? `film-card__controls-item--active`
      : ``;
    return resultClass;
  };

  const shortenDescription = (descriptionToShorten) => {
    return descriptionToShorten.slice(0, MAX_DESCRIPTION_LENGTH - 1) + `...`;
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${transformDateTime(filmDate, DateFormats.ONLY_YEAR)}</span>
      <span class="film-card__duration">${translateMinutesToText(duration)}</span>
      <span class="film-card__genre">${genres.size > 0 ? genres.values().next().value : ``}</span>
    </p>
    <img src="./${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length <= MAX_DESCRIPTION_LENGTH ? description : shortenDescription(description)}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${returnActive(isInWatchlist)}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${returnActive(isWatched)}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${returnActive(isFavorite)}">Mark as favorite</button>
    </form>
    </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  setCardClickHandler(callback) {
    this._callback.cardClick = callback;
    this.getElement().querySelector(`img`).addEventListener(`click`, this._cardClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._cardClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._cardClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  _cardClickHandler(evt) {
    evt.preventDefault();
    this._callback.cardClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }
}
