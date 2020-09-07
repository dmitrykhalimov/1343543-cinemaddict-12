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
import {SortType, UpdateType, UserAction} from "../const.js";
import FilmPresenter from "./film.js";
// import FilmDetailsView from "../view/film-details.js";

const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

export default class Board {
  constructor(boardContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    this._loadMoreButtonComponent = null;
    this._sortComponent = null;

    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._boardComponent = new BoardView(); // сама доска <section class =films>
    this._filmsContainerComponent = new FilmsContainerView(); // контейнер <section class = filmslist>
    this._filmsListContainer = this._filmsContainerComponent.getElement().querySelector(`.films-list__container`); // контейнер section class = filmlist__container

    this._noFilmsComponent = new NoFilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadButton = this._handleLoadButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  // инициализация
  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortRating);
    }
    return this._filmsModel.getFilms();
  }

  // *сортировка*

  // обработчик сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
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

  // обработчик изменения фильма

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  // метод сортировки
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // отрисовка поля
  _renderBoard() {

    // если фильмов нет - отрисовать плашку NoFilms
    if (this._getFilms().length === 0) {
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

    const topRatedFilms = generateTopRated(this._getFilms().slice());
    const topCommentedFilms = generateTopCommented(this._getFilms().slice());

    for (let i = 0; i < EXTRAS_COUNT; i++) {
      render(extraRatedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(topRatedFilms[i]), RenderPosition.BEFOREEND);

      // TODO надо как-то научить перерисовываться блок TopCommented при добавлении комментария, не переписывая половину проекта.
      // TODO не открываются попапы при клике на элементы блока Extra
      render(extraCommentedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(topCommentedFilms[i]), RenderPosition.BEFOREEND);
    }
  }

  // отрисовка списка фильмов
  _renderFilmsList() {
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);

    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILMS_COUNT_PER_STEP));

    this._renderFilms(films);

    if (filmCount > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  // отрисовка фильмов
  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  // отрисовка отдельного фильма
  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  // обработчик нажатия кнопки Show More
  _handleLoadButton() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._loadMoreButtonComponent);
    }
  }


  // отрисовка кнопки Show More
  _renderLoadMoreButton() {

    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new ButtonView();

    render(this._filmsContainerComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadButton);
  }

  // отрисовка плашки No Films
  _renderNoFilms() {
    render(this._boardComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  // метод очистки доски

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
