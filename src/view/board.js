import AbstractView from "./abstract.js";

const createBoard = () => {
  return `<section class="films"></section>`;
};


export default class Board extends AbstractView {
  getTemplate() {
    return createBoard();
  }

  removeElement() {
    this._element = null;
  }
}
