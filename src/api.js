import FilmsModel from "./model/films.js";

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

  testFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((films) => console.log(films));
  }


  getComments(filmId) {
    return this._load({url: `comments/${filmId}/`})
      .then(Api.toJSON)
      .then((comments) => comments.map(FilmsModel.adaptCommentsToClient));
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(task),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
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
