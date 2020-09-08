import {getRandomInteger, getRandomBoolean, getRandomFromElements} from "../utils/common.js";

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
  MIN: 30,
  MAX: 179,
};

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

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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
      genres.add(getRandomFromElements(GENRES));
    }
    return genres;
  };

  const generateDescription = () => {
    const sentences = DESCRIPTION.match(/[^\.]+[\. ]+/g);
    let generatedDescription = ``;
    const descriptionLength = getRandomInteger(DescriptionLimits.MIN, DescriptionLimits.MAX);
    for (let i = DescriptionLimits.MIN; i <= descriptionLength; i++) {
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

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysGap);

    return new Date(currentDate);
  };

  const generateComment = () => {
    return {
      id: generateId(),
      emoji: getRandomFromElements(EMOJIS),
      comment: getRandomFromElements(COMMENTS),
      nickname: getRandomFromElements(NICKNAMES),
      dateComment: generateCommentData(),
    };
  };

  const generateNamesArray = (quantity) => {
    return new Array(quantity)
      .fill()
      .map(function () {
        return getRandomFromElements(NAMES) + ` ` + getRandomFromElements(SURNAMES);
      })
      .join(`, `);
  };

  const generateDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  return {
    title: getRandomFromElements(TITLES),
    id: generateId(),
    titleOriginal: ``,
    poster: getRandomFromElements(POSTERS_FILENAMES),
    country: getRandomFromElements(COUNTRIES),
    director: getRandomFromElements(NAMES) + ` ` + getRandomFromElements(SURNAMES),

    writers: generateNamesArray(WRITERS_COUNT),
    cast: generateNamesArray(CAST_COUNT),

    genres: generateGenres(),
    description: generateDescription(),
    rating: generateRating(),
    duration: generateDuration(),
    comments: generateComments(),
    filmDate: generateDate(DateLimits.MIN, DateLimits.MAX),

    age: getRandomInteger(12, 21) + `+`,

    isInWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};
