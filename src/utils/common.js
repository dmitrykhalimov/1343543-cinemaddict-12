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
