import { closeModal } from './util.js';
import { sendData } from './api.js';
import { pristine }from './validator.js';
import { stack } from './main.js';

const form = document.querySelector('.img-upload__form');

const imgOverlay = form.querySelector('.img-upload__overlay');
const closeBtn = imgOverlay.querySelector('.cancel');
const hashtagInput = imgOverlay.querySelector('.text__hashtags');
const textarea = imgOverlay.querySelector('.text__description');
const mainPicture = imgOverlay.querySelector('.img-upload__preview img');
const sliderElement = imgOverlay.querySelector('.img-upload__effect-level');
const radios = imgOverlay.querySelectorAll('.effects__radio');
const scaleValue = document.querySelector('.scale__control--value');

const templateSuccess = document.querySelector('#success').content.querySelector('.success');
const templateError = document.querySelector('#error').content.querySelector('.error');

const clearForm = () => {
  hashtagInput.value = '';
  textarea.value = '';

  radios.forEach((radio) => {
    radio.checked = false;
  });

  radios[0].checked = true;

  sliderElement.classList.add('hidden');
  mainPicture.style.filter = 'grayscale(0)';

  scaleValue.value = '100%';
  mainPicture.style.transform = 'scale(1)';
};

const onDocumentKeydownEscape = (evt) => {
  if (evt.code === 'Escape') {
    if (evt.target === hashtagInput || evt.target === textarea) {
      return;
    }

    clearForm();
    pristine.reset(hashtagInput);
    closeModal(imgOverlay);
    document.removeEventListener('keydown', onDocumentKeydownEscape);
  }
};

form.addEventListener('change', () => {
  imgOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  stack.push(imgOverlay);
  document.addEventListener('keydown', onDocumentKeydownEscape);
});

const closeForm = () => {
  clearForm();
  pristine.reset(hashtagInput);
  closeModal(imgOverlay);
};

closeBtn.addEventListener('click', closeForm);

const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    templateSuccess.classList.remove('hidden');
    templateError.classList.remove('hidden');

    const isValid = pristine.validate(hashtagInput);

    if (isValid) {
      sendData(
        onSuccess,
        new FormData(evt.target)
      );
    }
  });
};

setUserFormSubmit(closeForm);
