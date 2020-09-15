import BoardView from "../view/board.js";
import NoFilmsView from "../view/no-films.js";
import ButtonView from "../view/button.js";
import SortView from "../view/sort.js";
import ExtraRatedContainerView from "../view/container-rated.js";
import ExtraCommentedContainerView from "../view/container-connected.js";
import FilmsContainerView from "../view/films-container.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {sortDate, sortRating, generateTopRated, generateTopCommented} from "../utils/transform.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import FilmPresenter from "./film.js";
import {makeFilters} from "../utils/filter.js";
import LoadingView from "../view/loading.js";
import {getRankName} from "../utils/statistics.js";

const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

export default class Board {
  constructor(boardContainer, filmsModel, filterModel, api, userProfileComponent) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._api = api;

    this._loadMoreButtonComponent = null;
    this._sortComponent = null;
    this._isLoading = true;
    this._filmsWatched = 0;

    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._filmRatedPresenter = {};
    this._filmCommentedPresenter = {};

    this._boardComponent = new BoardView(); // сама доска <section class =films>
    this._filmsContainerComponent = new FilmsContainerView(); // контейнер <section class = filmslist>
    this._filmsListContainer = this._filmsContainerComponent.getElement().querySelector(`.films-list__container`); // контейнер section class = filmlist__container
    this._loadingComponent = new LoadingView();
    this._userProfileComponent = userProfileComponent;

    this._noFilmsComponent = new NoFilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadButton = this._handleLoadButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  // метод получения фильмов из модели
  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = makeFilters(films)[filterType];

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortDate);
      case SortType.RATING:
        return filteredFilms.sort(sortRating);
    }

    return filteredFilms;
  }

  // инициализация
  init() {
    this._renderBoard();
  }

  // уничтожение (при отрисовке блока статистики)
  destroy() {
    this._clearBoard();
    remove(this._boardComponent);

    remove(this._sortComponent);
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
  }

  // очистка доски при перерисовке
  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._filmRatedPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._filmCommentedPresenter)
      .forEach((presenter) => presenter.destroy());

    this._filmPresenter = {};
    this._filmRatedPresenter = {};
    this._filmCommentedPresenter = {};

    remove(this._noFilmsComponent);
    remove(this._loadMoreButtonComponent);
    remove(this._extraCommented);
    remove(this._extraRated);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = (resetRenderedFilmCount) ? FILMS_COUNT_PER_STEP : Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка поля с фильмами
  _renderBoard() {
    this._renderSort();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.length;

    // если фильмов нет - отрисовать плашку NoFilms
    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._userProfileComponent.updateRank(getRankName(this._filmsModel.getFilms()));

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmsCount)));
    this._renderExtras();

    if (filmCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  // отрисовка сортировки
  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new SortView(this._currentSortType);

    if (!this._isLoading) {
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    }

    if (prevSortComponent === null) {
      render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  // отрисовка списка фильмов
  _renderFilms(films) {
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);

    films.forEach((film) => this._renderFilm(this._filmsListContainer, film, this._filmPresenter));
  }

  // отрисовка отдельного фильма
  _renderFilm(container, film, presenterList) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    presenterList[film.id] = filmPresenter;
  }

  // отрисовка плашки No Films
  _renderNoFilms() {
    remove(this._boardComponent);
    render(this._boardContainer, this._noFilmsComponent, RenderPosition.BEFOREEND);
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

  // отрисовка блоков экстра
  _renderExtras() {
    this._extraRated = new ExtraRatedContainerView();
    this._extraCommented = new ExtraCommentedContainerView();

    this._renderExtra(this._extraRated, generateTopRated, this._filmRatedPresenter);
    this._renderExtra(this._extraCommented, generateTopCommented, this._filmCommentedPresenter);
  }

  _renderExtra(component, generateTopList, presenter) {
    const topFilms = generateTopList(this._filmsModel.getFilms().slice());

    console.log(topFilms.length);

    if (topFilms.length === 0) {
      return; // если у всех фильмов рейтинг = 0 или нет комментариев не отображть
    }

    render(this._boardComponent, component, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(topFilms.length, EXTRAS_COUNT); i++) {
      this._renderFilm(component.getContainer(), topFilms[i], presenter);
    }
  }

  // обработчик изменения типа сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  // обработчик смены режима попап/доска
  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmRatedPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmCommentedPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // обработчик изменения фильма
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._api.getComments(update.id)
            .then((updatedComments) => {
              return Object.assign(
                  {},
                  response,
                  {
                    comments: updatedComments
                  }
              );
            })
            .then((film) => {
              this._filmsModel.updateFilm(updateType, film);
            });
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update.commentBody)
          .then((film) => {
            this._filmsModel.updateFilm(updateType, film);
          })
          .catch(() => {
            update.filmDetailsComponent.onAddCommentError();
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update.idToDelete)
          .then(() => {
            this._filmsModel.updateFilm(updateType, update.filmWithoutComment);
          })
          .catch(() => {
            update.filmDetailsComponent.onDeleteCommentError(update.idToDelete);
          });
        break;
    }
  }

  // коллбэк для наблюдателя
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR: // при установке флагов для фильмов на доске
        this._clearBoard({resetRenderedFilmCount: false, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.MAJOR: // переключение фильтров
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT: // при инициализации
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
      case UpdateType.POPUP: // при установке флагов для фильмов в попапе
        this._clearBoard({resetRenderedFilmCount: false, resetSortType: false});
        this._renderBoard();

        if (this._filmPresenter[data.id]) {
          this._filmPresenter[data.id].openFilmPopup(); // если изменения сделаны из попапа после перерисовки открыть попап назад
        }

        if (this._filmRatedPresenter[data.id]) {
          this._filmRatedPresenter[data.id].openFilmPopup(); // если изменения сделаны из попапа после перерисовки открыть попап назад
        }

        if (this._filmCommentedPresenter[data.id]) {
          this._filmCommentedPresenter[data.id].openFilmPopup(); // если изменения сделаны из попапа после перерисовки открыть попап назад
        }
        break;
    }
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
}
