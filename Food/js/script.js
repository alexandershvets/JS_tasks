'use strict';

window.addEventListener('DOMContentLoaded', () => {

  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function chowTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');

    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  chowTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          chowTabContent(i);
        }
      });
    }
  });


  // Timer
  /* 
    Алгоритм реализации:
    1) Должна быть функция, которая устанавливает таймер
    2) Функционал определяющий разницу во времени, между
      - дедлайн
      - время у пользователя
    3) Функция обновления таймера
  */

  const deadLine = '2020-12-31';

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timerInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timerInterval);
      }
    }
  }

  setClock('.timer', deadLine);


  // Modal

  /*
    Алгоритм реализации:
    1) Вешаем дата-атибуты на тригеры (кнопки, вызывающие модальное окно)
    и кнопкузакрытия окна
    2) 
  */

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal'),
    modalCloseBtn = document.querySelector('[data-close]');

  function openModal() {
    modal.classList.toggle('show');
    document.body.style.overflow = 'hidden';

    clearTimeout(modalTimerId);
  }

  function closeModal() {
    modal.classList.toggle('show');
    document.body.style.overflow = '';
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    const target = e.target;

    if (target && target == modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // const modalTimerId = setTimeout(openModal, 15000);

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);


  // Cards menu
  // Применение классов на практике

  /* 
    
  */

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);

      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement('div');
      element.classList.add('menu__item');
      element.innerHTML = `
        <img src=${this.src} alt=${this.src}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(element);
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" — это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    '.menu__field .container'
  ).render();
  
  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню "Премиум"',
    'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    20,
    '.menu__field .container'
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    15,
    '.menu__field .container'
  ).render();
  
});
