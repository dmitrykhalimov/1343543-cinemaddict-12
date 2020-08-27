import FilmCardView from "../view/film-card.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition} from "../utils/render.js";

export default class Film {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._siteBody = document.querySelector(`body`);

    this._openFilmPopup = this._openFilmPopup.bind(this);
    this._closeFilmPopup = this._closeFilmPopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmDetailsComponent.setPopupClickHandler(this._closeFilmPopup);
    this._filmComponent.setCardClickHandler(this._openFilmPopup);

    render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
  }

  _openFilmPopup() {
    this._siteBody.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _closeFilmPopup() {
    this._siteBody.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeFilmPopup();
    }
  }
}
