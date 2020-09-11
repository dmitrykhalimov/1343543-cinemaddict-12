/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable indent */
import UserProfileView from "./view/user-profile.js";
import FilterPresenter from "./presenter/filter.js";
import StatisticsPresenter from "./presenter/statistics.js";
import FooterStatsView from "./view/footer-stats.js";

import {generateFilm} from "./mock/film.js";

import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import {ServerParameters} from "./const.js";
import Api from "./api.js";

const FILMS_COUNT = 22;
let filmsFromServer = [];
let commentsFromServer = [];
const api = new Api(ServerParameters.END_POINT, ServerParameters.AUTHORIZATION);

// по-моему какое-то колхозанство, но с за 12 часов ничего умнее я придумать не смог :(

Promise.all([api.getFilms()]).then((films) => {
  const commentPromises = [];
  films[0].forEach((film) => {
    console.log('Создаю промис фильма');
    const promise = api.getComments(film.id);
    commentPromises.push(promise);
  });
  console.log(commentPromises);
  Promise.all(commentPromises).then((values) => {
    console.log(values);
    console.log(films[0]);
  });
});
// console.log('1. Загрузка фильмов')
// api.getFilms()
//   .then((films) => {
//     console.log('2. Фильмы загружены для каждого фильма загрузить комментарии');
//     films.map((film) => {
//       console.log(downloadComments(film));
//       return downloadComments(film);
//     });
//   })
//   .then((films) => {
//     console.log('5. Выводим список в коносль');
//     console.log(films);
//   });

// let connectFilm = (film, comment) => {
//   console.log('3-3. Шлепаем к нему коммент');
//   film.commentsMax = comment;
//   return film;
// };

// let downloadComments = (film) => {
//   console.log('2. Загружаем комментарий');
//   api.getComments(film.id)
//     .then((comment) => {
//       console.log('3-1. Комментарий загружен, соединяем');
//       return connectFilm(film, comment);
//     });
// };

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

