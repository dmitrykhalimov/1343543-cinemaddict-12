import AbstractView from "./abstract.js";

const createUserProfile = () => {
  return `<section class="header__profile profile">
      <p class="profile__rating"></p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class UserProfile extends AbstractView {
  getTemplate() {
    return createUserProfile();
  }

  updateRank(rank) {
    this.getElement().querySelector(`.profile__rating`).textContent = rank;
  }
}
