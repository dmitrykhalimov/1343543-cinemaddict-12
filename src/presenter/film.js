import FilmCardView from "../view/film-card.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";

export default class Film {
  constructor(filmsListContainer, changeData) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._siteBody = document.querySelector(`body`);

    this._openFilmPopup = this._openFilmPopup.bind(this);
    this._closeFilmPopup = this._closeFilmPopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    console.log(this._changeData);
    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmDetailsComponent.setPopupClickHandler(this._closeFilmPopup);
    this._filmComponent.setCardClickHandler(this._openFilmPopup);

    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setIWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    console.log('перезапуск');
    console.log(this._filmComponent)
    console.log(prevFilmComponent);

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmDetailsComponent, prevFilmDetailsComponent);

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
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

  _handleFavoriteClick() {
    alert('Запущен хэндлер изменения');
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }
}
