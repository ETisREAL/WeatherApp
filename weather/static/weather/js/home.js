
const insideContainer = document.getElementById('inside-container')
let outsideContainerWidth = document.getElementById('outside-container').offsetWidth
window.onresize = () => {return outsideContainerWidth = document.getElementById('outside-container').offsetWidth}

const slideBtn = document.querySelector('#slide-button')
const nextBtn = document.querySelector('#next-slide')

let network = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
let images = document.getElementsByTagName('img')

let linkedData = document.currentScript.dataset
let array = linkedData.pages.split(' ')
let num_pages = parseInt(array[1])

let pageCount = 2;


const getDate = (locationTime, timezone) => {
  const date = new Date((locationTime*1000) + 1000 * timezone).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}) ;
  const completeDate = `${date}\n${getTime(locationTime, timezone)}`
  return completeDate
}

const getTime = (locationTime, timezone) => {
  const time = new Date((locationTime*1000) + 1000 * timezone)
  const hours = time.getHours()
  let minutes = time.getMinutes()
  if (minutes < 10) {minutes =`0${minutes}`}
  return `${hours}:${minutes}`
}


/* VIEW */


const renderSlide = (data, imageUrl) => {

  const itemsDiv = document.createElement('div')

  itemsDiv.classList.add('items')

  itemsDiv.innerHTML = 
  `
    <div class="data-div">
      <ul>
        <li><b>${data.location.city}</b> </li>
        <li class="weather">${data.weather.description}</li>
        <img src="${data.weather.icon}" alt="${data.weather.main}">
        <li>${data.main.temperature}</li>
        <li>${getDate(data.location.time, data.location.timezone)}</li>
      </ul>
    </div>
    <img class="carousel-img" src="${imageUrl}" alt="No image found">
  `

  insideContainer.append(itemsDiv)
}
//window.onload = renderSlide(data, cityImageUrl)


slideBtn.addEventListener('click', () => {

  let firstRoll = false;

  insideContainer.classList.toggle('animate')
  insideContainer.style.transform = `translateX(-${outsideContainerWidth}px)`

  insideContainer.addEventListener('transitionend', e => {
    if (e.propertyName === 'transform') {
      if (firstRoll===true) return
      insideContainer.classList.remove('animate');
      insideContainer.style.transform = 'translateX(0px)';
      insideContainer.firstElementChild.remove();
      firstRoll = true
    }
  })
})


/*  Console */

const httpGet = URL => {

  let xmlHttp = new XMLHttpRequest();

  xmlHttp.open( 'GET', URL , true );
  xmlHttp.responseType = 'document';

  xmlHttp.send();

  xmlHttp.onload = function() {
    if(this.status == 200){
      insideContainer.append(this.responseXML.querySelector('.items'))
      checkImageLoad()
    }
  };

  xmlHttp.onerror = (error) => {
      console.log(error)
  };
};



nextBtn.addEventListener('click' , function(e) {

  this.href = `?page=${pageCount}`;
  httpGet(this.href)

  e.preventDefault();

  setTimeout(() => {
      pageCount++;
  }, 100);
});


const checkImageLoad = () => {

  if (pageCount === num_pages) {pageCount = 1; checkImageLoad()}

  let lastCarouselImage = images[Object.keys(images)[Object.keys(images).length - 1]]
  
  lastCarouselImage.onerror = (e) => {return}
  
  lastCarouselImage.onload = () => {
    if (network.effectiveType == '2g') {
      setTimeout(() => {
        nextBtn.click()
        slideBtn.click()
      }, 100);
    } else if (network.effectiveType == '3g') {
      setTimeout(() => {
        nextBtn.click()
        slideBtn.click()
      }, 5000);
    } else {
      setTimeout(() => {
        nextBtn.click()
        slideBtn.click()
      }, 6000);
    }
  }
}


images[1].onload = nextBtn.click()
//images[1].onload = slideBtn.click()


const nextSlidePromise = () => {
  return new Promise(resolve => {
    resolve(nextBtn.click())
  })
}

const slideLeftPromise = () => {
  return new Promise(resolve => {
    resolve(slideBtn.click())
  })
}