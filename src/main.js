import UserProfileView from "./view/user-profile.js";
import MainNavView from "./view/main-nav.js";
import SortView from "./view/sort.js"; // +
import FooterStatsView from "./view/footer-stats.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateTopRated, generateTopCommented} from "./mock/extras.js";
import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";

const FILMS_COUNT = 22;

/* генерация моков */
const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const topRated = generateTopRated(films);
const topCommented = generateTopCommented(films);

/* непосредственно отрисовка */
// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);

const siteMain = document.querySelector(`.main`);

// блок фильмов
// renderBoard(siteMain, films);
const boardPresenter = new BoardPresenter(siteMain);
boardPresenter.init(films, topRated, topCommented);

// блок меню
render(siteMain, new MainNavView(filters), RenderPosition.AFTERBEGIN);

// блок футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, new FooterStatsView(films.length).getElement(), RenderPosition.BEFOREEND);

