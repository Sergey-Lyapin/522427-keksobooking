'use strict';

window.util = (function () {

  return {
    removeChilds: function (element) {

      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

    },

    translateType: function (type) {

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
    },

    getRandomArray: function (array) {
      var clone = array.sort(window.util.compareRandom).slice();

      clone.length = window.util.getRandomNumber(1, array.length);

      return clone;
    },

    compareRandom: function () {

      return Math.random() - 0.5;
    },

    getRandomElement: function (array) {

      for (var i = 0; i < array.length; i++) {
        var randomIndex = Math.floor(Math.random() * array.length);
      }

      var randomElement = array[randomIndex];

      return randomElement;
    },

    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  };
})();
