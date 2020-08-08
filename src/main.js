import {createUserProfile} from "./view/user-profile.js";
import {createMainNav} from "./view/main-nav.js";
import {createSort} from "./view/sort.js";
import {createFilmsContainer} from "./view/films-container.js";
import {createFilmCard} from "./view/film-card.js";
import {createExtraContainerRated} from "./view/container-rated.js";
import {createExtraContainerCommented} from "./view/container-connected.js";
import {createButton} from "./view/button.js";
import {createFooterStats} from "./view/footer-stats.js";
import {createFilmDetails} from "./view/film-details.js";

import {generateFilm} from "./mock/film.js";

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
console.log(films);

const CARDS_COUNT = 5;
const EXTRA_COUNT = 2;

const NUM_RATED = 0;
const NUM_COMMENTED = 1;

// функция отрисовки
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, createUserProfile(), `beforeend`);

// блок меню
const siteMain = document.querySelector(`.main`);
render(siteMain, createMainNav(), `beforeend`);

// блок сортировки
render(siteMain, createSort(), `beforeend`);

// контейнер для фильмов
render(siteMain, createFilmsContainer(), `beforeend`);
const siteFilmsSection = document.querySelector(`.films`);
const siteFilmsContainer = document.querySelector(`.films-list__container`);

// карточки
for (let i = 0; i < CARDS_COUNT; i++) {
  render(siteFilmsContainer, createFilmCard(films[i]), `beforeend`);
}

// кнопка
render(siteFilmsContainer, createButton(), `afterend`);

// секция экстра
render(siteFilmsSection, createExtraContainerRated(), `beforeend`);
render(siteFilmsSection, createExtraContainerCommented(), `beforeend`);

// карточки в секции экстра
const siteExtraContainers = document.querySelectorAll(`.films-list--extra`);
const siteExtraRatedContainer = siteExtraContainers[NUM_RATED].querySelector(`.films-list__container`);
const siteExtraCommentedContainer = siteExtraContainers[NUM_COMMENTED].querySelector(`.films-list__container`);
/*
for (let i = 0; i < EXTRA_COUNT; i++) {
  render(siteExtraRatedContainer, createFilmCard(), `beforeend`);
  render(siteExtraCommentedContainer, createFilmCard(), `beforeend`);
}*/

// статистика футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, createFooterStats(), `beforeend`);

// детали фильма
const siteFooter = document.querySelector(`.footer`);
render(siteFooter, createFilmDetails(films[0]), `afterend`);

// временное решение, чтобы можно было закрыть попап - т.к. этого нет в задании, логика работы попапа не реализована
const popup = document.querySelector(`.film-details`);
const popupCloseButton = popup.querySelector(`.film-details__close-btn`);

popupCloseButton.addEventListener('click', function () {
  popup.remove();
});
