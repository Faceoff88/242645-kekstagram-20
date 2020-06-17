'use strict';

var COMMENT_ARR = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAME_ARR = ['Денис', 'Дмитрий', 'Антон', 'Алексей', 'Александр', 'Виктор'];
var userPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var userPictureListElem = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var socialCommentsList = bigPicture.querySelector('.social__comments');
var socialCommentsTemplate = bigPicture.querySelector('.social__comment');
var usersPhotos = [];
var comments = [];
var nums = [];

var getRandomNumber = function (min, max) {
  var num = Math.floor(min + Math.random() * (max - min));
  if (nums.includes(num)) {
    return getRandomNumber(min, max);
  } else {
    nums.push(num);
    return num;
  }
};

var getComments = function (cmt) {
  cmt = {};
  cmt.avatar = 'img/avatar-' + Math.floor(1 + Math.random() * (6 - 1)) + '.svg';
  cmt.message = COMMENT_ARR[Math.floor(1 + Math.random() * (6 - 1))];
  cmt.names = NAME_ARR[Math.floor(1 + Math.random() * (6 - 1))];
  return cmt;
};

var getUsersPhoto = function (userPhotoObj) {
  for (var j = 0; j < COMMENT_ARR.length; j++) {
    comments[j] = getComments(comments);
  }
  userPhotoObj = {};
  userPhotoObj.url = 'photos/' + getRandomNumber(1, 26) + '.jpg';
  userPhotoObj.description = 'описание фотографии';
  userPhotoObj.likes = Math.floor(15 + Math.random() * (200 - 15));
  userPhotoObj.comments = [comments[Math.floor(1 + Math.random() * (6 - 1))], comments[Math.floor(1 + Math.random() * (6 - 1))]];
  return userPhotoObj;
};


var renderUsersPhoto = function (photos) {
  var photoElem = userPictureTemplate.cloneNode(true);
  photoElem.querySelector('.picture__img').srcset = photos.url;
  photoElem.querySelector('.picture__likes').textContent = photos.likes;
  photoElem.querySelector('.picture__comments').textContent = photos.comments.length;
  return photoElem;
};


var fillUserPhotos = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 25; i++) {
    usersPhotos[i] = getUsersPhoto(usersPhotos);
    fragment.appendChild(renderUsersPhoto(usersPhotos[i]));
  }
  userPictureListElem.appendChild(fragment);
};

fillUserPhotos();

var renderSocialComments = function (socCmnts) {
  var cmntElem = socialCommentsTemplate.cloneNode(true);
  cmntElem.querySelector('.social__picture').srcset = socCmnts.avatar;
  cmntElem.querySelector('.social__picture').setAttribute('alt', socCmnts.names);
  cmntElem.querySelector('.social__text').textContent = socCmnts.message;
  return cmntElem;
};

var fillBigPicData = function () {
  var firstElem = usersPhotos[0];
  bigPicture.querySelector('.big-picture__img > img').srcset = firstElem.url;
  bigPicture.querySelector('.likes-count').textContent = firstElem.likes;
  bigPicture.querySelector('.comments-count').textContent = firstElem.comments.length;
  bigPicture.querySelector('.social__caption').textContent = firstElem.description;

  var fragmentCmnt = document.createDocumentFragment();
  for (var j = 0; j < firstElem.comments.length; j++) {
    fragmentCmnt.appendChild(renderSocialComments(firstElem.comments[j]));
  }
  socialCommentsList.appendChild(fragmentCmnt);
};

fillBigPicData();

document.querySelector('.social__comment-count').classList.add('hidden');
document.querySelector('.comments-loader').classList.add('hidden');
document.querySelector('body').classList.add('modal-open');

var uploadFile = document.querySelector('#upload-file');
var editPicForm = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('.img-upload__cancel');
var scaleValue = document.querySelector('.scale__control--value');
var imgUploadScale = document.querySelector('.img-upload__scale');
var scaleSmlr = document.querySelector('.scale__control--smaller');
var scaleBgr = document.querySelector('.scale__control--bigger');
var uploadPreview = document.querySelector('.img-upload__preview');
var defScaleValue = 100;
var effList = document.querySelector('.effects__list');
var lvlPin = document.querySelector('.effect-level__pin');
var lvlValue = document.querySelector('.effect-level__value');
var lvlLine = document.querySelector('.effect-level__line');
var EFFECTS = {
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};
var effectsMap = {};

effectsMap[EFFECTS.CHROME] = function (value) {
  var maxValue = 1;
  var coefficient = maxValue * value / 100;

  return 'grayscale(' + coefficient + ')';
};

