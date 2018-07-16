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
  var typeSelect = document.querySelector('.map__filter:nth-child(1)');
  var priceSelect = document.querySelector('.map__filter:nth-child(2)');
  var roomsSelect = document.querySelector('.map__filter:nth-child(3)');
  var guestsSelect = document.querySelector('.map__filter:nth-child(4)');
  var wifiInput = document.querySelector('#filter-wifi');
  var dishwasherInput = document.querySelector('#filter-dishwasher');
  var parkingInput = document.querySelector('#filter-parking');
  var washerInput = document.querySelector('#filter-washer');
  var elevatorInput = document.querySelector('#filter-elevator');
  var conditionerInput = document.querySelector('#filter-conditioner');

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

  var wifiToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('wifi') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };

  var dishwasherToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('dishwasher') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };

  var parkingToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('parking') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };

  var washerToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('washer') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };

  var elevatorToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('elevator') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };

  var conditionerToFilter = {
    true: function (ad) {
      return ad.offer.features.indexOf('conditioner') !== -1;
    },

    false: function (ad) {
      return ad;
    }
  };


  function updatePins() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      window.mapPins.removeChild(pins[i]);
    }

    var filteredData = window.ads.filter(typeToFilter[typeSelect.value]).filter(priceToFilter[priceSelect.value]).filter(roomsToFilter[roomsSelect.value]).filter(guestsToFilter[guestsSelect.value]).filter(wifiToFilter[wifiInput.checked]).filter(dishwasherToFilter[dishwasherInput.checked]).filter(parkingToFilter[parkingInput.checked]).filter(washerToFilter[washerInput.checked]).filter(elevatorToFilter[elevatorInput.checked]).filter(conditionerToFilter[conditionerInput.checked]);

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
  typeSelect.addEventListener('change', updatePins);
  priceSelect.addEventListener('change', updatePins);
  roomsSelect.addEventListener('change', updatePins);
  guestsSelect.addEventListener('change', updatePins);
  wifiInput.addEventListener('change', updatePins);
  dishwasherInput.addEventListener('change', updatePins);
  parkingInput.addEventListener('change', updatePins);
  washerInput.addEventListener('change', updatePins);
  elevatorInput.addEventListener('change', updatePins);
  conditionerInput.addEventListener('change', updatePins);

})();
