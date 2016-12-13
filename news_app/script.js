'use strict';

var headline = [0,2,1,3,2,0,2,2],
	listItems = [],
	listDots = [];

sources.forEach(function(el, i) {
	let {name, id} = el;
	let {title, urlToImage, publishedAt} = articles[id][headline[i]];
	let itemList = `<div class="slider__slide" style="background-image: url(${urlToImage})" data-name="${name}">
            <div class="headline">
              <p><img src="${el.urlsToLogos.small}" alt="${name}"></p>
              <blockquote>
                ${title}
              </blockquote>
              <small>${publishedAt}</small>
            </div>
          </div>`;

    listDots.push(`<a href="#" class="slider__dot" data-pos="${i}"></a>`);
    listItems.push(itemList);
});

listDots.push(`<a href="#" class="slider__indicator"></a>`);
document.querySelector('.slider__dots').innerHTML = listDots.join('');
document.querySelector('.slider__slides').innerHTML = listItems.join('');

var contentElem = document.querySelector('.wrapper');

var hammertime = new Hammer(contentElem);
hammertime.on("swipeleft swiperight", function(evt) {
    if(evt.type == 'swipeleft')
        Slider.next(); 
    else if (evt.type == 'swiperight')
        Slider.prev();
});

var Slider = {
	init: function(selector) {
		this.el = document.querySelector(selector);
		this.slider = this.el.querySelector('.slider__slides');
		this.slides = this.slider.querySelectorAll('.slider__slide');
		this.dotIndicator = document.querySelector('.slider__indicator');

		this.currentSlide = 0;
		this.currentPosition = 0;
		this.frameWidth = document.querySelector('.wrapper').clientWidth;
		this.slideCount = this.slides.length;
		this.sliderWidth = this.frameWidth * this.slideCount;

		this.slider.style.width = this.sliderWidth;
		this.slides.forEach((slide, i) => {
			slide.style.width = this.frameWidth;
			slide.style.display = 'flex';
		});

		this.postTransition();
	},

	next: function() {
		if(this.currentSlide < this.slideCount - 1) {
			this.currentPosition += this.frameWidth;
			this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
			this.currentSlide++;
			this.postTransition();
		}		
	},

	prev: function() {
		if(this.currentSlide > 0) {
			this.currentPosition -= this.frameWidth;
			this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
			this.currentSlide--;
			this.postTransition();
		}
	},

	move: function(toindex) {
		let _toindex = parseInt(toindex);
		this.currentPosition = this.frameWidth * _toindex;
		this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
		this.currentSlide = _toindex;
		this.postTransition();
	},

	postTransition: function() {
		this.dotIndicator.style.left = `${1.3 * this.currentSlide}em`;
		var name = this.slides[this.currentSlide].getAttribute('data-name');
		document.querySelector('header h3').innerText = name;
		document.querySelector('.wrapper').setAttribute('data-pos', this.currentSlide);
	}
};

Slider.init('.slider');


/*let slideCount = 8,
    positionElement = document.querySelector('.wrapper'),
    sliderElement = document.querySelector('.slider__slides'),
    slides = document.querySelectorAll('.slider__slide'),
    wrapWidth = positionElement.clientWidth;

let step = 5,
    maxSpan = 100,
    currentSpan = 0,
    currentSlide = 0;

let hammertimex = new Hammer(sliderElement);
hammertimex.on("panleft panright", function(evt) {
  
	if(currentSpan - 5 < 0) {
		currentSpan = 5;
		return;
	} 

	if(currentSpan > wrapWidth * (slides.length-1)) {
		currentSpan = wrapWidth * (slides.length-1);
		return;
	} 
		

	if(evt.type == 'panleft') {
		currentSpan += step;
		sliderElement.style.transform = `translateX(-${currentSpan}px)`;
		slides[currentSlide].style.backgroundPositionX = `-${currentSpan*10/wrapWidth}px`;

		let nextCheckpoint = (currentSlide + 1) * wrapWidth;
		if (currentSpan > nextCheckpoint) {
			currentSlide++;
			document.querySelector('.slider__indicator').style.left = `${1.3 * currentSlide}em`;
		}
	 
	} 

	if (evt.type == 'panright') {
	currentSpan -= step;
	sliderElement.style.transform = `translateX(-${currentSpan}px)`;
	slides[currentSlide].style.backgroundPositionX = `-${currentSpan*10/wrapWidth}px`;

	let prevCheckpoint = (currentSlide) * wrapWidth;
		if (currentSpan < prevCheckpoint) {
			currentSlide--;
			document.querySelector('.slider__indicator').style.left = `${1.3 * currentSlide}em`;
		}
	}


});*/