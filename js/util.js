'use strict';

(function () {

  window.util = {
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
    }
  }

})();
