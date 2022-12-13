// window.addEventListener('load', () => {
//  const script = document.createElement('script');
//  script.src = 'forecast.js';
//  document.body.appendChild(script)
// })


const filterDropdown = document.querySelector('.filter-dropdown')
const dropdownSelection = document.querySelector('.dropdown-selection')
const dropdownBtn = document.querySelector('[data-dropdown-btn]')
const filters = document.querySelectorAll('.filters')

dropdownBtn.addEventListener('click', e => {
    e.preventDefault()
    filterDropdown.classList.toggle('active')
})

dropdownSelection.addEventListener('input', e => {
  
  const HTMLElement = document.getElementById(`${e.target.name}`)
  
  HTMLElement.classList.contains('visible') ? 
  HTMLElement.classList.remove('visible')
  :
  HTMLElement.classList.add('visible')
})


/* AUTOSEARCH */

const autocompleteInput = document.getElementById('autocomplete-input')
const hiddenInput = document.getElementById('hidden-input')
const containerElement = document.querySelector('#autocomplete-container')
const clearButton = document.querySelector('.clear-button')
const resultsElement = document.querySelector('.results')

/* Active request promise reject function. To be able to cancel the promise when a new request comes */
let currentPromiseReject;
let currentItems;

/* Helper functions */

clearButton.addEventListener("click", (e) => {
  e.stopPropagation();
  autocompleteInput.value = '';
  clearButton.classList.remove("visible");
  closeDropDownList();
})

function closeDropDownList() {
  const autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
  if (autocompleteItemsElement) {
    containerElement.removeChild(autocompleteItemsElement);
  }
}


