'use strict';

(function () {
  function createAd(adArrayElement) {
    var adElement = adTemplate.cloneNode(true);
    var adAvatar = adElement.querySelector('.popup__avatar');
    var closeAdButton = adElement.querySelector('.popup__close');

    adAvatar.src = adArrayElement.author.avatar;
    adAvatar.alt = adArrayElement.offer.title;

    adElement.querySelector('.popup__title').textContent = adArrayElement.offer.title;
    adElement.querySelector('.popup__text--address').textContent = adArrayElement.offer.address;
    adElement.querySelector('.popup__text--price').textContent = adArrayElement.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = window.util.translateType(adArrayElement.offer.type);
    adElement.querySelector('.popup__text--capacity').textContent = 'Для ' + adArrayElement.offer.guests + ' гостей в ' + adArrayElement.offer.rooms + ' комнатах';
    adElement.querySelector('.popup__text--time').textContent = 'заезд после ' + adArrayElement.offer.checkin + ', выезд до ' + adArrayElement.offer.checkout;
    window.util.removeChilds(adElement.querySelector('.popup__features'));
    adElement.querySelector('.popup__features').appendChild(generateIconsFeatures(adArrayElement.offer.features));
    adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;
    window.util.removeChilds(adElement.querySelector('.popup__photos'));
    adElement.querySelector('.popup__photos').appendChild(generatePopupPhotos(adArrayElement.offer.photos));
    adElement.querySelector('.popup__description').textContent = adArrayElement.offer.description;
    closeAdButton.addEventListener('click', closeAd);
    closeAdButton.addEventListener('keydown', onPopupCloseEnterPress);
    document.addEventListener('keydown', onPopupEscPress);

    return adElement;
  }
})();
