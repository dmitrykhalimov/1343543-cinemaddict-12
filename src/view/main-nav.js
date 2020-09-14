import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";

const createMainNav = (filters, currentFilterType) => {
  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" data-type="all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? `main-navigation__item--active` : ``}">All movies</a>
        <a href="#watchlist" data-type="watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? `main-navigation__item--active` : ``}">Watchlist <span class="main-navigation__item-count ">${filters[FilterType.WATCHLIST]}</span></a>
        <a href="#history" data-type="history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? `main-navigation__item--active` : ``}">History <span class="main-navigation__item-count">${filters[FilterType.HISTORY]}</span></a>
        <a href="#favorites" data-type="favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? `main-navigation__item--active` : ``}">Favorites <span class="main-navigation__item-count">${filters[FilterType.FAVORITES]}</span></a>
      </div>
      <a href="#stats" id="stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};

export default class MainNav extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._isStatsActive = false;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsButtonClickHandler = this._statsButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNav(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  setStatsButtonClickHandler(callback) {
    this._callback.statsButton = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsButtonClickHandler);
  }

  removeFilterTypeChangeHandler() {
    this.getElement().removeEventListener(`click`, this._filterTypeChangeHandler);
  }

  removeStatsButtonClickHandler() {
    this.getElement().querySelector(`.main-navigation__additional`).removeEventListener(`click`, this._statsButtonClickHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A` || evt.target.id === `stats`) {
      return;
    }

    const filterName = evt.target.getAttribute(`data-type`);
    this._callback.filterTypeChange(filterName);
  }

  _statsButtonClickHandler(evt) {
    evt.preventDefault();

    this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    this.getElement().querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
    this._callback.statsButton();
  }
}

