import FilmsModel from "../model/films.js";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, storeComments) {
    this._api = api;
    this._store = store;
    this._storeComments = storeComments;
  }

  getFilms() {
    if (Provider.isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptFilmToServer));
          this._store.setItems(items);
          return films;
        });
    }
    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(storeFilms.map(FilmsModel.adaptFilmsToClient));
  }

  getComments(filmId) {
    if (Provider.isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          this._storeComments.setItem(filmId, comments.map(FilmsModel.adaptCommentToServer));
          return comments;
        });
    }

    const allStoreComments = this._storeComments.getItems();
    const storeComments = allStoreComments[filmId].map(FilmsModel.adaptCommentsToClient);
    return Promise.resolve(storeComments);
  }

  updateFilm(film) {
    if (Provider.isOnline()) {
      return this._api.updateFilm(film)
        .then((filmUpdated) => {
          this._store.setItem(filmUpdated.id, FilmsModel.adaptFilmToServer(filmUpdated));
          return filmUpdated;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptFilmToServer(film));

    return Promise.resolve(film);
  }

  addComment(comment) {
    if (Provider.isOnline()) {
      const filmId = comment.filmId;
      return this._api.addComment(comment)
        .then((response) => {
          this._storeComments.pushItem(filmId, response.comments.map(FilmsModel.adaptCommentToServer));
          return response;
        });
    }

    return Promise.reject(new Error(`I am offline`));
  }

  deleteComment(filmId, commentId) {
    if (Provider.isOnline()) {
      return this._api.deleteComment(commentId)
        .then((response) => {
          this._storeComments.removeItem(filmId, commentId);
          return response;
        });
    }

    return Promise.reject(new Error(`I am offline`));
  }

  sync() {
    if (Provider.isOnline()) {
      const storeFimls = Object.values(this._store.getItems());
      return this._api.sync(storeFimls)
        .then((response) => {
          const items = Array.from(createStoreStructure(response.updated));
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
