import {createElement} from "../utils.js";

const createFooterStats = (filmsInBase) => {
  return `<p>${filmsInBase} movies inside</p>`;
};

export default class FooterStats {
  constructor(filmsInBase) {
    this._filmsInBase = filmsInBase;
    this._element = null;
  }

  getTemplate() {
    return createFooterStats(this._filmsInBase);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
