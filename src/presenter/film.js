import FilmCardView from "../view/film-card.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

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

    this.handleFilmPopupOpen = this.openFilmPopup.bind(this);
    this._handleFilmPopupClose = this._handleFilmPopupClose.bind(this);

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmDetailsComponent.setPopupClickHandler(this._handleFilmPopupClose);
    this._filmComponent.setCardClickHandler(this.handleFilmPopupOpen);

    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setEmojiClickHandler();
    this._filmDetailsComponent.setDeleteClickHandler(this._handleDeleteComment);
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
      this._handleFilmPopupClose();
    }
  }

  removeEventListener() {
    this._filmDetailsComponent.removePopupEventListener(this._handleEscKeyDown);
  }


  openFilmPopup() {
    this._siteBody.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _handleFilmPopupClose() {
    this._siteBody.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._handleEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handleFilmPopupClose();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.POPUP,
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
        this._mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.POPUP,
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
        this._mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.POPUP,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched,
              watchingDate: (this._film.isWatched) ? null : new Date()
            }
        )
    );
  }

  _handleDeleteComment(commentId) {
    const index = this._film.comments.findIndex((comment) => comment.id === commentId);
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

    const filmToUpdate = {
      idToDelete: commentId,
      filmWithoutComment: updatedFilm,
      filmId: updatedFilm.id,
      filmDetailsComponent: this._filmDetailsComponent
    };

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.POPUP,
        filmToUpdate
    );
  }

  _handleAddComment(textComment, emojiComment) {
    const comment = {
      commentBody: {
        "filmId": this._film.id,
        "comment": textComment,
        "date": (new Date()).toISOString(),
        "emotion": emojiComment,
      },
      filmDetailsComponent: this._filmDetailsComponent
    };
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.POPUP,
        comment
    );
  }
}
