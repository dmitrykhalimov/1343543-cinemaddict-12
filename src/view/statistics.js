import {StatsMode} from "../const.js";

import AbstractView from "./abstract.js";

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// import {getCurrentDate} from "../utils/task.js";

const renderChart = (ctx, genres, numbers) => {
  const BAR_HEIGHT = 50;

  ctx.height = BAR_HEIGHT * genres.length;

  const myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: numbers,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
  return myChart;
};

const createStatisticsTemplate = (filmsStats, currentStat) => {
  // const completedTaskCount = 0; // Нужно посчитать количество завершенных задач за период
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${filmsStats.rank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${(currentStat === StatsMode.ALL) ? `checked` : ``}>
    <label for="statistic-all-time" class="statistic__filters-label" data-type="ALL">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${(currentStat === StatsMode.TODAY) ? `checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label" data-type="TODAY">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${(currentStat === StatsMode.WEEK) ? `checked` : ``}>
    <label for="statistic-week" class="statistic__filters-label" data-type="WEEK">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${(currentStat === StatsMode.MONTH) ? `checked` : ``}>
    <label for="statistic-month" class="statistic__filters-label" data-type="MONTH">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${(currentStat === StatsMode.YEAR) ? `checked` : ``}>
    <label for="statistic-year" class="statistic__filters-label" data-type="YEAR">Year</label>
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

export default class Statistics extends AbstractView {
  constructor(filmsStats, currentStat) {
    super();

    this._filmsStats = filmsStats;
    this._currentStat = currentStat;

    this._statsPeriodClickHandler = this._statsPeriodClickHandler.bind(this);

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsStats, this._currentStat);
  }

  setStatsPeriodClickHandler(callback) {
    this._callback.statsPeriod = callback;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, this._statsPeriodClickHandler);
  }

  _setCharts() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);

    const genres = this._filmsStats.genres;
    const numbers = this._filmsStats.numbers;
    renderChart(ctx, genres, numbers);
  }

  _statsPeriodClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._callback.statsPeriod(evt.target.getAttribute(`data-type`));
  }
}
