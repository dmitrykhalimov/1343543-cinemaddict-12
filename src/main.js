import UserProfileView from "./view/user-profile.js";
import FilterPresenter from "./presenter/filter.js";
import StatisticsPresenter from "./presenter/statistics.js";
import FooterStatsView from "./view/footer-stats.js";

import {generateFilm} from "./mock/film.js";

import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";

const FILMS_COUNT = 22;
const AUTHORIZATION = `Basic yellowbigpineapple`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  console.log(films);
});

api.getComments('11').then((comments) => {
  console.log(comments);
});

/* генерация моков */
const films = new Array(FILMS_COUNT).fill().map(generateFilm);

console.log(films);
// модель фильма
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

// модель фильтра
const filterModel = new FilterModel();

/* непосредственно отрисовка */
// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);

const siteMain = document.querySelector(`.main`);

// блок фильтров
const statsPresenter = new StatisticsPresenter(siteMain, filmsModel);
const boardPresenter = new BoardPresenter(siteMain, filmsModel, filterModel);

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel, statsPresenter, boardPresenter);

// блок фильмов и сортировка

filterPresenter.init();
boardPresenter.init();

// блок футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, new FooterStatsView(films.length).getElement(), RenderPosition.BEFOREEND);

