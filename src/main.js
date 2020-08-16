import UserProfileView from "./view/user-profile.js";
import MainNavView from "./view/main-nav.js";
import SortView from "./view/sort.js";
import FilmsContainerView from "./view/films-container.js";
import FilmCardView from "./view/film-card.js";
import ExtraRatedContainerView from "./view/container-rated.js";
import ExtraCommentedContainerView from "./view/container-connected.js";
import ButtonView from "./view/button.js";
import FooterStatsView from "./view/footer-stats.js";
import FilmDetailsView from "./view/film-details.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateTopRated, generateTopCommented} from "./mock/extras.js";
import {render, RenderPosition} from "./utils.js";

const FILMS_COUNT = 20;
const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

const NUM_RATED = 0;
const NUM_COMMENTED = 1;

// функция отрисовки

const renderFilm = (siteFilmsContainer, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film);

  const siteBody = document.querySelector(`body`);

  const openFilmPopup = () => {
    siteBody.appendChild(filmDetailsComponent.getElement());
  };

  const closeFilmPopup = () => {
    siteBody.removeChild(filmDetailsComponent.getElement());
  };

  filmComponent.getElement().querySelector(`img`).addEventListener(`click`, () => {
    openFilmPopup();
  });

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => {
    openFilmPopup();
  });

  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => {
    openFilmPopup();
  });

  filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    closeFilmPopup();
  });

  render(siteFilmsContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};


// генерация моков
const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const filters = generateFilter(films);
const topRated = generateTopRated(films);
const topCommented = generateTopCommented(films);

// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserProfileView().getElement(), RenderPosition.BEFOREEND);

// блок меню
const siteMain = document.querySelector(`.main`);
render(siteMain, new MainNavView(filters).getElement(), RenderPosition.BEFOREEND);

// блок сортировки
render(siteMain, new SortView().getElement(), RenderPosition.BEFOREEND);

// контейнер для фильмов
render(siteMain, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);
const siteFilmsSection = document.querySelector(`.films`);
const siteFilmsContainer = document.querySelector(`.films-list__container`);
const siteFilmsList = document.querySelector(`.films-list`);

// карточки
for (let i = 0; i < FILMS_COUNT_PER_STEP; i++) {
  renderFilm(siteFilmsContainer, films[i]);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedTaskCount = FILMS_COUNT_PER_STEP;
  render(siteFilmsList, new ButtonView().getElement(), RenderPosition.BEFOREEND);
  const loadMoreButton = document.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
    .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => renderFilm(siteFilmsContainer, film));

    renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

// секция экстра
render(siteFilmsSection, new ExtraRatedContainerView().getElement(), RenderPosition.BEFOREEND);
render(siteFilmsSection, new ExtraCommentedContainerView().getElement(), RenderPosition.BEFOREEND);

// карточки в секции экстра
const siteExtraContainers = document.querySelectorAll(`.films-list--extra`);
const siteExtraRatedContainer = siteExtraContainers[NUM_RATED].querySelector(`.films-list__container`);
const siteExtraCommentedContainer = siteExtraContainers[NUM_COMMENTED].querySelector(`.films-list__container`);

for (let i = 0; i < EXTRAS_COUNT; i++) {
  render(siteExtraRatedContainer, new FilmCardView(topRated[i]).getElement(), RenderPosition.BEFOREEND);
  render(siteExtraCommentedContainer, new FilmCardView(topCommented[i]).getElement(), RenderPosition.BEFOREEND);
}

// статистика футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, new FooterStatsView(films.length).getElement(), RenderPosition.BEFOREEND);
