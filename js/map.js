'use strict';

var NUMBER_OF_USERS = 8;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 100;
var MAX_Y = 500;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var NUMBER_OF_ROOMS_MIN = 1;
var NUMBER_OF_ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var PIN_HEIGHT = 40;
var PIN_WIDTH = 40;
var ROOM_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var ROOM_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ROOM_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var tokioMap = document.querySelector('.map');
var ads = generateAds();
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adTemplate = document.querySelector('template').content.querySelector('.map__card');

tokioMap.classList.remove('map--faded');
insertPin();
insertAd();


function generateAds() {
  var adsArray = [];

  for (var i = 0; i < NUMBER_OF_USERS; i++) {
    var locationX = getRandomNumber(MIN_X, MAX_X);
    var locationY = getRandomNumber(MIN_Y, MAX_Y);

    adsArray.push({
      'author': {
        'avatar': generateAvatars()[i]
      },

      'offer': {
        'title': AD_TITLES[i],
        'address': locationX + ', ' + locationY,
        'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
        'type': getRandomElement(ROOM_TYPES),
        'rooms': getRandomNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
        'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
        'checkin': getRandomElement(TIMES),
        'checkout': getRandomElement(TIMES),
        'features': getRandomArray(ROOM_FEATURES),
        'description': '',
        'photos': ROOM_PHOTOS.sort(compareRandom)
      },

      'location': {
        'x': locationX,
        'y': locationY
      }

    });

  }

  return adsArray;
}


function createPin(pinsArrayElement) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (pinsArrayElement.location.x - (PIN_WIDTH / 2)) + 'px';
  pinElement.style.top = (pinsArrayElement.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = pinsArrayElement.author.avatar;
  pinElement.querySelector('img').alt = pinsArrayElement.offer.title;

  return pinElement;
}

function insertPin() {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createPin(ads[i]));
  }

  mapPins.appendChild(fragment);
}

function createAd(adArrayElement) {
  var adElement = adTemplate.cloneNode(true);
  var adAvatar = adTemplate.querySelector('.popup__avatar');

  adAvatar.src = adArrayElement.author.avatar;
  adAvatar.alt = adArrayElement.offer.title;

  adElement.querySelector('.popup__title').textContent = adArrayElement.offer.title;
  adElement.querySelector('.popup__text--address').textContent = adArrayElement.offer.address;
  adElement.querySelector('.popup__text--price').textContent = adArrayElement.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = translateType(adArrayElement.offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = 'Для ' + adArrayElement.offer.guests + ' гостей в ' + adArrayElement.offer.rooms + ' комнатах';
  adElement.querySelector('.popup__text--time').textContent = 'заезд после ' + adArrayElement.offer.checkin + ', выезд до ' + adArrayElement.offer.checkout;
  removeChilds(adElement.querySelector('.popup__features'));
  adElement.querySelector('.popup__features').appendChild(generateIconsFeatures(adArrayElement.offer.features));
  adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;
  removeChilds(adElement.querySelector('.popup__photos'));
  adElement.querySelector('.popup__photos').appendChild(generatePopupPhotos(adArrayElement.offer.photos));
  adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;

  return adElement;
}

function insertAd() {
  var mapTokio = document.querySelector('.map');
  var referenceElement = document.querySelector('.map__filters-container');
  var ad0 = createAd(ads[0]);

  mapTokio.insertBefore(ad0, referenceElement);
}


function getRandomNumber(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAvatars() {
  var listAvatars = [];

  for (var i = 1; i < NUMBER_OF_USERS + 1; i++) {
    i = '0' + i;
    var avatar = 'img/avatars/user' + i + '.png';
    listAvatars.push(avatar);
  }

  return listAvatars;
}

function getRandomElement(array) {

  for (var i = 0; i < array.length; i++) {
    var randomIndex = Math.floor(Math.random() * array.length);
  }

  var randomElement = array[randomIndex];

  return randomElement;
}

function compareRandom() {

  return Math.random() - 0.5;
}

function getRandomArray(array) {
  var clone = array.sort(compareRandom).slice();

  clone.length = getRandomNumber(1, array.length);

  return clone;
}

function translateType(type) {

  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    default:
      return type;
  }
}

function removeChilds(element) {

  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

}

function createIconFeature(feature) {
  var iconFeature = document.createElement('li');
  iconFeature.classList.add('popup__feature');
  iconFeature.classList.add('popup__feature--' + feature);

  return iconFeature;
}

function generateIconsFeatures(features) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var featureElement = createIconFeature(features[i]);
    fragment.appendChild(featureElement);
  }

  return fragment;
}

function generatePopupPhotos(arrayPhotos) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayPhotos.length; i++) {
    var photo = createPopupPhoto(arrayPhotos[i]);
    fragment.appendChild(photo);
  }

  return fragment;
}

function createPopupPhoto(photo) {
  var popupPhoto = document.createElement('img');
  popupPhoto.classList.add('popup__photo');
  popupPhoto.setAttribute('width', 45);
  popupPhoto.setAttribute('height', 40);
  popupPhoto.setAttribute('alt', 'Фотография жилья');
  popupPhoto.setAttribute('src', photo);

  return popupPhoto;
}
