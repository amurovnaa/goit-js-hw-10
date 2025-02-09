import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import successIcon from '../img/success.svg';
import errorIcon from '../img/error.svg';

const startButton = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
let userTime = '';
const timerObj = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userTime = selectedDates[0].getTime();
    if (userTime < Date.now()) {
      iziToast.show({
        ...iziToastOptions,
        title: 'Error',
        message: 'Please choose a date in the future',
        color: '#EF4040',
        iconUrl: errorIcon,
      });
      startButton.setAttribute('disabled', true);
    } else {
      startButton.removeAttribute('disabled');
    }
  },
};
flatpickr('#datetime-picker', options);

const iziToastOptions = {
  titleColor: '#fff',
  titleSize: '16px',
  messageColor: '#fff',
  messageSize: '16px',
  position: 'topRight',
  transitionIn: 'bounceInLeft',
  closeOnClick: true,
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(timer) {
  return Object.entries(timer).reduce((acc, [key, value]) => {
    let str = value.toString();
    acc[key] = str.length !== 2 ? str.padStart(2, '0') : str;
    return acc;
  }, {});
}

function setTimer(timer, htmlObj) {
  Object.keys(htmlObj).forEach(key => {
    htmlObj[key].textContent = timer[key];
  });
}

startButton.addEventListener('click', () => {
  let intervalID = startTimer();
  function startTimer() {
    return setInterval(() => {
      let timer = convertMs(userTime - Date.now());
      if (userTime - Date.now() <= 0) {
        clearInterval(intervalID);
        iziToast.show({
          message: 'Time came out! Choose a new timer',
          color: '#03a14d',
          titleColor: '#fff',
          titleSize: '16px',
          messageColor: '#fff',
          messageSize: '16px',
          iconUrl: successIcon,
          position: 'topRight',
          transitionIn: 'bounceInLeft',
          closeOnClick: true,
        });
        input.removeAttribute('disabled');
        return;
      }
      let formatedTimer = addLeadingZero(timer);
      setTimer(formatedTimer, timerObj);
      startButton.setAttribute('disabled', true);
      input.setAttribute('disabled', true);
    }, 1000);
  }
});
