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
  var reset = document.querySelector('.ad-form__reset');
  var typeSelect = document.querySelector('.map__filter:nth-child(1)');
  var priceSelect = document.querySelector('.map__filter:nth-child(2)');
  var roomsSelect = document.querySelector('.map__filter:nth-child(3)');
  var guestsSelect = document.querySelector('.map__filter:nth-child(4)');
  var featuresFieldset = document.querySelector('#housing-features');

  var typeToFilter = {
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

  var priceToFilter = {
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

  var roomsToFilter = {
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

  var guestsToFilter = {
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

  function contains(where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  function featuresFilter(ad) {
    var featuresChecked = document.querySelectorAll('#housing-features input[type="checkbox"]:checked');
    var featuresCheckedValues = [].map.call(featuresChecked, function (feature) {
      return feature.value;
    });
    return contains(ad.offer.features, featuresCheckedValues);
  }

  function updatePins() {
    var popup = window.tokioMap.querySelector('.popup');

    if (popup) {
      window.tokioMap.removeChild(popup);
    }

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      window.mapPins.removeChild(pins[i]);
    }

    var filteredData = window.ads.filter(typeToFilter[typeSelect.value]).filter(priceToFilter[priceSelect.value]).filter(roomsToFilter[roomsSelect.value]).filter(guestsToFilter[guestsSelect.value]).filter(featuresFilter);

    window.insertPin(filteredData);
  }

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

  function syncTimeOut() {
    timeInField.value = timeOutField.value;
  }

  function syncTimeIn() {
    timeOutField.value = timeInField.value;
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

  window.adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(window.adForm), onSuccess, window.onError);
    evt.preventDefault();
  });

  function onSuccess() {
    priceField.value = '';
    titleField.value = '';
    descriptionField.value = '';

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

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var k = 0; k < pins.length; k++) {
      window.mapPins.removeChild(pins[k]);
    }

    window.tokioMap.classList.add('map--faded');
    window.adForm.classList.add('ad-form--disabled');
    success.classList.remove('hidden');
    window.isAppActivated = false;
  }

  function onReset() {
    priceField.value = '';
    titleField.value = '';
    descriptionField.value = '';

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

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var k = 0; k < pins.length; k++) {
      window.mapPins.removeChild(pins[k]);
    }

    window.tokioMap.classList.add('map--faded');
    window.adForm.classList.add('ad-form--disabled');
    window.isAppActivated = false;
  }


  function onSuccessEscPress(evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      success.classList.add('hidden');
    }
  }

  function onRandomAreaClick() {
    success.classList.add('hidden');
  }

  apartmentTypeField.addEventListener('change', setMinimalPrice);
  capacityField.addEventListener('change', roomsGuestValidation);
  roomNumberField.addEventListener('change', roomsGuestValidation);
  timeInField.addEventListener('change', syncTimeIn);
  timeOutField.addEventListener('change', syncTimeOut);
  document.addEventListener('keydown', onSuccessEscPress);
  document.addEventListener('click', onRandomAreaClick);
  reset.addEventListener('click', onReset);
  typeSelect.addEventListener('change', window.debounce(updatePins));
  priceSelect.addEventListener('change', window.debounce(updatePins));
  roomsSelect.addEventListener('change', window.debounce(updatePins));
  guestsSelect.addEventListener('change', window.debounce(updatePins));
  featuresFieldset.addEventListener('change', window.debounce(updatePins));

})();
