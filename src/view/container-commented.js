import AbstractView from "./abstract.js";

const createExtraCommentedContainer = () => {
  return `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
    </section>`;
};

export default class ContainerCommented extends AbstractView {
  getTemplate() {
    return createExtraCommentedContainer();
  }
  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
