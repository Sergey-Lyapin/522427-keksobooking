'use strict';

(function () {

  window.form = {
    timeInField: document.querySelector('#timein'),
    timeOutField: document.querySelector('#timeout'),
    apartmentTypeField: document.querySelector('#type'),
    roomNumberField: document.querySelector('#room_number'),
    capacityField: document.querySelector('#capacity'),
    successPopup: document.querySelector('.success'),
    formResetButton: document.querySelector('.ad-form__reset'),
    typeSelect: document.querySelector('#housing-type'),
    priceSelect: document.querySelector('#housing-price'),
    roomsSelect: document.querySelector('#housing-rooms'),
    guestsSelect: document.querySelector('#housing-guests'),
    featuresFieldset: document.querySelector('#housing-features'),

    updatePins: function () {
      var popup = window.map.tokioMap.querySelector('.popup');

      if (popup) {
        window.map.tokioMap.removeChild(popup);
      }

      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      pins.forEach(function (item) {
        window.map.mapPins.removeChild(item);
      });

      var filteredData = window.ads.filter(TypeToFilter[window.form.typeSelect.value]).filter(PriceToFilter[window.form.priceSelect.value]).filter(RoomsToFilter[window.form.roomsSelect.value]).filter(GuestsToFilter[window.form.guestsSelect.value]).filter(filterFeatures);

      window.map.insertPin(filteredData);
    },

    roomsGuestValidate: function () {

      if ((window.form.roomNumberField.value === '1') && (window.form.capacityField.value !== '1')) {
        window.form.capacityField.setCustomValidity('В одной комнате может поселиться только один гость.');
      } else {

        if ((window.form.roomNumberField.value === '2') && (window.form.capacityField.value !== '1') && (window.form.capacityField.value !== '2')) {
          window.form.capacityField.setCustomValidity('В двух комнатах не может поселиться более 2 гостей.');
        } else {

          if ((window.form.roomNumberField.value === '3') && (window.form.capacityField.value !== '1') && (window.form.capacityField.value !== '2') && (window.form.capacityField.value !== '3')) {

            window.form.capacityField.setCustomValidity('В трех комнатах не может поселиться более 3 гостей.');

          } else {

            if ((window.form.roomNumberField.value === '100') && (window.form.capacityField.value !== '0')) {
              window.form.capacityField.setCustomValidity('Сто комнат предназначены не для гостей!');
            } else {
              window.form.capacityField.setCustomValidity('');
            }
          }
        }
      }
    },

    setMinimalPrice: function () {
      priceField.min = TypePriceDependency[window.form.apartmentTypeField.value];
      priceField.placeholder = TypePriceDependency[window.form.apartmentTypeField.value];
    },

    syncTimeOut: function () {
      window.form.timeInField.value = window.form.timeOutField.value;
    },

    syncTimeIn: function () {
      window.form.timeOutField.value = window.form.timeInField.value;
    },

    onReset: function () {
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
        window.map.tokioMap.removeChild(ad);
      }

      window.map.pinMain.style.left = window.map.PIN_MAIN_X + 'px';
      window.map.pinMain.style.top = window.map.PIN_MAIN_Y + 'px';
      window.map.inputAddress.setAttribute('value', (window.map.PIN_MAIN_X + window.map.PIN_MAIN_WIDTH / 2) + ', ' + (window.map.PIN_MAIN_Y + window.map.PIN_MAIN_HEIGHT - window.map.PIN_POINT_GAP));

      window.map.formFieldsets.forEach(function (item) {
        item.setAttribute('disabled', 'disabled');
      });

      window.map.formSelects.forEach(function (item) {
        item.setAttribute('disabled', 'disabled');
      });

      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (item) {
        window.map.mapPins.removeChild(item);
      });

      var featuresInputs = document.querySelectorAll('.features input');
      featuresInputs.forEach(function (item) {
        item.checked = false;
      });

      window.map.tokioMap.classList.add('map--faded');
      window.map.adForm.classList.add('ad-form--disabled');
      window.form.isAppActivated = false;
      window.map.adForm.removeEventListener('submit', window.form.onFormSubmit);
      window.form.formResetButton.removeEventListener('click', window.form.onReset);
      window.form.timeInField.removeEventListener('change', window.form.syncTimeIn);
      window.form.timeOutField.removeEventListener('change', window.form.syncTimeOut);
      window.form.apartmentTypeField.removeEventListener('change', window.form.setMinimalPrice);
      window.form.capacityField.removeEventListener('change', window.form.roomsGuestValidate);
      window.form.roomNumberField.removeEventListener('change', window.form.roomsGuestValidate);
      window.form.typeSelect.removeEventListener('change', window.debounce(window.form.updatePins));
      window.form.priceSelect.removeEventListener('change', window.debounce(window.form.updatePins));
      window.form.roomsSelect.removeEventListener('change', window.debounce(window.form.updatePins));
      window.form.guestsSelect.removeEventListener('change', window.debounce(window.form.updatePins));
      window.form.featuresFieldset.removeEventListener('change', window.debounce(window.form.updatePins));
    },

    onSuccessEscPress: function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        window.form.successPopup.classList.add('hidden');
        document.removeEventListener('keydown', window.form.onSuccessEscPress);
        window.form.successPopup.removeEventListener('click', window.form.onSuccessPopupClick);
      }
    },

    onSuccessPopupClick: function () {
      window.form.successPopup.classList.add('hidden');
      document.removeEventListener('keydown', window.form.onSuccessEscPress);
      window.form.successPopup.removeEventListener('click', window.form.onSuccessPopupClick);
    },

    onFormSubmit: function (evt) {
      window.backend.save(new FormData(window.map.adForm), window.form.onReset, window.map.onError);
      window.form.successPopup.classList.remove('hidden');
      evt.preventDefault();
    }
  };

  var priceField = document.querySelector('#price');
  var titleField = document.querySelector('#title');
  var descriptionField = document.querySelector('#description');
  var typeFormSelect = document.querySelector('#type');
  var roomsFormSelect = document.querySelector('#room_number');
  var guestsFormSelect = document.querySelector('#capacity');
  var timeinFormSelect = document.querySelector('#timein');
  var timeoutFormSelect = document.querySelector('#timeout');


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

  window.form.roomsGuestValidate();
  window.form.setMinimalPrice();

})();
