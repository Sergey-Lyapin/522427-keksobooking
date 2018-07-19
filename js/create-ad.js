'use strict';

(function () {
  var ROOM_PHOTO_HEIGHT = 40;
  var ROOM_PHOTO_WIDTH = 45;

  window.createAd = function (adArrayElement) {
    var adTemplate = document.querySelector('template').content.querySelector('.map__card');
    var adElement = adTemplate.cloneNode(true);
    var adAvatar = adElement.querySelector('.popup__avatar');
    var closeAdButton = adElement.querySelector('.popup__close');

    adAvatar.src = adArrayElement.author.avatar;
    adAvatar.alt = adArrayElement.offer.title;

    adElement.querySelector('.popup__title').textContent = adArrayElement.offer.title;
    adElement.querySelector('.popup__text--address').textContent = adArrayElement.offer.address;
    adElement.querySelector('.popup__text--price').textContent = adArrayElement.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = window.translateType(adArrayElement.offer.type);
    adElement.querySelector('.popup__text--capacity').textContent = 'Для ' + adArrayElement.offer.guests + ' гостей в ' + adArrayElement.offer.rooms + ' комнатах';
    adElement.querySelector('.popup__text--time').textContent = 'заезд после ' + adArrayElement.offer.checkin + ', выезд до ' + adArrayElement.offer.checkout;
    window.removeChilds(adElement.querySelector('.popup__features'));
    adElement.querySelector('.popup__features').appendChild(generateIconsFeatures(adArrayElement.offer.features));
    adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;
    window.removeChilds(adElement.querySelector('.popup__photos'));
    adElement.querySelector('.popup__photos').appendChild(generatePopupPhotos(adArrayElement.offer.photos));
    adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;
    closeAdButton.addEventListener('click', window.closeAd);
    closeAdButton.addEventListener('keydown', window.onPopupCloseEnterPress);
    document.addEventListener('keydown', window.onPopupEscPress);

    return adElement;
  };

  function generateIconsFeatures(features) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < features.length; i++) {
      var featureElement = createIconFeature(features[i]);
      fragment.appendChild(featureElement);
    }

    return fragment;
  }

  function createIconFeature(feature) {
    var iconFeature = document.createElement('li');
    iconFeature.classList.add('popup__feature');
    iconFeature.classList.add('popup__feature--' + feature);

    return iconFeature;
  }

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
})();
