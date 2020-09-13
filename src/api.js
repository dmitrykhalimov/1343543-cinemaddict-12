import FilmsModel from "./model/films.js";
import Film from "./presenter/film.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptFilmsToClient));
  }

  //TOCLEAN
  testFilms() {
    return this._load({url: `movies`})
      .then((films) => (films));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}/`})
      .then(Api.toJSON)
      .then((comments) => comments.map(FilmsModel.adaptCommentsToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}/`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((filmUpdated) => Api.toJSON(filmUpdated))
      .then((filmUpdated) => FilmsModel.adaptFilmsToClient(filmUpdated));
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
