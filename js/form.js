'use strict';

(function () {
  var timeInField = document.querySelector('#timein');
  var timeOutField = document.querySelector('#timeout');
  var apartmentTypeField = document.querySelector('#type');
  var priceField = document.querySelector('#price');
  var roomNumberField = document.querySelector('#room_number');
  var capacityField = document.querySelector('#capacity');
  var titleField = document.querySelector('#title');
  var descriptionField = document.querySelector('#description');
  var success = document.querySelector('.success');

  var typePriceDependency = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  roomsGuestValidation();
  setMinimalPrice();

  function setMinimalPrice() {
    priceField.min = typePriceDependency[apartmentTypeField.value];
    priceField.placeholder = typePriceDependency[apartmentTypeField.value];
  }

  function roomsGuestValidation() {
    if ((roomNumberField.value === '1') && (capacityField.value !== '1')) {
      capacityField.setCustomValidity('В одной комнате может поселиться только один гость.');
    } else if ((roomNumberField.value === '2') && (capacityField.value !== '1') && (capacityField.value !== '2')) {
      capacityField.setCustomValidity('В двух комнатах не может поселиться более 2 гостей.');
    } else if ((roomNumberField.value === '3') && (capacityField.value !== '1') && (capacityField.value !== '2') && (capacityField.value !== '3')) {
      capacityField.setCustomValidity('В трех комнатах не может поселиться более 3 гостей.');
    } else if ((roomNumberField.value === '100') && (capacityField.value !== '0')) {
      capacityField.setCustomValidity('Сто комнат предназначены не для гостей!');
    } else {
      capacityField.setCustomValidity('');
    }
  }

  function timeValidation() {
    if (timeInField.value !== timeOutField.value) {
      timeOutField.setCustomValidity('Время отъезда должно быть равно времени заезда!');
    } else {
      timeOutField.setCustomValidity('');
    }
  }

  window.adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(window.adForm), onSuccess, window.onError);
    evt.preventDefault();
  });

  function onSuccess() {
    priceField.value = '';
    titleField.value = '';
    descriptionField.value = '';

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var ad = document.querySelector('.map__card');

    if (ad) {
      window.tokioMap.removeChild(ad);
    }

    window.pinMain.style.left = window.PIN_MAIN_X + 'px';
    window.pinMain.style.top = window.PIN_MAIN_Y + 'px';
    window.inputAddress.setAttribute('value', (window.PIN_MAIN_X + window.PIN_MAIN_WIDTH / 2) + ', ' + (window.PIN_MAIN_Y + window.PIN_MAIN_HEIGHT - window.PIN_POINT_GAP));

    for (var i = 0; i < window.formFieldset.length; i++) {
      window.formFieldset[i].setAttribute('disabled', 'disabled');
    }

    for (var j = 0; j < window.formSelect.length; j++) {
      window.formSelect[j].setAttribute('disabled', 'disabled');
    }

    for (var k = 0; k < pins.length; k++) {
      window.mapPins.removeChild(pins[k]);
    }

    window.tokioMap.classList.add('map--faded');
    window.adForm.classList.add('ad-form--disabled');
    success.classList.remove('hidden');
    window.isAppActivated = false;
  }


  function onSuccessEscPress(evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      success.classList.add('hidden');
    }
  }

  apartmentTypeField.addEventListener('change', setMinimalPrice);
  capacityField.addEventListener('change', roomsGuestValidation);
  roomNumberField.addEventListener('change', roomsGuestValidation);
  timeInField.addEventListener('change', timeValidation);
  timeOutField.addEventListener('change', timeValidation);
  document.addEventListener('keydown', onSuccessEscPress);
  document.addEventListener('click', onSuccessEscPress);

})();
