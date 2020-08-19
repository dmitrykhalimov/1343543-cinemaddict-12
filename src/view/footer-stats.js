import AbstractView from "./abstract.js";

const createFooterStats = (filmsInBase) => {
  return `<p>${filmsInBase} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(filmsInBase) {
    super();
    this._filmsInBase = filmsInBase;
  }

  getTemplate() {
    return createFooterStats(this._filmsInBase);
  }
}
