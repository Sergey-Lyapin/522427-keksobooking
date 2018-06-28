'use strict';

(function () {
  var timeInField = document.querySelector('#timein');
  var timeOutField = document.querySelector('#timeout');
  var apartmentTypeField = document.querySelector('#type');
  var priceField = document.querySelector('#price');
  var roomNumberField = document.querySelector('#room_number');
  var capacityField = document.querySelector('#capacity');

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

  apartmentTypeField.addEventListener('change', setMinimalPrice);
  capacityField.addEventListener('change', roomsGuestValidation);
  roomNumberField.addEventListener('change', roomsGuestValidation);
  timeInField.addEventListener('change', timeValidation);
  timeOutField.addEventListener('change', timeValidation);
})();
