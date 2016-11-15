'use strict';

/** Slider by Tobias Reich http://codepen.io/electerious/pen/JXNEPr **/
var dots = 3;
var sliderElem = document.querySelector('.slider');
var productElem = document.querySelector('.product');
var contentElem = document.querySelector('.content');
var dotElems = document.querySelectorAll('.slider__dot');
var indicatorElem = document.querySelector('.slider__indicator');
Array.prototype.forEach.call(dotElems, function (dotElem) {
    dotElem.addEventListener('click', function (e) {
        var currentPos = parseInt(sliderElem.getAttribute('data-pos'));
        var newPos = parseInt(dotElem.getAttribute('data-pos'));
        var newDirection = newPos > currentPos ? 'right' : 'left';
        var currentDirection = newPos < currentPos ? 'right' : 'left';
        indicatorElem.classList.remove('slider__indicator--' + currentDirection);
        indicatorElem.classList.add('slider__indicator--' + newDirection);
        sliderElem.setAttribute('data-pos', newPos);
        productElem.setAttribute('data-pos', newPos);
        contentElem.setAttribute('data-pos', newPos);
    });
});

/** Events **/
$('#openMenu').on('click', function(evt) {
	$('.content')
		.removeClass('no-animation') //disable initial animation
		.toggleClass('shrink');
});

$('.buttons > div').on('click', function(evt) {
	$(this).toggleClass('selected');
});