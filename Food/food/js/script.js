'use strict';

window.addEventListener('DOMContentLoaded', () => {

  // =======================================================
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


  // =======================================================
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


  // =======================================================
  // Modal

  /*
    Алгоритм реализации:
    1) Вешаем дата-атибуты на тригеры (кнопки, вызывающие модальное окно)
    и кнопкузакрытия окна
    2) 
  */

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    clearTimeout(modalTimerId);
  }

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modal.addEventListener('click', (e) => {
    const target = e.target;

    if (target && (target == modal || e.target.getAttribute('data-close') == '')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);


  // =======================================================
  // Cards menu
  // Применение классов на практике

  /* 
    
  */

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) { // ...classes (rest оператор)
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);

      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.className = 'menu__item';
        element.classList.add(this.className);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
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

  // Формирование карточек из json файла db.json
  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // 1) Формирование ферстки при помощи классов
  // getResource('http://localhost:3000/menu')
  //   .then(data => {
  //     data.forEach(({ img, altimg, title, descr, price }) => {
  //       new MenuCard(img, altimg, title, descr, price, '.menu__field .container').render();
  //     });
  //   });

  // 2) Формирование верстки на лету (но лишаемся шаблонизации)
  getResource('http://localhost:3000/menu')
    .then(data => createCard(data));

  function createCard(data) {
    data.forEach(({ img, altimg, title, descr, price }) => {
      const element = document.createElement('div');
      element.classList.add('menu__item');

      price *= 27;

      element.innerHTML = `
        <img src=${img} alt=${altimg}>
        <h3 class="menu__item-subtitle">${title}</h3>
        <div class="menu__item-descr">${descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${price}</span> грн/день</div>
        </div>
      `;

      document.querySelector('.menu .container').append(element);
    });
  }

  // 3) Библиотека Axios + Классы
  // axios.get('http://localhost:3000/menu')
  //   .then(data => {
  //     data.data.forEach(({ img, altimg, title, descr, price }) => {
  //       new MenuCard(img, altimg, title, descr, price, '.menu__field .container').render();
  //     });
  //   });


  // 4) Формирование карточек обычным способом
  // Нарушаем правило "Не повторяйся"
  // new MenuCard(
  //   "img/tabs/vegy.jpg",
  //   "vegy",
  //   'Меню "Фитнес"',
  //   'Меню "Фитнес" — это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
  //   9,
  //   '.menu__field .container',
  //   // 'menu__item', // вдруг забыли указать класс
  // ).render();
  
  // new MenuCard(
  //   "img/tabs/elite.jpg",
  //   "elite",
  //   'Меню "Премиум"',
  //   'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
  //   20,
  //   '.menu__field .container',
  //   'menu__item'
  // ).render();

  // new MenuCard(
  //   "img/tabs/post.jpg",
  //   "post",
  //   'Меню "Постное"',
  //   'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
  //   15,
  //   '.menu__field .container',
  //   'menu__item'
  // ).render();


  // =======================================================
  // forms
  // Отправка данных на сервер

  const forms = document.querySelectorAll('form');

  const message = {
    loading: "img/form/spinner.svg",
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => bindPostData(item));

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-type': 'application/json'
      }
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);
      
      // ============================
      // XMLHttpRerquest

      // const request = new XMLHttpRequest();
      // request.open('POST', 'server.php');
      
      // // 1) Вариант без JSON
      // // START
      // // const formData = new FormData(form);
      // // request.send(formData);
      // // END

      // // 2) Вариант с JSON
      // // (PHP должен декодировать объект JSON, так как он не умеет с ним работать)
      // // START
      // request.setRequestHeader('content-type', 'application/json');
      // const formData = new FormData(form);

      // const object = {};

      // formData.forEach((value, key) => {
      //   object[key] = value;
      // });

      // const json = JSON.stringify(object);
      
      // request.send(json);
      // // END

      // request.addEventListener('load', () => {
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     showThanksModal(message.success);
      //     form.reset();
      //     statusMessage.remove();
      //   } else {
      //     showThanksModal(message.failure);
      //   }
      // });

      // ============================
      // Fetch

      const formData = new FormData(form);
      // ================
      // formData
      // START
      // fetch('server.php', {
      //   method: 'POST',
      //   body: formData
      // })
      // .then((data) => {
      //   return data.text();
      // })
      // .then(data => {
      //   console.log(data);
      //   showThanksModal(message.success);
      //   statusMessage.remove();
      // })
      // .catch(() => {
      //   showThanksModal(message.failure);
      // })
      // .finally(() => {
      //   form.reset();
      // });
      // START

      // ================
      // JSON
      // START

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showThanksModal(message.success);
        statusMessage.remove();
      })
      .catch(() => {
        showThanksModal(message.failure);
      })
      .finally(() => {
        form.reset();
      });
      // END
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;
    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  // =======================================================
  // Slider

  // ===============
  // Вариант 1
  /*
    Получаем все элементы, с которыми будем работать
    Создать индекс, определяющий текущий слайд
    Написать функцию показа слайда, она принимает индекс:
      Внутри нее сделать проверку на пограничные случаи индеса слайда
      Пройтись циклом по всем слайдам, скрыть все
      Слайд с текущим индексом показать
    Написать функцию, вызывающуюся при клике на стрелки, она будет принимать число
    показывающее сколько слайдов переключать за 1 клик
      Внутри нее вызывать функцию показа слайдов, ей передается индекс + или - число
  */

  // const slides = document.querySelectorAll('.offer__slide'),
  //   prev = document.querySelector('.offer__slider-prev'),
  //   next = document.querySelector('.offer__slider-next'),
  //   total = document.querySelector('#total'),
  //   current = document.querySelector('#current');

  // let slideIndex = 1;

  // showSlides(slideIndex);

  // total.textContent = (slides.length < 10) ? `0${slides.length}` : slides.length;

  // function showSlides(n) {
  //   if (n > slides.length) {
  //     slideIndex = 1;
  //   }

  //   if (n < 1) {
  //     slideIndex = slides.length;
  //   }

  //   slides.forEach(item => item.classList.add('hide'));
  //   slides[slideIndex - 1].classList.remove('hide');
  //   slides[slideIndex - 1].classList.add('show');

  //   current.textContent = (slideIndex < 10) ? `0${slideIndex}` : slideIndex;
  // }

  // function plusSlides(n) {
  //   showSlides(slideIndex += n);
  // }

  // prev.addEventListener('click', () => plusSlides(-1));
  // next.addEventListener('click', () => plusSlides(1));

  // ===============
  // Вариант 2 (карусель)
  /* 
    Обертке всего сладера задать свойство overflow: hidden
      Это значит что все, что не подходит под ширину блока,
      оно будет скрыто и невидимо для обычного пользователя.
    Создадим обертку для слайдов
      Соответственно, этот блок, который оборачивает все слайды,
      займет столько место, сколько слайдов в ширину.
    При клике вперед/назад мы будем не скрывать/показывать слайды,
    а передвигать по отношению к главной обертке слайда,
    при помощи свойства transform к обертке слайдов.
  */

  const slider = document.querySelector('.offer__slider'),
    slidesWrapper = slider.querySelector('.offer__slider-wrapper'),
    slidesField = slider.querySelector('.offer__slider-inner'),
    slides = slider.querySelectorAll('.offer__slide'),
    prev = slider.querySelector('.offer__slider-prev'),
    next = slider.querySelector('.offer__slider-next'),
    total = slider.querySelector('#total'),
    current = slider.querySelector('#current');

  // Установим индекс активного слайда
  let slideIndex = 1;

  // Зададим переменную с отступом, для передвижения слайдеров
  // чтобы знать, на сколько отступили в право/влево
  let offset = 0;

  // Установим ширину главной обертки слайдера
  const widthWrapper = getComputedStyle(slidesWrapper).width;

  // Для показа индесов сладов и их общего кол-ва
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
  } else {
    total.textContent = slides.length;
  }

  if (slideIndex < 10) {
    current.textContent = `0${slideIndex}`;
  } else {
    current.textContent = slideIndex;
  }

  // Вычислим ширину обертки слайдов
  slidesField.style.width = 100 * slides.length + '%';

  // Выставим блоки слады в строку при помощи флексов (это делается в стилях!!!)
  slidesField.style.display = 'flex';
  slidesField.style.transition = 'all .5s ease';
  // Зададим главной обертке слайдера свойство owerflow: hidden (это делается в стилях!!!)
  slidesWrapper.style.overflow = 'hidden';

  // Устонавливаем каждому слайду одинаковую ширину
  slides.forEach(slide => {
    slide.style.width = widthWrapper;
  });

  // dots
  // Позиционируем слайдер
  slider.style.position = 'relative';

  // Создаем обертку для точек
  const dots = document.createElement('ol'),
    dotsArr = [];

  dots.classList.add('carousel-dots');
  slider.append(dots);

  // При помощи цикла создаем точки с атрибутами и классом,
  // аппендим их в dots обертку
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-toggle', i + 1);
    dot.classList.add('dot');
    if (dot.dataset.slideToggle == slideIndex) {
      dot.classList.add('active');
    }
    dots.append(dot);
    dotsArr.push(dot);
  }

  function makeDotActive() {
    dotsArr.forEach(dot => dot.classList.remove('active'));
    dotsArr[slideIndex - 1].classList.add('active');
  }

  function showCurrentIndexSlide() {
    if (slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  // Клики по кнопке влево
  prev.addEventListener('click', () => {
    // Предусмотрим бесконечный вариант передвижения слайдов
    if (offset === 0) {
      offset = +widthWrapper.slice(0, widthWrapper.length - 2) * (slides.length - 1);
    } else {
      offset -= +widthWrapper.slice(0, widthWrapper.length - 2);
    }

    // Когда нажимаем кнопку, нужно сдвинуть слайд вперед
    slidesField.style.transform = `translateX(-${offset}px)`;

    // Работа с щетчиком
    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    showCurrentIndexSlide();
    makeDotActive();
  });

  // Клики по кнопке вправо
  next.addEventListener('click', () => {
    // Предусмотрим бесконечный вариант передвижения слайдов
    if (offset === +widthWrapper.slice(0, widthWrapper.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +widthWrapper.slice(0, widthWrapper.length - 2);
    }

    // Когда нажимаем кнопку, нужно сдвинуть слайд вперед
    slidesField.style.transform = `translateX(-${offset}px)`;

    // Работа с щетчиком
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    showCurrentIndexSlide();
    makeDotActive();
  });

  // Клики по точкам
  dotsArr.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-toggle');

      slideIndex = slideTo;
      offset = +widthWrapper.slice(0, widthWrapper.length - 2) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      showCurrentIndexSlide();
      makeDotActive();
    });
  });

});
