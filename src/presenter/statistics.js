
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {makeFilters} from "../utils/filter.js";
import {UpdateType, StatsMode} from "../const.js";
import StatsView from "../view/statistics.js";
import {generateStats} from "../utils/statistics.js";

export default class Statistics {
  constructor(statsContainer, filmsModel) {
    this._statsContainer = statsContainer;
    this._filmsModel = filmsModel;
    this._statsComponent = new StatsView();
  }

  init() {
    render(this._statsContainer, this._statsComponent.getElement(), RenderPosition.BEFOREEND);
    const films = this._filmsModel.getFilms();
    const filmsStats = generateStats(films, StatsMode.ALL);
    console.log(filmsStats);
  }
}
