import {nanoid} from "nanoid";
import FilmsModel from "../model/films.js";

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (Provider.isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          // const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          // this._store.setItems(items);
          return films;
        });
    }

    // const storeTasks = Object.values(this._store.getItems());
    return null;
    // return Promise.resolve(storeTasks.map(TasksModel.adaptToClient));
  }

  getComments(filmId) {
    if (Provider.isOnline()) {
      return this._api.getFilms(filmId)
        .then((comments) => {
          // const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          // this._store.setItems(items);
          return comments;
        });
    }

    // const storeTasks = Object.values(this._store.getItems());
    return null;
    // return Promise.resolve(storeTasks.map(TasksModel.adaptToClient));
  }

  updateFilm(film) {
    if (Provider.isOnline()) {
      return this._api.updateTask(film)
        .then((filmUpdated) => {
          // this._store.setItem(updatedTask.id, TasksModel.adaptToServer(updatedTask));
          return filmUpdated;
        });
    }

    // this._store.setItem(task.id, TasksModel.adaptToServer(Object.assign({}, task)));

    return null;
    //return Promise.resolve(task);
  }

  addComment(comment) {
    if (Provider.isOnline()) {
      return this._api.addComment(comment)
        .then((response) => {
          return response;
        });
    }
    return null;
  }

  deleteComment(commentId) {
    if (Provider.isOnline()) {
      return this._api.deleteComment(commentId)
        .then((response) => response);
    }
    return null;
  }

  // addTask(task) {
  //   if (Provider.isOnline()) {
  //     return this._api.addTask(task)
  //       .then((newTask) => {
  //         this._store.setItem(newTask.id, TasksModel.adaptToServer(newTask));
  //         return newTask;
  //       });
  //   }

  //   // На случай локального создания данных мы должны сами создать `id`.
  //   // Иначе наша модель будет не полной, и это может привнести баги
  //   const localNewTaskId = nanoid();
  //   const localNewTask = Object.assign({}, task, {id: localNewTaskId});

  //   this._store.setItem(localNewTask.id, TasksModel.adaptToServer(localNewTask));

  //   return Promise.resolve(localNewTask);
  // }

  // deleteTask(task) {
  //   if (Provider.isOnline()) {
  //     return this._api.deleteTask(task)
  //       .then(() => this._store.removeItem(task.id));
  //   }

  //   this._store.removeItem(task.id);

  //   return Promise.resolve();
  // }

  // sync() {
  //   if (Provider.isOnline()) {
  //     const storeTasks = Object.values(this._store.getItems());

  //     return this._api.sync(storeTasks)
  //       .then((response) => {
  //         // Забираем из ответа синхронизированные задачи
  //         const createdTasks = getSyncedTasks(response.created);
  //         const updatedTasks = getSyncedTasks(response.updated);

  //         // Добавляем синхронизированные задачи в хранилище.
  //         // Хранилище должно быть актуальным в любой момент.
  //         const items = createStoreStructure([...createdTasks, ...updatedTasks]);

  //         this._store.setItems(items);
  //       });
  //   }

  //   return Promise.reject(new Error(`Sync data failed`));
  // }

  static isOnline() {
    return window.navigator.onLine;
  }
}
