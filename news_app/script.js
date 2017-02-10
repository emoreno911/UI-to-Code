'use strict';

var headlines = [2,3,0,3,2,0,2,2],
	listItems = [],
	listDots = [];

sources.forEach(function(source, i) {
	let {name, id} = source;
	let articleList = articles[id].map((art) => {
		let cname = (art.description && art.description.length > 120)? 'compact' : '',
			description = (art.description != null)? art.description : '';

		return `<li class="${cname}">
			<div>
				<h5>${art.title}</h5>
				<p>${description}</p>
			</div>
			<img src="${art.urlToImage}" alt="${art.title}" onerror="hideme(this)">
		</li>`;
	});
	

	// headline + content
	let {title, urlToImage, publishedAt} = articles[id][headlines[i]];
	let itemList = `<div class="slider__slide" data-name="${name}">
            <div class="headline">
              <div class="backdrop" style="background-image: url(${urlToImage})"></div>
              <p><img src="${source.urlsToLogos.small}" alt="${name}"></p>
              <blockquote>
                ${title}
              </blockquote>
              <small>${formatDate(publishedAt)}</small>
            </div>
            <div class="content">
            	<ul>${articleList.join('')}</ul>
            </div>
          </div>`;

    listDots.push(`<a href="javascript:void(0)" class="slider__dot" data-pos="${i}" onclick="Slider.move(${i})"></a>`);
    listItems.push(itemList);
});

listDots.push(`<a href="#" class="slider__indicator"></a>`);
document.querySelector('.slider__dots').innerHTML = listDots.join('');
document.querySelector('.slider__slides').innerHTML = listItems.join('');

var contentElem = document.querySelector('.wrapper'),
	headerElem = document.querySelector('header');

var swipeLeftRight = new Hammer(contentElem);
swipeLeftRight.on("swipeleft swiperight", function(evt) {
    if(evt.type == 'swipeleft')
        Slider.next(); 
    else if (evt.type == 'swiperight')
        Slider.prev();
});

// remove class 'open'
headerElem.addEventListener('click', function(evt) {
	if(evt.target.className != 'slider__dot')
		contentElem.className = 'wrapper';
}, false);

var headlinePanUp = [];

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

		this.slider.style.width = this.sliderWidth + 'px';
		this.slides.forEach((slide, i) => {
			slide.style.width = this.frameWidth + 'px';

			// show the news list
			headlinePanUp[i] = new Hammer(slide.querySelector('.headline'));
			headlinePanUp[i].on('panup', (e) => {
				contentElem.className = 'wrapper open';
			}); 
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
		this.slides.forEach((el) => el.className = el.className.replace('slide_active', ''));
		
		var slide = this.slides[this.currentSlide];		
		slide.className += " slide_active";
		
		headerElem.querySelector('h3').innerText = slide.getAttribute('data-name');
		contentElem.setAttribute('data-pos', this.currentSlide);
	}
};


function hideme(el) {
	el.src = "http://placehold.it/250x125";
}

function formatDate(date_string) {
	var date = new Date(date_string),
		d = date.toUTCString().split(' ');

	return `${d[1]} ${d[2]} ${d[3]}`;
}

// forEach fallback
Object.prototype.forEach = function(callback) {
	for (var i = 0, len = this.length ; i < len; i++) {
		callback(this[i], i);
	}
};

Slider.init('.slider');
Slider.move(1);

/** Deleted code: lateral scroll with panLeftRight [first news commit] **/

/******************************************
 * Swipe Left or Right to read other sources 
 * Swipe Up for more news
 * Click on Header to go back to Headlines
 *******************************************/