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
import {generateFilter} from "./mock/filter.js";
import {generateTopRated, generateTopCommented} from "./mock/extras.js";

const FILMS_COUNT = 20;
const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

const NUM_RATED = 0;
const NUM_COMMENTED = 1;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const filters = generateFilter(films);
console.log(filters);
const topRated = generateTopRated(films);
const topCommented = generateTopCommented(films);

let reducedArray = function (filmsToReduce) {
  let result = filmsToReduce.reduce((acc, obj) => {
    return acc + obj.isWatched;
  }, 0);
  return result;
};

console.log(reducedArray(films));
// функция отрисовки
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, createUserProfile(), `beforeend`);

// блок меню
const siteMain = document.querySelector(`.main`);
render(siteMain, createMainNav(filters), `beforeend`);

// блок сортировки
render(siteMain, createSort(), `beforeend`);

// контейнер для фильмов
render(siteMain, createFilmsContainer(), `beforeend`);
const siteFilmsSection = document.querySelector(`.films`);
const siteFilmsContainer = document.querySelector(`.films-list__container`);

// карточки
for (let i = 0; i < FILMS_COUNT_PER_STEP; i++) {
  render(siteFilmsContainer, createFilmCard(films[i]), `beforeend`);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedTaskCount = FILMS_COUNT_PER_STEP;
  render(siteFilmsContainer, createButton(), `afterend`);

  const loadMoreButton = document.querySelector(`.films-list__show-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
    .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => render(siteFilmsContainer, createFilmCard(film), `beforeend`));

    renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

// секция экстра
render(siteFilmsSection, createExtraContainerRated(), `beforeend`);
render(siteFilmsSection, createExtraContainerCommented(), `beforeend`);

// карточки в секции экстра
const siteExtraContainers = document.querySelectorAll(`.films-list--extra`);
const siteExtraRatedContainer = siteExtraContainers[NUM_RATED].querySelector(`.films-list__container`);
const siteExtraCommentedContainer = siteExtraContainers[NUM_COMMENTED].querySelector(`.films-list__container`);

for (let i = 0; i < EXTRAS_COUNT; i++) {
  render(siteExtraRatedContainer, createFilmCard(topRated[i]), `beforeend`);
  render(siteExtraCommentedContainer, createFilmCard(topCommented[i]), `beforeend`);
}

// статистика футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, createFooterStats(films.length), `beforeend`);

// детали фильма
const siteFooter = document.querySelector(`.footer`);
render(siteFooter, createFilmDetails(films[0]), `afterend`); // первый элемент в попап

// временное решение, чтобы можно было закрыть попап - т.к. этого нет в задании, логика работы попапа не реализована
const popup = document.querySelector(`.film-details`);
const popupCloseButton = popup.querySelector(`.film-details__close-btn`);

popupCloseButton.addEventListener(`click`, function () {
  popup.remove();
});
