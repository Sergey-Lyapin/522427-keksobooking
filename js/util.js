'use strict';

(function () {

  window.removeChilds = function (element) {

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

  };

  window.translateType = function (type) {

    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      default:
        return type;
    }
  };

  window.getRandomArray = function (array) {
    var clone = array.sort(window.util.compareRandom).slice();

    clone.length = window.util.getRandomNumber(1, array.length);

    return clone;
  };

  window.compareRandom = function () {

    return Math.random() - 0.5;
  };

  window.getRandomElement = function (array) {

    for (var i = 0; i < array.length; i++) {
      var randomIndex = Math.floor(Math.random() * array.length);
    }

    var randomElement = array[randomIndex];

    return randomElement;
  };

  window.getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

})();
