'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1199;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 84;
  var ROOM_PHOTO_HEIGHT = 40;
  var ROOM_PHOTO_WIDTH = 45;
  var PIN_MAIN_X = 570;
  var PIN_MAIN_Y = 375;
  var PIN_POINT_GAP = 53;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var tokioMap = document.querySelector('.map');
  var pinMain = tokioMap.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var inputAddress = document.querySelector('#address');
  var ads = window.generateAds();
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var adTemplate = document.querySelector('template').content.querySelector('.map__card');

  // Создаём и вставляем карточку объявления



  // Создаем иконки удобств

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

  // Создаем список аватаров для объявления



  // Создаем верстку для изображений

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
    popupPhoto.setAttribute('width', ROOM_PHOTO_WIDTH);
    popupPhoto.setAttribute('height', ROOM_PHOTO_HEIGHT);
    popupPhoto.setAttribute('alt', 'Фотография жилья');
    popupPhoto.setAttribute('src', photo);

    return popupPhoto;
  }

  // Функции для работы обработчиков на объявлении

  function closeAd() {
    var popup = tokioMap.querySelector('.popup');
    if (popup) {
      tokioMap.removeChild(popup);
    }
    document.removeEventListener('keydown', onPopupEscPress);
  }

  function onPopupCloseEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeAd();
    }
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeAd();
    }
  }

  function insertAd(i) {
    var mapTokio = document.querySelector('.map');
    var referenceElement = document.querySelector('.map__filters-container');

    var ad = createAd(ads[i]);


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
      closeAd();
      for (var i = 0; i < ads.length; i++) {
        if (pinsArrayElement.author.avatar === ads[i].author.avatar) {
          insertAd(i);
        }
      }
    });

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
  // Устанавливаем начальные координаты метки
  inputAddress.setAttribute('value', (PIN_MAIN_X + PIN_MAIN_WIDTH / 2) + ', ' + (PIN_MAIN_Y + PIN_MAIN_HEIGHT - PIN_POINT_GAP));
  // Описываем передвижение главной метки по карте
  pinMain.addEventListener('mousedown', onMouseDown);

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
      var newY = pinMain.offsetTop - shift.y;
      var newX = pinMain.offsetLeft - shift.x;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinMain.style.left = (limitationX(newX)) + 'px';
      pinMain.style.top = (limitationY(newY)) + 'px';


      inputAddress.setAttribute('value', (limitationX(newX) + PIN_MAIN_WIDTH / 2) + ', ' + (limitationY(newY) + PIN_HEIGHT));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      onPinmainMouseup();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  // Функция, описывающая переход в активное состояние после перемещения метки
  function onPinmainMouseup() {
    var formFieldset = document.querySelectorAll('form fieldset');
    var formSelect = document.querySelectorAll('form select');

    tokioMap.classList.remove('map--faded');

    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].removeAttribute('disabled');
    }

    for (var j = 0; j < formSelect.length; j++) {
      formSelect[j].removeAttribute('disabled');
    }

    adForm.classList.remove('ad-form--disabled');

    insertPin();

  }

  // Функции для ограничения перемещения метки по полю

  function limitationY(Ycoord) {
    if (Ycoord < MIN_Y) {
      Ycoord = MIN_Y;
    } else if (Ycoord > MAX_Y) {
      Ycoord = MAX_Y;
    }
    return Ycoord;
  }

  function limitationX(Xcoord) {
    if (Xcoord < MIN_X) {
      Xcoord = MIN_X;
    } else if (Xcoord > MAX_X - PIN_MAIN_WIDTH) {
      Xcoord = MAX_X - PIN_MAIN_WIDTH;
    }
    return Xcoord;
  }
})();
