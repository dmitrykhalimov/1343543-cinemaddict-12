import BoardView from "../view/board.js";
import NoFilmsView from "../view/no-films.js";
import FilmDetailsView from "../view/film-details.js";
import ButtonView from "../view/button.js";
import ExtraRatedContainerView from "../view/container-rated.js"; // +
import ExtraCommentedContainerView from "../view/container-connected.js"; // +
import FilmsContainerView from "../view/films-container.js"; // +
import FilmCardView from "../view/film-card.js"; // +
import {render, RenderPosition, remove} from "../utils/render.js";

const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;

    this._loadMoreButtonComponent = new ButtonView();

    this._boardComponent = new BoardView(); // сама доска <section class =films>
    this._filmsContainerComponent = new FilmsContainerView(); // контейнер <section class = filmslist>
    this._filmsListContainer = this._filmsContainerComponent.getElement().querySelector(`.films-list__container`); // контейнер section class = filmlist__container

    this._noFilmsComponent = new NoFilmsView();

    this._handleLoadButton = this._handleLoadButton.bind(this);
  }

  // инициализация
  init(boardFilms, boardTopRated, boardTopCommented) {
    this._boardFilms = boardFilms.slice();
    this._boardTopRated = boardTopRated.slice();
    this._boardTopCommented = boardTopCommented.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  // отрисовка поля
  _renderBoard() {

    // если фильмов нет - отрисовать плашку NoFilms
    if (this._boardFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsList();
    this._renderExtras();
  }

  _renderExtras() {
    const extraRatedContainer = new ExtraRatedContainerView();
    const extraCommentedContainer = new ExtraCommentedContainerView();

    render(this._boardComponent, extraRatedContainer, RenderPosition.BEFOREEND);
    render(this._boardComponent, extraCommentedContainer, RenderPosition.BEFOREEND);

    for (let i = 0; i < EXTRAS_COUNT; i++) {
      render(extraRatedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(this._boardTopRated[i]), RenderPosition.BEFOREEND);
      render(extraCommentedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(this._boardTopCommented[i]), RenderPosition.BEFOREEND);
    }
  }

  // отрисовка списка фильмов
  _renderFilmsList() {
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, Math.min(this._boardFilms.length, FILMS_COUNT_PER_STEP));

    if (this._boardFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  // отрисовка фильмов
  _renderFilms(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm));
  }

  // отрисовка отдельного фильма
  _renderFilm(film) {
    const filmComponent = new FilmCardView(film);
    const filmDetailsComponent = new FilmDetailsView(film);

    const siteBody = document.querySelector(`body`);

    const openFilmPopup = () => {
      siteBody.appendChild(filmDetailsComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeFilmPopup = () => {
      siteBody.removeChild(filmDetailsComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        closeFilmPopup();
      }
    };

    filmComponent.setCardClickHandler(() => {
      openFilmPopup();
    });

    filmDetailsComponent.setPopupClickHandler(() => {
      closeFilmPopup();
    });

    render(this._filmsListContainer, filmComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadButton() {
    this._renderFilms(this._renderedTaskCount, this._renderedTaskCount + FILMS_COUNT_PER_STEP);
    this._renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardFilms.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsContainerComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadButton);
  }

  _renderNoFilms() {
    render(this._boardComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }
}
