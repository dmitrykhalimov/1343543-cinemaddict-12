import FilmsModel from "../model/films.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const PathToServer = {
  MOVIES: `movies`,
  COMMENTS: `comments`,
  SYNC: `movies/sync`
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
    return this._load({url: `${PathToServer.MOVIES}`})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptFilmsToClient));
  }

  getComments(filmId) {
    return this._load({url: `${PathToServer.COMMENTS}/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(FilmsModel.adaptCommentsToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `${PathToServer.MOVIES}/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((filmUpdated) => Api.toJSON(filmUpdated))
      .then((filmUpdated) => FilmsModel.adaptFilmsToClient(filmUpdated));
  }

  addComment(comment) {
    return this._load({
      url: `${PathToServer.COMMENTS}/${comment.filmId}`,
      method: Method.POST,
      body: JSON.stringify(FilmsModel.adaptNewCommentToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((repsonse) => FilmsModel.adaptNewCommentToClient(repsonse));
  }

  deleteComment(commentId) {
    return this._load({
      url: `${PathToServer.COMMENTS}/${commentId}`,
      method: Method.DELETE
    });
  }

  sync(films) {
    return this._load({
      url: `${PathToServer.SYNC}`,
      method: Method.POST,
      body: JSON.stringify(films),
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
