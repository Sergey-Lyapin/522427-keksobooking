'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1199;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;
  var ENTER_KEYCODE = 13;

  window.map = {
    PIN_MAIN_WIDTH: 62,
    PIN_MAIN_HEIGHT: 70,
    PIN_MAIN_X: 570,
    PIN_MAIN_Y: 375,
    PIN_POINT_GAP: 53,
    ESC_KEYCODE: 27,
    isAppActivated: false,

    tokioMap: document.querySelector('.map'),
    pinMain: document.querySelector('.map .map__pin--main'),
    adForm: document.querySelector('.ad-form'),
    inputAddress: document.querySelector('#address'),
    formFieldsets: document.querySelectorAll('form fieldset'),
    formSelects: document.querySelectorAll('form select'),
    mapPins: document.querySelector('.map__pins'),

    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '35px';

      node.textContent = errorMessage;
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.map.ESC_KEYCODE) {
          documentBody.removeChild(node);
        }
      });
      document.body.insertAdjacentElement('afterbegin', node);
    },

    closeAd: function () {
      var popup = window.map.tokioMap.querySelector('.popup');
      if (popup) {
        window.map.tokioMap.removeChild(popup);
      }
      document.removeEventListener('keydown', window.map.onPopupEscPress);
    },

    onPopupCloseEnterPress: function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.map.closeAd();
      }
    },

    onPopupEscPress: function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        window.map.closeAd();
      }
    },

    insertPin: function (data) {
      var fragment = document.createDocumentFragment();
      var newData = data.slice();
      newData = newData.splice(0, 5);
      for (var i = 0; i < newData.length; i++) {
        fragment.appendChild(createPin(newData[i]));
      }

      window.map.mapPins.appendChild(fragment);
    }

  };


  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var documentBody = document.querySelector('body');

  function onSuccessLoad(adsData) {
    adsData.forEach(function (ad, index) {
      ad.index = index;
    });
    window.ads = adsData;
  }


  window.backend.load(onSuccessLoad, window.map.onError);
  // Функции для работы обработчиков на объявлении

  function insertAd(i) {
    var mapTokio = document.querySelector('.map');
    var referenceElement = document.querySelector('.map__filters-container');

    var ad = window.createAd(window.ads[i]);


    mapTokio.insertBefore(ad, referenceElement);
  }

  // Создаём и вставляем на карту метки

  function createPin(pinsArrayElement) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = (pinsArrayElement.location.x - (PIN_WIDTH / 2)) + 'px';
    pinElement.style.top = (pinsArrayElement.location.y - PIN_HEIGHT) + 'px';
    pinElement.querySelector('img').src = pinsArrayElement.author.avatar;
    pinElement.querySelector('img').alt = pinsArrayElement.offer.title;
    pinElement.addEventListener('click', function () {
      window.map.closeAd();
      for (var i = 0; i < window.ads.length; i++) {
        if (pinsArrayElement.index === window.ads[i].index) {
          insertAd(i);
        }
      }
    });

    return pinElement;
  }

  // Устанавливаем начальные координаты метки
  window.map.inputAddress.setAttribute('value', (window.map.PIN_MAIN_X + window.map.PIN_MAIN_WIDTH / 2) + ', ' + (window.map.PIN_MAIN_Y + window.map.PIN_MAIN_HEIGHT - window.map.PIN_POINT_GAP));
  // Описываем передвижение главной метки по карте
  window.map.pinMain.addEventListener('mousedown', onMouseDown);

  function onMouseDown(evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };


    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      var newY = window.map.pinMain.offsetTop - shift.y;
      var newX = window.map.pinMain.offsetLeft - shift.x;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.map.pinMain.style.left = (restrictX(newX)) + 'px';
      window.map.pinMain.style.top = (restrictY(newY)) + 'px';


      window.map.inputAddress.setAttribute('value', (restrictX(newX) + window.map.PIN_MAIN_WIDTH / 2) + ', ' + (restrictY(newY) + PIN_HEIGHT));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      if (!window.form.isAppActivated) {
        onPinmainMouseup();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  // Функция, описывающая переход в активное состояние после перемещения метки
  function onPinmainMouseup() {

    window.map.tokioMap.classList.remove('map--faded');

    window.map.formFieldsets.forEach(function (item) {
      item.removeAttribute('disabled');
    });

    window.map.formSelects.forEach(function (item) {
      item.removeAttribute('disabled');
    });

    window.map.adForm.classList.remove('ad-form--disabled');

    window.map.insertPin(window.ads);
    window.form.isAppActivated = true;

    document.addEventListener('keydown', window.form.onSuccessEscPress);
    window.form.successPopup.addEventListener('click', window.form.onSuccessPopupClick);
    window.map.adForm.addEventListener('submit', window.form.onFormSubmit);
    window.form.formResetButton.addEventListener('click', window.form.onReset);
    window.form.timeInField.addEventListener('change', window.form.syncTimeIn);
    window.form.timeOutField.addEventListener('change', window.form.syncTimeOut);
    window.form.apartmentTypeField.addEventListener('change', window.form.setMinimalPrice);
    window.form.capacityField.addEventListener('change', window.form.roomsGuestValidate);
    window.form.roomNumberField.addEventListener('change', window.form.roomsGuestValidate);
    window.form.typeSelect.addEventListener('change', window.debounce(window.form.updatePins));
    window.form.priceSelect.addEventListener('change', window.debounce(window.form.updatePins));
    window.form.roomsSelect.addEventListener('change', window.debounce(window.form.updatePins));
    window.form.guestsSelect.addEventListener('change', window.debounce(window.form.updatePins));
    window.form.featuresFieldset.addEventListener('change', window.debounce(window.form.updatePins));
  }

  // Функции для ограничения перемещения метки по полю

  function restrictY(Ycoord) {
    if (Ycoord < MIN_Y - window.map.PIN_MAIN_HEIGHT) {
      Ycoord = MIN_Y - window.map.PIN_MAIN_HEIGHT;
    } else if (Ycoord > MAX_Y - window.map.PIN_MAIN_HEIGHT) {
      Ycoord = MAX_Y - window.map.PIN_MAIN_HEIGHT;
    }
    return Ycoord;
  }

  function restrictX(Xcoord) {
    if (Xcoord < MIN_X) {
      Xcoord = MIN_X;
    } else if (Xcoord > MAX_X - window.map.PIN_MAIN_WIDTH) {
      Xcoord = MAX_X - window.map.PIN_MAIN_WIDTH;
    }
    return Xcoord;
  }
})();
