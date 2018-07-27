'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var photosFileChooser = document.querySelector('.ad-form__upload input[type=file]');

  var photosPreviewСontainer = document.querySelector('.ad-form__photo-container');

  photosFileChooser.addEventListener('change', function () {
    var file = photosFileChooser.files;

    for (var i = 0; i < file.length; i++) {
      var fileName = file[i].name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        if (i === 0) {
          var previewField = document.querySelector('.ad-form__photo');
          photosPreviewСontainer.removeChild(previewField);
        };


        var newPhotoDiv = document.createElement('div');
        newPhotoDiv.className = "ad-form__photo";
        var newPhotoImg = document.createElement('img');
        newPhotoImg.setAttribute('width', '70');
        newPhotoImg.setAttribute('height', '70');
        newPhotoDiv.appendChild(newPhotoImg);

        var reader = new FileReader();

        reader.addEventListener('load', function () {
          newPhotoImg.src = reader.result;
        });

        reader.readAsDataURL(file[i]);
      }

      photosPreviewСontainer.appendChild(newPhotoDiv);
    }

  });

})();
