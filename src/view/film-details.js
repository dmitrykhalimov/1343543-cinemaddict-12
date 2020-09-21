import AbstractView from "./abstract.js";
import he from "he";
import {transformDateTime, getDateComment, translateMinutesToText} from "../utils/transform.js";
import {createElement, replace} from "../utils/render.js";
import {DateFormats, EMOJIS} from "../const.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

const createFilmDetails = (film) => {
  const {title, age, director, cast, country, writers, rating, filmDate, duration, genres, poster, description, isInWatchlist, isWatched, isFavorite, comments} = film;

  const generateGenres = () => {
    let result = ``;
    for (const genre of genres) {
      result += `<span class="film-details__genre">${genre}</span>`;
    }
    return result;
  };

  const generateComments = () => {
    return comments.reduce((acc, comment) => {
      acc += `<li class="film-details__comment" data-comment-id="${comment.id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.nickname}</span>
          <span class="film-details__comment-day">${getDateComment(comment.dateComment, DateFormats.COMMENT_STYLE)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
      </li>`;
      return acc;
    }, ``);
  };

  const generateEmojisList = () => {
    return EMOJIS.reduce((acc, emoji) => {
      acc += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
      </label>`;
      return acc;
    }, ``);
  };

  const returnActive = (item) => {
    const resultClass = item
      ? `checked`
      : ``;
    return resultClass;
  };

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">
          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${cast}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${transformDateTime(filmDate, DateFormats.DAY_MONTH_YEAR)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${translateMinutesToText(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.size > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${generateGenres()}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${returnActive(isInWatchlist)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${returnActive(isWatched)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${returnActive(isFavorite)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${generateComments()}
        </ul>
        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${generateEmojisList()}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._popupClickHandler = this._popupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._buttonDeleteClickHandler = this._buttonDeleteClickHandler.bind(this);
    this._addCommentClickHandler = this._addCommentClickHandler.bind(this);

    this._currentEmoji = null;
    this._prevEmoji = null;
  }

  getTemplate() {
    return createFilmDetails(this._film);
  }

  setPopupClickHandler(callback) {
    this._callback.popupClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._popupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setEmojiClickHandler() {
    const emojiButtons = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiButtons.addEventListener(`click`, this._emojiClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteComment = callback;

    const commentsList = this.getElement().querySelector(`.film-details__comments-list`);
    commentsList.addEventListener(`click`, this._buttonDeleteClickHandler);
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._addCommentClickHandler);
  }

  removePopupEventListener(callback) {
    document.removeEventListener(`keydown`, callback);
  }

  handleDeleteCommentError(commentId) {
    const noDeletedComment = this.getElement().querySelector(`li[data-comment-id="${commentId}"]`);
    this._shake(noDeletedComment, () => {
      noDeletedComment.style.animation = ``;
      const deleteButton = noDeletedComment.querySelector(`button`);
      deleteButton.textContent = `Delete`;
      deleteButton.disabled = false;
    });
  }

  handleAddCommentError() {
    const commentField = this.getElement().querySelector(`.film-details__comment-input`);
    this._shake(commentField, () => {
      commentField.style.animation = ``;
      commentField.disabled = false;
      commentField.style.color = `black`;
      commentField.textContent = ``;
    });
  }

  _shake(elementToShake, afterShake) {
    elementToShake.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    elementToShake.onanimationend = () => {
      afterShake();
    };
  }

  _warnUserNotFilled(element) {
    element.style.outline = `2px solid red`;
    this._shake(element, () => {
      element.style.outline = `none`;
      element.style.animation = ``;
    });
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `IMG`) {
      return;
    }

    this._prevEmoji = this._currentEmoji;
    this._currentEmoji = createElement(`<img src="${evt.target.src}" width="55" height="55" alt="${evt.target.alt}"></img>`);

    if (!this._prevEmoji) {
      this.getElement().querySelector(`.film-details__add-emoji-label`).appendChild(this._currentEmoji);
      return;
    }

    replace(this._currentEmoji, this._prevEmoji);
  }

  _buttonDeleteClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `BUTTON`) {
      return;
    }

    if (evt.target.disabled === true) {
      return;
    }

    evt.target.disabled = true;
    evt.target.textContent = `Deleting...`;

    const commentId = evt.target.closest(`.film-details__comment`).getAttribute(`data-comment-id`);
    this._callback.deleteComment(commentId);
  }

  _addCommentClickHandler(evt) {
    if (evt.key === `Enter` && evt.ctrlKey) {
      evt.preventDefault();
      const commentField = this.getElement().querySelector(`.film-details__comment-input`);

      if (!this._currentEmoji) {
        const emojiField = this.getElement().querySelector(`.film-details__add-emoji-label`);
        this._warnUserNotFilled(emojiField);
        return;
      }

      if (!commentField.value) {
        this._warnUserNotFilled(commentField);
        return;
      }

      commentField.disabled = true;
      commentField.style.color = `#878787`;

      this._callback.addComment(commentField.value, this._currentEmoji.alt);
    }
  }

  _popupClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupClick();
  }
}
