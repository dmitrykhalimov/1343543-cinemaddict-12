import AbstractView from "./abstract.js";

const createFilmsContainer = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainer();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

}
