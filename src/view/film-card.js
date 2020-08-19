import AbstractView from "./abstract.js";
import {getOnlyYearFromDate, translateMinutesToText} from "../utils.js";

export const createFilmCard = (task) => {
  const {title, rating, filmDate, duration, genres, poster, description, isInWatchlist, isWatched, isFavorite, comments} = task;
  const returnActive = (item) => {
    const resultClass = item
      ? `film-card__controls-item--active`
      : ``;
    return resultClass;
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getOnlyYearFromDate(filmDate)}</span>
      <span class="film-card__duration">${translateMinutesToText(duration)}</span>
      <span class="film-card__genre">${genres.values().next().value}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
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
  }

  getTemplate() {
    return createFilmCard(this._film);
  }
}
