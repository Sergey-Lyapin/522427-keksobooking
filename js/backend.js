'use strict';


window.backend = (function () {
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';

  return {
    load: function (onLoad, onError) {
      
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', DOWNLOAD_URL);

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка, попробуйте снова');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 15000;

      xhr.send();
    },

    save: function (data, onLoad, onError) {

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onLoad();
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка отправки формы, попробуйте снова');
      });

      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