effectsMap[EFFECTS.SEPIA] = function (value) {
  var maxValue = 1;
  var coefficient = maxValue * value / 100;

  return 'sepia(' + coefficient + ')';
};

effectsMap[EFFECTS.MARVIN] = function (value) {
  return 'invert(' + value + '%)';
};

effectsMap[EFFECTS.PHOBOS] = function (value) {
  var maxValue = 3;
  var coefficient = maxValue * value / 100;

  return 'blur(' + coefficient + 'px)';
};

effectsMap[EFFECTS.HEAT] = function (value) {
  var minValue = 1;
  var maxValue = 3;

  var coefficient = minValue + (value * (maxValue - minValue) / 100);

  return 'brightness(' + coefficient + ')';
};

var onPopupEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopup();
  }
};

var onScaleClick = function (evt) {
  if (evt.target.contains(scaleSmlr) && defScaleValue !== 25) {
    defScaleValue -= 25;
    scaleValue.value = defScaleValue + '%';
    uploadPreview.style.transform = 'scale(' + (defScaleValue / 100) + ')';
  } else if (evt.target.contains(scaleBgr) && defScaleValue !== 100) {
    defScaleValue += 25;
    scaleValue.value = defScaleValue + '%';
    uploadPreview.style.transform = 'scale(' + (defScaleValue / 100) + ')';
  }
};

var getEffects = function (evt) {
  for (var effect in EFFECTS) {
    if (evt.target.value === EFFECTS[effect]) {
      uploadPreview.classList.add('effects__preview--' + EFFECTS[effect]);
      uploadPreview.style.filter = effectsMap[EFFECTS[effect]](lvlValue.value);
    } else if (evt.target.value !== EFFECTS[effect]) {
      uploadPreview.classList.remove('effects__preview--' + EFFECTS[effect]);
    }
  }
};

var openPopap = function () {
  editPicForm.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  imgUploadScale.addEventListener('click', onScaleClick);
  effList.addEventListener('change', getEffects);
  hashTagInputElement.addEventListener('input', onHashTagInputElementInput);
};

var closePopup = function () {
  editPicForm.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  imgUploadScale.removeEventListener('click', onScaleClick);
  effList.removeEventListener('change', getEffects);
  hashTagInputElement.value = '';
  textCommentElement.value = '';
  hashTagInputElement.removeEventListener('input', onHashTagInputElementInput);
};

uploadFile.addEventListener('change', function (evt) {
  evt.preventDefault();
  openPopap();
});

uploadCancel.addEventListener('click', function (evt) {
  evt.preventDefault();
  closePopup();
});


lvlPin.addEventListener('mouseup', function () {
  lvlValue.value = Math.ceil(parseFloat(lvlPin.offsetLeft / lvlLine.offsetWidth) * 100);
});


var uploadTextContainer = document.querySelector('.img-upload__text');

var textCommentElement = uploadTextContainer.querySelector('.text__description');

var hashTagInputElement = uploadTextContainer.querySelector('.text__hashtags');

var getHashTagValidity = function (hashTags) {
  var re = /^#[a-zA-Zа-яА-Я0-9]*$/;

  if (hashTags.length > 5) {
    return 'Превышено максимальное количество тегов (максимум 5 - хеш-тегов)';
  }

  for (var i = 0; i < hashTags.length; i++) {
    if (hashTags[i] === '#') {
      return 'Хеш-тег не может состоять только из "#": ' + hashTags[i];
    } else if (hashTags[i][0] !== '#') {
      return 'Хеш-тег должен начинаться с "#": ' + hashTags[i];
    } else if (!re.test(hashTags[i])) {
      return 'строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.:' + hashTags[i];
    }

    if (hashTags[i].length > 20) {
      return 'Превышена максимальная длина хеш-тега (20 - символов): ' + hashTags[i];
    }
    var currentHashTag = hashTags[i].toLowerCase();

    for (var j = i + 1; j < hashTags.length; j++) {
      var nextHashTag = hashTags[j].toLowerCase();

      if (currentHashTag === nextHashTag) {
        return 'Одинаковые хеш-теги: ' + hashTags[i] + ' и ' + hashTags[j];
      }
    }
  }
  return '';
};
var getFilteredArray = function (str, symbol) {
  return str.split(symbol)
    .filter(function (it) {
      return it !== '';
    });
};

var onHashTagInputElementInput = function () {
  checkValidityField();
};

var checkValidityField = function () {
  var filteredHashTags = getFilteredArray(hashTagInputElement.value, ' ');
  var message = getHashTagValidity(filteredHashTags);

  hashTagInputElement.classList.toggle('text__hashtags--error', (message !== ''));

  hashTagInputElement.setCustomValidity(message);
};

