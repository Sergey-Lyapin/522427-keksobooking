'use strict';

(function () {
  var NUMBER_OF_USERS = 8;
  var MIN_X = 0;
  var MAX_X = 1199;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var NUMBER_OF_ROOMS_MIN = 1;
  var NUMBER_OF_ROOMS_MAX = 5;
  var GUESTS_MIN = 1;
  var GUESTS_MAX = 20;
  var ROOM_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var ROOM_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var ROOM_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var AD_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  window.generateAds = function () {
    var adsArray = [];

    for (var i = 0; i < NUMBER_OF_USERS; i++) {
      var locationX = window.util.getRandomNumber(MIN_X, MAX_X);
      var locationY = window.util.getRandomNumber(MIN_Y, MAX_Y);

      adsArray.push({
        'author': {
          'avatar': window.generateAvatars()[i]
        },

        'offer': {
          'title': AD_TITLES[i],
          'address': locationX + ', ' + locationY,
          'price': window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
          'type': window.util.getRandomElement(ROOM_TYPES),
          'rooms': window.util.getRandomNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
          'guests': window.util.getRandomNumber(GUESTS_MIN, GUESTS_MAX),
          'checkin': window.util.getRandomElement(TIMES),
          'checkout': window.util.getRandomElement(TIMES),
          'features': window.util.getRandomArray(ROOM_FEATURES),
          'description': '',
          'photos': ROOM_PHOTOS.sort(window.util.compareRandom)
        },

        'location': {
          'x': locationX,
          'y': locationY
        }

      });

    }

    return adsArray;
  };

  window.generateAvatars = function () {
    var listAvatars = [];

    for (var i = 1; i < NUMBER_OF_USERS + 1; i++) {
      i = '0' + i;
      var avatar = 'img/avatars/user' + i + '.png';
      listAvatars.push(avatar);
    }

    return listAvatars;
  };
})();
