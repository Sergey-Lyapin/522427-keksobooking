'use strict';

(function () {
  window.timeInField = document.querySelector('#timein');
  window.timeOutField = document.querySelector('#timeout');
  window.apartmentTypeField = document.querySelector('#type');
  var priceField = document.querySelector('#price');
  window.roomNumberField = document.querySelector('#room_number');
  window.capacityField = document.querySelector('#capacity');
  var titleField = document.querySelector('#title');
  var descriptionField = document.querySelector('#description');
  window.successPopup = document.querySelector('.success');
  window.formResetButton = document.querySelector('.ad-form__reset');
  window.typeSelect = document.querySelector('#housing-type');
  var typeFormSelect = document.querySelector('#type');
  var roomsFormSelect = document.querySelector('#room_number');
  var guestsFormSelect = document.querySelector('#capacity');
  var timeinFormSelect = document.querySelector('#timein');
  var timeoutFormSelect = document.querySelector('#timeout');
  window.priceSelect = document.querySelector('#housing-price');
  window.roomsSelect = document.querySelector('#housing-rooms');
  window.guestsSelect = document.querySelector('#housing-guests');
  window.featuresFieldset = document.querySelector('#housing-features');

  var TypeToFilter = {
    'palace': function (ad) {
      return ad.offer.type === 'palace';
    },
    'flat': function (ad) {
      return ad.offer.type === 'flat';
    },
    'house': function (ad) {
      return ad.offer.type === 'house';
    },
    'bungalo': function (ad) {
      return ad.offer.type === 'bungalo';
    },
    'any': function (ad) {
      return ad;
    }
  };

  var PriceToFilter = {
    'low': function (ad) {
      return ad.offer.price < 10000;
    },
    'middle': function (ad) {
      return ad.offer.price >= 10000 && ad.offer.price <= 50000;
    },
    'high': function (ad) {
      return ad.offer.price > 50000;
    },
    'any': function (ad) {
      return ad;
    }
  };

  var RoomsToFilter = {
    '1': function (ad) {
      return ad.offer.rooms === 1;
    },
    '2': function (ad) {
      return ad.offer.rooms === 2;
    },
    '3': function (ad) {
      return ad.offer.rooms === 3;
    },
    'any': function (ad) {
      return ad;
    }
  };

  var GuestsToFilter = {
    '0': function (ad) {
      return ad.offer.guests === 0;
    },
    '1': function (ad) {
      return ad.offer.guests === 1;
    },
    '2': function (ad) {
      return ad.offer.guests === 2;
    },
    'any': function (ad) {
      return ad;
    }
  };

  var TypePriceDependency = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  function contains(where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  function filterFeatures(ad) {
    var featuresChecked = document.querySelectorAll('#housing-features input[type="checkbox"]:checked');
    var featuresCheckedValues = [].map.call(featuresChecked, function (feature) {
      return feature.value;
    });
    return contains(ad.offer.features, featuresCheckedValues);
  }

  window.updatePins = function () {
    var popup = window.tokioMap.querySelector('.popup');

    if (popup) {
      window.tokioMap.removeChild(popup);
    }

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      window.mapPins.removeChild(pins[i]);
    }

    var filteredData = window.ads.filter(TypeToFilter[window.typeSelect.value]).filter(PriceToFilter[window.priceSelect.value]).filter(RoomsToFilter[window.roomsSelect.value]).filter(GuestsToFilter[window.guestsSelect.value]).filter(filterFeatures);

    window.insertPin(filteredData);
  };

  window.roomsGuestValidate = function () {
    if ((window.roomNumberField.value === '1') && (window.capacityField.value !== '1')) {
      window.capacityField.setCustomValidity('В одной комнате может поселиться только один гость.');
    } else if ((window.roomNumberField.value === '2') && (window.capacityField.value !== '1') && (window.capacityField.value !== '2')) {
      window.capacityField.setCustomValidity('В двух комнатах не может поселиться более 2 гостей.');
    } else if ((window.roomNumberField.value === '3') && (window.capacityField.value !== '1') && (window.capacityField.value !== '2') && (window.capacityField.value !== '3')) {
      window.capacityField.setCustomValidity('В трех комнатах не может поселиться более 3 гостей.');
    } else if ((window.roomNumberField.value === '100') && (window.capacityField.value !== '0')) {
      window.capacityField.setCustomValidity('Сто комнат предназначены не для гостей!');
    } else {
      window.capacityField.setCustomValidity('');
    }
  };

  window.setMinimalPrice = function () {
    priceField.min = TypePriceDependency[window.apartmentTypeField.value];
    priceField.placeholder = TypePriceDependency[window.apartmentTypeField.value];
  };

  window.roomsGuestValidate();
  window.setMinimalPrice();

  window.syncTimeOut = function () {
    window.timeInField.value = window.timeOutField.value;
  };

  window.syncTimeIn = function () {
    window.timeOutField.value = window.timeInField.value;
  };


  function onSuccess() {
    priceField.value = '';
    priceField.placeholder = 1000;
    titleField.value = '';
    descriptionField.value = '';
    typeFormSelect.value = 'flat';
    roomsFormSelect.value = '1';
    guestsFormSelect.value = '3';
    timeinFormSelect.value = '12:00';
    timeoutFormSelect.value = '12:00';
    var ad = document.querySelector('.map__card');

    if (ad) {
      window.tokioMap.removeChild(ad);
    }

    window.pinMain.style.left = window.PIN_MAIN_X + 'px';
    window.pinMain.style.top = window.PIN_MAIN_Y + 'px';
    window.inputAddress.setAttribute('value', (window.PIN_MAIN_X + window.PIN_MAIN_WIDTH / 2) + ', ' + (window.PIN_MAIN_Y + window.PIN_MAIN_HEIGHT - window.PIN_POINT_GAP));

    for (var i = 0; i < window.formFieldsets.length; i++) {
      window.formFieldsets[i].setAttribute('disabled', 'disabled');
    }

    for (var j = 0; j < window.formSelects.length; j++) {
      window.formSelects[j].setAttribute('disabled', 'disabled');
    }

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var k = 0; k < pins.length; k++) {
      window.mapPins.removeChild(pins[k]);
    }

    var featuresInputs = document.querySelectorAll('.features input');

    for (var l = 0; l < featuresInputs.length; l++) {
      featuresInputs[l].checked = false;
    }

    window.tokioMap.classList.add('map--faded');
    window.adForm.classList.add('ad-form--disabled');
    window.successPopup.classList.remove('hidden');
    window.isAppActivated = false;
    window.adForm.removeEventListener('submit', window.onFormSubmit);
    window.formResetButton.removeEventListener('click', window.onReset);
    window.timeInField.removeEventListfonener('change', window.syncTimeIn);
    window.timeOutField.removeEventListener('change', window.syncTimeOut);
    window.apartmentTypeField.removeEventListener('change', window.setMinimalPrice);
    window.capacityField.removeEventListener('change', window.roomsGuestValidate);
    window.roomNumberField.removeEventListener('change', window.roomsGuestValidate);
    window.typeSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.priceSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.roomsSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.guestsSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.featuresFieldset.removeEventListener('change', window.debounce(window.updatePins));
  }

  window.onReset = function () {
    priceField.value = '';
    priceField.placeholder = 1000;
    titleField.value = '';
    descriptionField.value = '';
    typeFormSelect.value = 'flat';
    roomsFormSelect.value = '1';
    guestsFormSelect.value = '3';
    timeinFormSelect.value = '12:00';
    timeoutFormSelect.value = '12:00';

    var ad = document.querySelector('.map__card');

    if (ad) {
      window.tokioMap.removeChild(ad);
    }

    window.pinMain.style.left = window.PIN_MAIN_X + 'px';
    window.pinMain.style.top = window.PIN_MAIN_Y + 'px';
    window.inputAddress.setAttribute('value', (window.PIN_MAIN_X + window.PIN_MAIN_WIDTH / 2) + ', ' + (window.PIN_MAIN_Y + window.PIN_MAIN_HEIGHT - window.PIN_POINT_GAP));

    for (var i = 0; i < window.formFieldsets.length; i++) {
      window.formFieldsets[i].setAttribute('disabled', 'disabled');
    }

    for (var j = 0; j < window.formSelects.length; j++) {
      window.formSelects[j].setAttribute('disabled', 'disabled');
    }

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var k = 0; k < pins.length; k++) {
      window.mapPins.removeChild(pins[k]);
    }

    var featuresInputs = document.querySelectorAll('.features input');

    for (var l = 0; l < featuresInputs.length; l++) {
      featuresInputs[l].checked = false;
    }

    window.tokioMap.classList.add('map--faded');
    window.adForm.classList.add('ad-form--disabled');
    window.isAppActivated = false;
    window.adForm.removeEventListener('submit', window.onFormSubmit);
    window.formResetButton.removeEventListener('click', window.onReset);
    window.timeInField.removeEventListener('change', window.syncTimeIn);
    window.timeOutField.removeEventListener('change', window.syncTimeOut);
    window.apartmentTypeField.removeEventListener('change', window.setMinimalPrice);
    window.capacityField.removeEventListener('change', window.roomsGuestValidate);
    window.roomNumberField.removeEventListener('change', window.roomsGuestValidate);
    window.typeSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.priceSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.roomsSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.guestsSelect.removeEventListener('change', window.debounce(window.updatePins));
    window.featuresFieldset.removeEventListener('change', window.debounce(window.updatePins));
  };


  window.onSuccessEscPress = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      window.successPopup.classList.add('hidden');
      document.removeEventListener('keydown', window.onSuccessEscPress);
      window.successPopup.removeEventListener('click', window.onRandomAreaClick);
    }
  };

  window.onRandomAreaClick = function () {
    window.successPopup.classList.add('hidden');
    document.removeEventListener('keydown', window.onSuccessEscPress);
    window.successPopup.removeEventListener('click', window.onRandomAreaClick);
  };

  window.onFormSubmit = function (evt) {
    window.save(new FormData(window.adForm), onSuccess, window.onError);
    evt.preventDefault();
  };

})();
