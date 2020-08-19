import AbstractView from "./abstract.js";

const createButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class Button extends AbstractView {
  getTemplate() {
    return createButton();
  }
}
