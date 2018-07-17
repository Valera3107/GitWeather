'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const containerId = document.querySelector('#root');
  const gallery = document.createElement('div');
  gallery.classList.add('gallery-card');
  const arrOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let firstDay = 0;
  let currentStatus;
  let currentWeather;
  let dayOfWeek;
  let time;
  let img;
  let date = new Date();

  const searchBtn = document.querySelector('.submit-btn');
  const city = document.querySelector('.js-name');
  const quantity = document.querySelector('.js-quantity')
  const resetBtn = document.querySelector('.reset-js');

  resetBtn.addEventListener('click', clearContent);

  searchBtn.addEventListener('click', showWeather);

  function clearContent(event){
    event.preventDefault();
    
    const arrOfCards = document.querySelectorAll('.flip-container');
    arrOfCards.forEach(elem => elem.remove());
  }
      
  function showWeather(event){
    event.preventDefault();
  fetch(`http://api.apixu.com/v1/forecast.json?key=e14277516fdc45a1b6b113144183006&q=${city.value}&days=${quantity.value}`)
  .then(response => {
    if(response.ok) return response.json();

    throw new Error(`Error after fetch: ${response.statusText}`);
  })
  .then(data => {
    let currentDate = data.current.last_updated.split(" ");

    data.forecast.forecastday.forEach(day => {
      
      if(day.date === currentDate[0]) {
        currentStatus = data.current.condition.text;
        currentWeather = data.current.feelslike_c;
        firstDay = date.getDay()-1;
        dayOfWeek = arrOfWeek[date.getDay()-1];
      }
      else{
        firstDay+=1;
        if(firstDay === 7) {firstDay = 0};
        currentStatus = 'Soon';
        currentWeather = 'Soon';
        dayOfWeek = arrOfWeek[firstDay];
      }

      city.value = "";
      quantity.value = "";

        if(day.day.condition.text.includes('cloudy')){
          img = "url('https://images.unsplash.com/photo-1417392785671-e218e0fe4716?fit=crop&fm=jpg&h=950&q=80&w=1800')";
        }
        if(day.day.condition.text.includes('rain')){
          img = "url('https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&fm=jpg&w=1080&fit=max&s=0740e4c280d6376beb3d7ed85d83749c')";
        }
        if(day.day.condition.text.includes('sunny')){
          img = "url('https://images.unsplash.com/photo-1421091242698-34f6ad7fc088?fit=crop&fm=jpg&h=950&q=80&w=1600')";
        }
      
      time = showTime(date);
      makeCard(currentStatus, day.day.condition.icon, currentWeather,
      day.day.maxtemp_c, day.day.mintemp_c, day.date, 
      data.location.country, data.location.name, day.day.condition.text, dayOfWeek, img);
    })
  })
  .catch(error =>
   console.log(error));
  }


   function showTime(date){
    if(date.getHours() <= 9 && date.getMinutes() <= 9)  return `0${date.getHours()}:${date.getMinutes()}0`;

    if(date.getMinutes() <= 9)  return `${date.getHours()}:${date.getMinutes()}0`;

    if(date.getHours() <= 9)  return `0${date.getHours()}:${date.getMinutes()}`;

    return `${date.getHours()}:${date.getMinutes()}`;
   }


   function makeCard(status, icon, curWeather, max, min, dat, locCountry, locName, text, dayW){
      
      const flipContainer = document.createElement('div');
      flipContainer.setAttribute('ontouchstart', "this.classList.toggle('hover');");
      flipContainer.classList.add('flip-container');

      const flipper = document.createElement('div');
      flipper.classList.add('flipper');

      const front = document.createElement('div');
      front.classList.add('front');

      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');
      cardContainer.style.backgroundImage = img;

      const card = document.createElement('div');
      card.classList.add('card');

      const cardBlock = document.createElement('div');
      cardBlock.classList.add('card-block');

// ========================
      const cardTitle = document.createElement('div');
      cardTitle.classList.add('card-title');

      const statusItem = document.createElement('p');
      statusItem.textContent = status;
      statusItem.classList.add('status');

      const imageItem = document.createElement('img');
      imageItem.setAttribute('src', `http:${icon}`);
      imageItem.classList.add('image');

      const curWeatherItem = document.createElement('h1');
      curWeatherItem.classList.add('current-weather');
      curWeatherItem.textContent = `${curWeather}°`;;

      const weather = document.createElement('p');
      weather.classList.add('weather');
      weather.textContent = `${max}°/${min}°`; 

      cardTitle.append(statusItem, imageItem, curWeatherItem, weather);
// ==========================
      const cardText = document.createElement('div');
      cardText.classList.add('card-text');
      
      // const curTime = document.createElement('h4');
      // curTime.classList.add('last-update');
      // curTime.textContent = `Current time: ${t}`;

      const dateItem = document.createElement('h6');
      dateItem.classList.add('date');
      dateItem.textContent = `${dat}`;

      const locationItem = document.createElement('p');
      locationItem.textContent = `${locCountry}/${locName}`;
      locationItem.classList.add('location');

      const textInfo = document.createElement('p');
      textInfo.classList.add('text-info');
      textInfo.textContent = `About weather: ${text}`;

      cardText.append(dateItem, locationItem, textInfo);

      cardBlock.appendChild(cardTitle);
      cardBlock.appendChild(cardText);
// ============================
      const back = document.createElement('div');
      back.classList.add('back');
      back.style.backgroundImage = img;

      const dayItem = document.createElement('div');
      dayItem.classList.add('day');

      const textDay = document.createElement('p');
      textDay.textContent = `${dayW}`;
      textDay.classList.add('text-day');

      dayItem.appendChild(textDay);
      back.appendChild(dayItem);
// ============================

      cardContainer.appendChild(cardBlock);
      card.appendChild(cardContainer);
      front.appendChild(card);
      flipper.appendChild(front);
      flipper.appendChild(back);
      flipContainer.appendChild(flipper);
      gallery.appendChild(flipContainer);
      containerId.appendChild(gallery);
   }
});