'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1199;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;
  window.PIN_MAIN_WIDTH = 62;
  window.PIN_MAIN_HEIGHT = 70;
  window.PIN_MAIN_X = 570;
  window.PIN_MAIN_Y = 375;
  window.PIN_POINT_GAP = 53;
  window.ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  window.isAppActivated = false;

  window.tokioMap = document.querySelector('.map');
  window.pinMain = window.tokioMap.querySelector('.map__pin--main');
  window.adForm = document.querySelector('.ad-form');
  window.inputAddress = document.querySelector('#address');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  window.formFieldset = document.querySelectorAll('form fieldset');
  window.formSelect = document.querySelectorAll('form select');
  window.mapPins = document.querySelector('.map__pins');
  var documentBody = document.querySelector('body');


  function onSuccessLoad(adsData) {
    adsData.forEach(function (ad, index) {
      ad.index = index;
    });
    window.ads = adsData;
  }


  window.onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '35px';

    node.textContent = errorMessage;
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.ESC_KEYCODE) {
        documentBody.removeChild(node);
      }
    });
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onSuccessLoad, window.onError);
  // Функции для работы обработчиков на объявлении

  window.closeAd = function () {
    var popup = window.tokioMap.querySelector('.popup');
    if (popup) {
      window.tokioMap.removeChild(popup);
    }
    document.removeEventListener('keydown', window.onPopupEscPress);
  };

  window.onPopupCloseEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      window.closeAd();
    }
  };

  window.onPopupEscPress = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      window.closeAd();
    }
  };

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
      window.closeAd();
      for (var i = 0; i < window.ads.length; i++) {
        if (pinsArrayElement.index === window.ads[i].index) {
          insertAd(i);
        }
      }
    });

    return pinElement;
  }

  window.insertPin = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < 5; i++) {
      if (i > data.length - 1) break;
      fragment.appendChild(createPin(data[i]));
    }

    window.mapPins.appendChild(fragment);
  };
  // Устанавливаем начальные координаты метки
  window.inputAddress.setAttribute('value', (window.PIN_MAIN_X + window.PIN_MAIN_WIDTH / 2) + ', ' + (window.PIN_MAIN_Y + window.PIN_MAIN_HEIGHT - window.PIN_POINT_GAP));
  // Описываем передвижение главной метки по карте
  window.pinMain.addEventListener('mousedown', onMouseDown);

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
      var newY = window.pinMain.offsetTop - shift.y;
      var newX = window.pinMain.offsetLeft - shift.x;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.pinMain.style.left = (limitationX(newX)) + 'px';
      window.pinMain.style.top = (limitationY(newY)) + 'px';


      window.inputAddress.setAttribute('value', (limitationX(newX) + window.PIN_MAIN_WIDTH / 2) + ', ' + (limitationY(newY) + PIN_HEIGHT));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      if (!window.isAppActivated) {
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

    window.tokioMap.classList.remove('map--faded');

    for (var i = 0; i < window.formFieldset.length; i++) {
      window.formFieldset[i].removeAttribute('disabled');
    }

    for (var j = 0; j < window.formSelect.length; j++) {
      window.formSelect[j].removeAttribute('disabled');
    }

    window.adForm.classList.remove('ad-form--disabled');

    window.insertPin(window.ads);
    window.isAppActivated = true;

  }

  // Функции для ограничения перемещения метки по полю

  function limitationY(Ycoord) {
    if (Ycoord < MIN_Y - window.PIN_MAIN_HEIGHT) {
      Ycoord = MIN_Y - window.PIN_MAIN_HEIGHT;
    } else if (Ycoord > MAX_Y - window.PIN_MAIN_HEIGHT) {
      Ycoord = MAX_Y - window.PIN_MAIN_HEIGHT;
    }
    return Ycoord;
  }

  function limitationX(Xcoord) {
    if (Xcoord < MIN_X) {
      Xcoord = MIN_X;
    } else if (Xcoord > MAX_X - window.PIN_MAIN_WIDTH) {
      Xcoord = MAX_X - window.PIN_MAIN_WIDTH;
    }
    return Xcoord;
  }
})();
