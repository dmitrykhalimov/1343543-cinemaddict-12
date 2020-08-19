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
import NoFilmsView from "./view/no-films.js";
import BoardView from "./view/board.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateTopRated, generateTopCommented} from "./mock/extras.js";
import {render, RenderPosition} from "./utils.js";

const FILMS_COUNT = 22;
const FILMS_COUNT_PER_STEP = 5;
const EXTRAS_COUNT = 2;

// функция отрисовки списка фильмов

const renderFilm = (siteFilmsContainer, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film);

  const siteBody = document.querySelector(`body`);

  const openFilmPopup = () => {
    siteBody.appendChild(filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeFilmPopup = () => {
    siteBody.removeChild(filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closeFilmPopup();
    }
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

// функция отрисовки дополнительных карточек

const renderBoard = (boardContainer, boardFilms) => {
  const boardComponent = new BoardView();
  const filmsContainerComponent = new FilmsContainerView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);

  // если фильмов 0 - рисуем заглушку
  if (boardFilms.length === 0) {
    render(boardComponent.getElement(), new NoFilmsView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

  const siteFilmsContainer = boardComponent.getElement().querySelector(`.films-list__container`);

  // первые пять или менее фильмов
  boardFilms
  .slice(0, Math.min(boardFilms.length, FILMS_COUNT_PER_STEP))
  .forEach((boardFilm) => renderFilm(siteFilmsContainer, boardFilm));

  // если фильмов больше 5
  if (boardFilms.length > FILMS_COUNT_PER_STEP) {
    let renderedTaskCount = FILMS_COUNT_PER_STEP;

    render(filmsContainerComponent.getElement(), new ButtonView().getElement(), RenderPosition.BEFOREEND);

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
  renderExtras(boardComponent.getElement());
};

// функция отрисовки дополнительных карточек
const renderExtras = (extrasContainer) => {
  const extraRatedContainer = new ExtraRatedContainerView();
  const extraCommentedContainer = new ExtraCommentedContainerView();

  render(extrasContainer, extraRatedContainer.getElement(), RenderPosition.BEFOREEND);
  render(extrasContainer, extraCommentedContainer.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < EXTRAS_COUNT; i++) {
    render(extraRatedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(topRated[i]).getElement(), RenderPosition.BEFOREEND);
    render(extraCommentedContainer.getElement().querySelector(`.films-list__container`), new FilmCardView(topCommented[i]).getElement(), RenderPosition.BEFOREEND);
  }
};

/* генерация моков */
const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const topRated = generateTopRated(films);
const topCommented = generateTopCommented(films);

/* непосредственно отрисовка */
// блок профиля пользователя
const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserProfileView().getElement(), RenderPosition.BEFOREEND);

// блок меню
const siteMain = document.querySelector(`.main`);
render(siteMain, new MainNavView(filters).getElement(), RenderPosition.BEFOREEND);

// блок сортировки
render(siteMain, new SortView().getElement(), RenderPosition.BEFOREEND);

// блок фильмов
renderBoard(siteMain, films);

// блок футера
const siteFooterStats = document.querySelector(`.footer__statistics`);
render(siteFooterStats, new FooterStatsView(films.length).getElement(), RenderPosition.BEFOREEND);
