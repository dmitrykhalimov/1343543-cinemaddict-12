import FilterView from "../view/main-nav.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {makeFilters} from "../utils/filter.js";
import {UpdateType, FilterMode} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, statsPresenter, boardPresenter) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._isStats = false;
    this._isLoading = true;
    this._currentFilter = null;
    this._filterComponent = null;
    this._boardPresenter = boardPresenter;
    this._statsPresenter = statsPresenter;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleOpenStats = this._handleOpenStats.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);

    if (!this._isLoading) {
      this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
      this._filterComponent.setStatsButtonClickHandler(this._handleOpenStats);
    }

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  removeHandlers() {
    this._filterComponent.removeFilterTypeChangeHandler();
    this._filterComponent.removeStatsButtonClickHandler();
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();
    return makeFilters(films, FilterMode.COUNT);
  }

  _handleModelEvent() {
    this._isLoading = false;
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType && !this._isStats === true) {
      return;
    }

    if (this._isStats === true) {
      this._statsPresenter.destroy();
      this._boardPresenter.init();
      this._isStats = false;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleOpenStats() {
    if (this._isStats) {
      return;
    }
    this._isStats = true;
    this._boardPresenter.destroy();
    this._statsPresenter.init();
  }
}
