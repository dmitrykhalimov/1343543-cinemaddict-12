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

const siteHeader = document.querySelector(`.header`);
const siteFooterStats = document.querySelector(`.footer__statistics`);

// отрисовка хэдера

const userProfileComponent = new UserProfileView();
render(siteHeader, userProfileComponent, RenderPosition.BEFOREEND);

const api = new Api(ServerParameters.END_POINT, ServerParameters.AUTHORIZATION);
const filmsModel = new FilmsModel();

// модель фильтра
const filterModel = new FilterModel();

const siteMain = document.querySelector(`.main`);

// блок фильтров
const statsPresenter = new StatisticsPresenter(siteMain, filmsModel);
const boardPresenter = new BoardPresenter(siteMain, filmsModel, filterModel, api, userProfileComponent);

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel, statsPresenter, boardPresenter);

// блок фильмов и сортировка

filterPresenter.init();
boardPresenter.init();

// загрузить фильмы
api.getFilms().then((films) => {
  const commentPromises = films.map((film) => {
    return api.getComments(film.id);
  });
  Promise.all(commentPromises)
    .then((commentsAll) => {
      return films.map((film, index) => {
        return Object.assign(
          {},
          film,
          {
            comments: commentsAll[index]
          }
        );
      });
    })
    .then((receivedFilms) => {
      filmsModel.setFilms(UpdateType.INIT, receivedFilms);
      render(siteFooterStats, new FooterStatsView(receivedFilms.length).getElement(), RenderPosition.BEFOREEND);
    });
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});
