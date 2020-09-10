
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {makeFilters} from "../utils/filter.js";
import {UpdateType, StatsMode} from "../const.js";
import StatsView from "../view/statistics.js";
import {generateStats} from "../utils/statistics.js";

export default class Statistics {
  constructor(statsContainer, filmsModel) {
    this._statsContainer = statsContainer;
    this._filmsModel = filmsModel;

    this._currentStats = StatsMode.ALL;
    this._prevStatsComponent = null;
    this._statsComponent = null;

    this._handleStatsPeriodChange = this._handleStatsPeriodChange.bind(this);
  }

  init() {
    console.log(this._currentStats);
    const films = this._filmsModel.getFilms();
    const filmsStats = generateStats(films, this._currentStats);

    const prevStasComponent = this._statsComponent;
    this._statsComponent = new StatsView(filmsStats, this._currentStats);

    this._statsComponent.setStatsPeriodClickHandler(this._handleStatsPeriodChange);

    if (prevStasComponent === null) {
      render(this._statsContainer, this._statsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    replace(this._statsComponent, prevStasComponent);
    remove(prevStasComponent);
  }

  _handleStatsPeriodChange(statsMode) {
    this._currentStats = StatsMode[statsMode];
    this.init();
  }
}
