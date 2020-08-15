import {getRandomInteger, getRandomFromArray} from "../utils.js";

const TITLES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Man with the Golden Arm`,
  `The Great Flamarion`,
];

const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Great!`,
];

const EMOJIS = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`,
];

const NAMES = [
  `John`,
  `Mark`,
  `Paul`,
  `Kirk`,
  `Bob`,
];

const SURNAMES = [
  `Douglas`,
  `Smith`,
  `Wigton`,
  `Herald`,
  `Potter`
];

const NICKNAMES = [
  `Tim Macoveev`,
  `John Doe`
];

const POSTERS_FILENAMES = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const COUNTRIES = [
  `USA`,
  `France`,
  `Germany`,
  `England`,
  `Italy`,
  `India`
];

const GenresSize = {
  MIN: 1,
  MAX: 3,
};

const RatingSize = {
  MIN: 0,
  MAX: 9,
};

const DurationLimits = {
  MIN: 1,
  MAX: 179,
};

/*
const Limits = {
  Genres: {
    MIN: 1,
    MAX: 3,
  },
  Rating: {
    MIN: 0,
    MAX: 9,
  },
};
*/

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DescriptionLimits = {
  MIN: 1,
  MAX: 5,
};

const CommentLimits = {
  MIN: 0,
  MAX: 5,
};

const DateLimits = {
  MIN: new Date(1930, 0, 1),
  MAX: new Date(),
};

const MAX_DAY_GAP = 14;

const WRITERS_COUNT = 3;
const CAST_COUNT = 3;

export const generateFilm = () => {
  const generateRating = () => {
    const generatedRating = getRandomInteger(RatingSize.MIN, RatingSize.MAX) + `.` + getRandomInteger(0, 9);
    return generatedRating;
  };

  const generateDuration = () => {
    const generatedDuration = getRandomInteger(DurationLimits.MIN, DurationLimits.MAX);
    return generatedDuration;
  };

  const generateGenres = () => {
    const genres = new Set();
    const genresQuantity = getRandomInteger(GenresSize.MIN, GenresSize.MAX);
    for (let i = 0; i < genresQuantity; i++) {
      genres.add(getRandomFromArray(GENRES));
    }
    return genres;
  };

  const generateDescription = () => {
    // Из спортивного интереса не разбил текст на массив строк, а написал функцию случайно выбирающую предложения из текста'
    const sentences = DESCRIPTION.match(/[^\.]+[\. ]+/g);
    let generatedDescription = ``;
    for (let i = DescriptionLimits.MIN; i <= getRandomInteger(DescriptionLimits.MIN, DescriptionLimits.MAX); i++) {
      generatedDescription += sentences[getRandomInteger(0, sentences.length - 1)];
    }
    return generatedDescription;
  };

  const generateComments = () => {
    const commentsQuantity = getRandomInteger(CommentLimits.MIN, CommentLimits.MAX);

    const comments = new Array(commentsQuantity).fill().map(generateComment);
    return comments;
  };

  const generateCommentData = () => {
    const daysGap = getRandomInteger(0, MAX_DAY_GAP);
    /* В ТЗ вроде не нужно трансформировать дату, а в макете так реализовано.
    if (daysGap === 0) {
      return `Today`;
    } else if (daysGap <= 5) {
      return daysGap + ` days ago`;
    }
    */
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysGap);

    return new Date(currentDate);
  };

  const generateComment = () => {
    return {
      emoji: getRandomFromArray(EMOJIS),
      comment: getRandomFromArray(COMMENTS),
      nickname: getRandomFromArray(NICKNAMES),
      dateComment: generateCommentData(),
    };
  };

  const generateNamesArray = (quantity) => {
    return new Array(quantity)
      .fill()
      .map(function () {
        return getRandomFromArray(NAMES) + ` ` + getRandomFromArray(SURNAMES);
      })
      .join(`, `);
  };

  const generateDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  return {
    title: getRandomFromArray(TITLES),
    titleOriginal: ``,
    poster: getRandomFromArray(POSTERS_FILENAMES),
    country: getRandomFromArray(COUNTRIES),
    director: getRandomFromArray(NAMES) + ` ` + getRandomFromArray(SURNAMES),

    writers: generateNamesArray(WRITERS_COUNT),
    cast: generateNamesArray(CAST_COUNT),

    genres: generateGenres(),
    description: generateDescription(),
    rating: generateRating(),
    duration: generateDuration(),
    comments: generateComments(),
    filmDate: generateDate(DateLimits.MIN, DateLimits.MAX),

    age: getRandomInteger(12, 21) + `+`,
    isInWatchlist: getRandomInteger(0, 1),
    isWatched: getRandomInteger(0, 1),
    isFavorite: getRandomInteger(0, 1),
  };
};
