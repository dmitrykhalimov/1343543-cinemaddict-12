import AbstractView from "./abstract.js";

const createExtraRatedContainer = () => {
  return `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
    </section>`;
};

export default class ContainerRated extends AbstractView {
  getTemplate() {
    return createExtraRatedContainer();
  }
  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
