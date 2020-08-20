import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createSort = () => {
  return `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`;
};

export default class Sort extends AbstractView {
  getTemplate() {
    return createSort();
  }
}
