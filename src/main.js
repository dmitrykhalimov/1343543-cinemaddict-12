/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable indent */
import UserProfileView from "./view/user-profile.js";
import FilterPresenter from "./presenter/filter.js";
import StatisticsPresenter from "./presenter/statistics.js";
import FooterStatsView from "./view/footer-stats.js";

import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import {ServerParameters, UpdateType} from "./const.js";
import Api from "./api.js";

// отрисовка хэдера
const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserProfileView(), RenderPosition.BEFOREEND);

const api = new Api(ServerParameters.END_POINT, ServerParameters.AUTHORIZATION);
const filmsModel = new FilmsModel();

// загрузить фильмы
// по-моему какое-то колхозанство, но с за 12 часов ничего умнее я придумать не смог :(
api.getFilms().then((films) => { // собрать все фильмы
  const commentPromises = [];
  films.forEach((film) => { // т.к. комменты отдаются сервером по-отдельности, создать промис для каждого комментария
    const promise = api.getComments(film.id);
    commentPromises.push(promise); // собрать единый массив промисов
  });
  Promise.all(commentPromises).then((commentsAll) => { // когда все комментарии загрузились
    films = films.map((film, index) => {
      return Object.assign(
        {},
        film,
        {
         comments: commentsAll[index]
        }
      );
    });
    filmsModel.setFilms(UpdateType.INIT, films);
  });
});

// модель фильтра
const filterModel = new FilterModel();

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
render(siteFooterStats, new FooterStatsView(222).getElement(), RenderPosition.BEFOREEND);

