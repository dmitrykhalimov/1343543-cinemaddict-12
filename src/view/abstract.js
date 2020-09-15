import {createElement} from "../utils/render.js";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`You're trying to instantiate an Abstract class, Mario. Princess in the concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method is not implemented: getTemplate`);
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