autocompleteInput.addEventListener('input', async function() {
  let currentLetter = this.value

  /* VIEWS RELATED */
  closeDropDownList();
  clearButton.classList.add("visible");


  /* LOGIC RELATED */
  if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }
  
  if (!currentLetter) {
    return false;
  }

  /* REQUEST */
  const API_key = '4ca5b8a5fcb147a4bd4f223a0158373e'
  let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentLetter)}&limit=5&apiKey=${API_key}&type=city`;

  try {
    let currentResponse = await fetch(url) 
    let data = await currentResponse.json()
  
    // render previsions
    let previsions = await data.features
    const autocompleteItemsElement = document.createElement("div");
      autocompleteItemsElement.setAttribute("class", "autocomplete-items");
      containerElement.appendChild(autocompleteItemsElement);
  
      data.features.forEach((feature, index) => {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = feature.properties.city+', '+feature.properties.state+', '+feature.properties.country;
        autocompleteItemsElement.appendChild(itemElement);
        
        itemElement.addEventListener("click", function(e) {
          autocompleteInput.value = previsions[index].properties.city+', '+previsions[index].properties.state+', '+previsions[index].properties.country;
          hiddenInput.value = previsions[index].properties.lat+' '+previsions[index].properties.lon;
          closeDropDownList();
        });
      });
  } catch (error) {
    const errorMessage = document.createElement('h3');
    errorMessage.setAttribute('class', 'error-message');
    containerElement.appendChild(errorMessage);
  }
})

document.addEventListener("click", function(e) {
  if (e.target !== autocompleteInput) {
    closeDropDownList();
  } else if (!containerElement.querySelector(".autocomplete-items")) {

    var event = new Event('input', {'bubbles': true, 'cancelable': true});
    autocompleteInput.dispatchEvent(event);
  }
});


/* WEATHER DATA */


let linkedData = document.currentScript.dataset

if (linkedData.weather) window.onload = renderWeather()


async function renderWeather() {

  let weather_json = await JSON.parse(linkedData.weather)
  let forecast_json = await JSON.parse(linkedData.forecast)
  renderCurrentWeather(weather_json)
  setTimeout(renderForecast(forecast_json), 1000)
}


const getDate = (options, locationTime, timezone) => {
  if (options === 'date') {
    const date = new Date((locationTime*1000) + 1000 * timezone).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) ;
    const completeDate = `${date}\n${getTime(locationTime, timezone)}`
    return completeDate
  } else if (options === 'day') {
    return new Date((locationTime*1000) + 1000 * timezone).toLocaleDateString('en-us', { weekday:"short" }) ;
  }
}

const getTime = (locationTime, timezone) => {
  const time = new Date((locationTime*1000) + 1000 * timezone)
  const hours = time.getHours()
  let minutes = time.getMinutes()
  if (minutes < 10) {minutes =`0${minutes}`}
  return `${hours}:${minutes}`
}


const renderCurrentWeather = json => {

  if (linkedData.units === 'metric') {
    document.getElementById('location-title').textContent = `${json.name} - ${json.sys.country}`
    document.getElementById('time').textContent = getDate('date', json.dt, json.timezone)
    document.getElementById('timezone').innerHTML += `<br> ${json.timezone/3600} hours UTC`
    document.getElementById('sunrise-sunset').innerHTML += `<br> Sunrise ${getTime(json.sys.sunrise, json.timezone)} — Sunset ${getTime(json.sys.sunset, json.timezone)}`
    document.getElementById('coords').innerHTML += `<br> lat: ${json.coord.lat} — lon: ${json.coord.lon}`

    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${json.weather[0]['icon']}@2x.png`
    document.getElementById('weather-description').textContent = json.weather[0]['description']
    document.getElementById('weather-description').classList.add('capitalize')
    document.getElementById('temperature').innerHTML += `<br>${json.main.temp}°C`
    document.getElementById('temp-perceived').innerHTML += `<br>${json.main.feels_like}°C`
    document.getElementById('temp-min-max').innerHTML += `<br> ${json.main.temp_min}°C / ${json.main.temp_max}°C`

    document.getElementById('pressure').innerHTML += `<br>${json.main.pressure}Pa`
    document.getElementById('humidity').innerHTML += `<br>${json.main.humidity}`
    document.getElementById('visibility').innerHTML += `<br>${json.visibility/1000}km`
  } else {
    document.getElementById('location-title').textContent = `${json.name} - ${json.sys.country}`
    document.getElementById('time').textContent = getDate('date', json.dt, json.timezone)
    document.getElementById('timezone').innerHTML += `<br> ${json.timezone/3600} hours UTC`
    document.getElementById('sunrise-sunset').innerHTML += `<br> Sunrise ${getTime(json.sys.sunrise, json.timezone)} — Sunset ${getTime(json.sys.sunset, json.timezone)}`
    document.getElementById('coords').innerHTML += `<br> lat: ${json.coord.lat} — lon: ${json.coord.lon}`

    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${json.weather[0]['icon']}@2x.png`
    document.getElementById('weather-description').textContent = json.weather[0]['description']
    document.getElementById('weather-description').classList.add('capitalize')
    document.getElementById('temperature').innerHTML += `<br>${json.main.temp}°F`
    document.getElementById('temp-perceived').innerHTML += `<br>${json.main.feels_like}°F`
    document.getElementById('temp-min-max').innerHTML += `<br> ${json.main.temp_min}°F / ${json.main.temp_max}°F`

    document.getElementById('pressure').innerHTML += `<br>${json.main.pressure}PSI`
    document.getElementById('humidity').innerHTML += `<br>${json.main.humidity}`
    document.getElementById('visibility').innerHTML += `<br>${json.visibility/1000}mi`
  }
}

const renderForecast = json => {
  json.forEach(element => {

    if (linkedData.units === 'metric') {
      const slot = document.createElement('div')

      slot.classList.add('slot')

      slot.innerHTML = 
      `
      <p>${getDate('day', element.date, element.timezone)}</p>
      <p>${getTime(element.date, element.timezone)}</p>
      <img src="${element.icon}">
      <p>${element.weather}</p>
      <p>${element.temperature}°C</p>  
      `

      document.querySelector('.forecast').lastElementChild.append(slot)
    } else {
      const slot = document.createElement('div')
  
      slot.classList.add('slot')
  
      slot.innerHTML = 
      `
      <p>${getDate('day', element.date, element.timezone)}</p>
      <p>${getTime(element.date, element.timezone)}</p>
      <img src="${element.icon}">
      <p>${element.weather}</p>
      <p>${element.temperature}°F</p>  
      `
  
      document.querySelector('.forecast').lastElementChild.append(slot)
    }

  })
}

