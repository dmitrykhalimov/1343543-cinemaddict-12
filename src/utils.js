// Функции случайного поиска

export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => {
  return Math.random() >= 0.5;
};

export const getRandomFromElements = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

// Функции обработки представления данных

export const getOnlyYearFromDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`});
};

export const getDateDetailed = (date) => {
  return date.toLocaleString(`en-GB`, {year: `numeric`, day: `2-digit`, month: `long`});
};

export const getDateComment = (date) => {
  return date.toLocaleString(`en-ZA`);
};

export const translateMinutesToText = (duration) => {
  const MIN_IN_HOUR = 60;

  const hours = Math.trunc(duration / MIN_IN_HOUR);
  const minutes = duration - (hours * MIN_IN_HOUR);

  return `${hours}h ${minutes}m`;
};

// Функции отрисовки DOM-элементов

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
