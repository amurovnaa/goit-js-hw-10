import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import successIcon from '../img/success.svg';
import errorIcon from '../img/error.svg';

const form = document.querySelector('.form');

const makePromise = ({ delay, shouldResolve }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldResolve ? resolve() : reject();
    }, delay);
  });
};

const showPopup = option => {
  iziToast.show(option);
};

form.addEventListener('submit', event => {
  event.preventDefault();

  const userValue = Number(form.querySelector('input[name="delay"]').value);
  const selectedValue = form.querySelector('input[name="state"]:checked').value;
  const shouldResolve = selectedValue === 'fulfilled';
  const popupOption = {
    titleSize: '16px',
    messageSize: '16px',
    titleColor: '#fff',
    messageColor: '#fff',
    position: 'topRight',
    transitionIn: 'bounceInLeft',
    closeOnClick: true,
  };

  makePromise({ delay: userValue, shouldResolve })
    .then(() => {
      showPopup({
        ...popupOption,
        title: 'OK',
        message: `Fulfilled promise in ${userValue}ms`,
        color: '#59A10D',
        iconUrl: successIcon,
      });
    })
    .catch(() => {
      showPopup({
        ...popupOption,
        title: 'Error',
        message: `Rejected promise in ${userValue}ms`,
        color: '#EF4040',
        iconUrl: errorIcon,
      });
    });

  form.reset();
});
