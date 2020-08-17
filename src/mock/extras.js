export const generateTopRated = (films) => {
  return films.slice().sort((a, b) => b.rating - a.rating);
};

export const generateTopCommented = (films) => {
  return films.slice().sort((a, b) => b.comments.length - a.comments.length);
};
