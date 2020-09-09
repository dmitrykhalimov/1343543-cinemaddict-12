import SmartView from "./smart.js";

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// import {getCurrentDate} from "../utils/task.js";

const createStatisticsTemplate = (filmsStats) => {
  // const completedTaskCount = 0; // Нужно посчитать количество завершенных задач за период

  console.log(filmsStats);
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Sci-Fighter</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmsStats.watched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${filmsStats.durationHours} <span class="statistic__item-description">h</span> ${filmsStats.durationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${filmsStats.topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Statistics extends SmartView {
  constructor(filmsStats) {
    super();

    this._filmsStats = filmsStats;

    this._statsPeriodClickHandler = this._statsPeriodClickHandler.bind(this);

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsStats);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _statsPeriodClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._callback.statsPeriod();
  }

  setStatsPeriodClickHandler(callback) {
    this._callback.statsPeriod = callback;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, this._statsPeriodClickHandler);
  }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
