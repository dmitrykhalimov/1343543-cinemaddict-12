import FilmCardView from "../view/film-card.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {generateId} from "../mock/film.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Film {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._siteBody = document.querySelector(`body`);

    this.openFilmPopup = this.openFilmPopup.bind(this);
    this._closeFilmPopup = this._closeFilmPopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmDetailsComponent.setPopupClickHandler(this._closeFilmPopup);
    this._filmComponent.setCardClickHandler(this.openFilmPopup);

    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setEmojiClickHandler();
    this._filmDetailsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._filmDetailsComponent.setAddCommentHandler(this._handleAddComment);


    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmDetailsComponent, prevFilmDetailsComponent);

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmPopup();
    }
  }

  openFilmPopup() {
    this._siteBody.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closeFilmPopup() {
    this._siteBody.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeFilmPopup();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._mode === Mode.DEFAULT ? UpdateType.MAJOR : UpdateType.POPUP,
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
        UserAction.UPDATE_FILM,
        this._mode === Mode.DEFAULT ? UpdateType.MAJOR : UpdateType.POPUP,
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
        UserAction.UPDATE_FILM,
        this._mode === Mode.DEFAULT ? UpdateType.MAJOR : UpdateType.POPUP,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleDeleteClick(commentId) {
    const index = this._film.comments.findIndex((comment) => comment.id === Number(commentId));
    const updatedComments = [
      ...this._film.comments.slice(0, index),
      ...this._film.comments.slice(index + 1)
    ];
    const updatedFilm = Object.assign(
        {},
        this._film,
        {
          comments: updatedComments
        }
    );
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.POPUP,
        updatedFilm
    );
  }

  _handleAddComment(newComment, newEmoji) {
    const updatedComments = this._film.comments.slice();
    updatedComments.push({
      id: generateId(),
      emoji: newEmoji,
      comment: newComment,
      nickname: `Fancy troll`, // тут должно генерироваться имя, сделаю в 8 модуле, когда откажусь от моков, и часть функций перенсу в utils
      dateComment: new Date(),
    });

    const updatedFilm = Object.assign(
        {},
        this._film,
        {
          comments: updatedComments
        }
    );

    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.POPUP,
        updatedFilm
    );
  }
}
