import AbstractView from "./abstract.js";

const createBoard = () => {
  return `<section class="films"></section>`;
};


export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createBoard();
  }

  removeElement() {
    this._element = null;
  }
}
