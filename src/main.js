import UserProfileView from "./view/user-profile.js";
import FilterPresenter from "./presenter/filter.js";
import StatisticsPresenter from "./presenter/statistics.js";
import FooterStatsView from "./view/footer-stats.js";

import {generateFilm} from "./mock/film.js";

import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";

const FILMS_COUNT = 22;

/* генерация моков */
const films = new Array(FILMS_COUNT).fill().map(generateFilm);

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
const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel);
filterPresenter.init();

// блок фильмов и сортировка

const boardPresenter = new BoardPresenter(siteMain, filmsModel, filterModel);
boardPresenter.init();

const statsPresenter = new StatisticsPresenter(siteMain, filmsModel);
statsPresenter.init();

// блок футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, new FooterStatsView(films.length).getElement(), RenderPosition.BEFOREEND);

