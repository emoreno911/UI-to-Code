var Slider = {
	init: function(selector) {
		this.el = document.querySelector(selector);
		this.slider = this.el.querySelector('.slider');
		this.slides = this.slider.querySelectorAll('.slide');

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
		
	},

	next: function() {
		if(this.currentSlide < this.slideCount - 1) {
			this.currentPosition += this.frameWidth;
			this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
			this.currentSlide++;
		}		
	},

	prev: function() {
		if(this.currentSlide > 0) {
			this.currentPosition -= this.frameWidth;
			this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
			this.currentSlide--;
		}
	},

	move: function(toindex) {
		let _toindex = parseInt(toindex);
		this.currentPosition = this.frameWidth * _toindex;
		this.slider.style.transform = `translateX(-${this.currentPosition}px)`;
		this.currentSlide = _toindex;
	}
};