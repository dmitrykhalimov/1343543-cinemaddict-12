
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {makeFilters} from "../utils/filter.js";
import {UpdateType, FilterMode} from "../const.js";
import StatsView from "../view/statistics.js";

export default class Statistics {
  constructor(statsContainer) {
    this._statsContainer = statsContainer;

    this._statsComponent = new StatsView();
  }

  init() {
    render(this._statsContainer, this._statsComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
