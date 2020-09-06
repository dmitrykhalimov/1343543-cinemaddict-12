import BoardView from "../view/board.js";
import NoFilmsView from "../view/no-films.js";
import ButtonView from "../view/button.js";
import SortView from "../view/sort.js";
import ExtraRatedContainerView from "../view/container-rated.js";
import ExtraCommentedContainerView from "../view/container-connected.js";
import FilmsContainerView from "../view/films-container.js";
import FilmCardView from "../view/film-card.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortDate, sortRating, generateTopRated, generateTopCommented} from "../utils/transform.js";
import {SortType} from "../const.js";
import FilmPresenter from "./film.js";
import {updateItem} from "../utils/common.js";

const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

export default class Board {
  constructor(boardContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    this._loadMoreButtonComponent = new ButtonView();

    this._sortComponent = new SortView();
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._boardComponent = new BoardView(); // сама доска <section class =films>
    this._filmsContainerComponent = new FilmsContainerView(); // контейнер <section class = filmslist>
    this._filmsListContainer = this._filmsContainerComponent.getElement().querySelector(`.films-list__container`); // контейнер section class = filmlist__container

    this._noFilmsComponent = new NoFilmsView();

    this._handleLoadButton = this._handleLoadButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  // инициализация
  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardFilms = boardFilms.slice();

    this._boardTopRated = generateTopRated(boardFilms);
    this._boardTopCommented = generateTopCommented(boardFilms);

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderBoard();
  }

  _getFilms() {
    return this._filmsModel.getFilm();
  }

  // *сортировка*

  // колбэк сортировки
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortDate);
        break;
      case SortType.RATING:
        this._boardFilms.sort(sortRating);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  // обработчик сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._switchSortClass(sortType);

    this._clearFilmsList();
    this._renderFilmsList();
  }

  // метод замены активного класса
  _switchSortClass(sortType) {
    this._sortComponent.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    this._sortComponent.getElement().querySelector(`[data-sort-type=${sortType}]`).classList.add(`sort__button--active`);
  }

  // обновленный метод очистки списка фильмов
  _clearFilmsList() {
    Object.values(this._filmPresenter).forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // метод сортировки
  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  // отрисовка блока экстра
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
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);

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
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  // обработчик нажатия кнопки Show More
  _handleLoadButton() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  // обработчик изменения фильма
  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);

    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  // отрисовка кнопки Show More
  _renderLoadMoreButton() {
    render(this._filmsContainerComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadButton);
  }

  // отрисовка плашки No Films
  _renderNoFilms() {
    render(this._boardComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }
}
