'use strict';

var COMMENT_ARR = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAME_ARR = ['Денис', 'Дмитрий', 'Антон', 'Алексей', 'Александр', 'Виктор'];
var userPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var userPictureListElem = document.querySelector('.pictures');
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
