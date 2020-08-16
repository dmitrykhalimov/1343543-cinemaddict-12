export const generateTopRated = (films) => {
  return films.concat().sort(function (a, b) {
    if (a.rating > b.rating) {
      return -1;
    }
    if (a.rating < b.rating) {
      return 1;
    }
    return 0;
  });
};

export const generateTopCommented = (films) => {
  return films.concat().sort(function (a, b) {
    if (a.comments.length > b.comments.length) {
      return -1;
    }
    if (a.comments.length < b.comments.length) {
      return 1;
    }
    return 0;
  });
};
