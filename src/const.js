import {getRandomString} from "./utils/common.js";

const AUTHORIZATION_KEY_LENGTH = 10;

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const EMOJIS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

export const DateFormats = {
  ONLY_YEAR: `YYYY`,
  DAY_MONTH_YEAR: `DD MMMM YYYY`,
  COMMENT_STYLE: `YYYY/MM/DD HH:mm`,
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
};

export const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  POPUP: `POPUP`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`,
};

export const FilterMode = {
  COUNT: `count`,
};

export const StatsMode = {
  ALL: `ALL`,
  TODAY: `TODAY`,
  WEEK: `WEEK`,
  MONTH: `MONTH`,
  YEAR: `YEAR`
};

export const ServerParameters = {
 // AUTHORIZATION: `Basic ${getRandomString(AUTHORIZATION_KEY_LENGTH)}`,
  AUTHORIZATION: `Basic yellowbigpineapple`, // Временно в целях отладки используется единый идентификатор. Т.к. при случайном генераторе чисел - отображается другой набор данных, после перезагрузки в итоге не получается отследить изменения на сервере
  END_POINT: `https://12.ecmascript.pages.academy/cinemaddict`,
};
