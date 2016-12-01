'use strict';

var dots = 3;
var contentElem = document.querySelector('.content');
var dotElems = document.querySelectorAll('.slider__dot');
var indicatorElem = document.querySelector('.slider__indicator');
Array.prototype.forEach.call(dotElems, function (dotElem) {
    dotElem.addEventListener('click', function (e) {
        var currentPos = parseInt(contentElem.getAttribute('data-pos'));
        var newPos = parseInt(dotElem.getAttribute('data-pos'));
        var newDirection = newPos > currentPos ? 'right' : 'left';
        var currentDirection = newPos < currentPos ? 'right' : 'left';
        indicatorElem.classList.remove('slider__indicator--' + currentDirection);
        indicatorElem.classList.add('slider__indicator--' + newDirection);
        contentElem.setAttribute('data-pos', newPos);
    });
});

var hammertime = new Hammer(contentElem);

// listen to touch events...
hammertime.on("swipeleft swiperight", function(evt) {
    var currentPos = parseInt(contentElem.getAttribute('data-pos')),
        newPos;
    
    if(evt.type == 'swipeleft')
        newPos = (currentPos + 1 > 2)? currentPos : currentPos + 1; 
    else if (evt.type == 'swiperight')
        newPos = (currentPos - 1 < 0)? currentPos : currentPos - 1;

    if(newPos != currentPos) {
        var newDirection = newPos > currentPos ? 'right' : 'left';
        var currentDirection = newPos < currentPos ? 'right' : 'left';
        indicatorElem.classList.remove('slider__indicator--' + currentDirection);
        indicatorElem.classList.add('slider__indicator--' + newDirection);
        contentElem.setAttribute('data-pos', newPos);
    }
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


$(".dropdown").on("click", function(){
  $(this).toggleClass("flip");
})

$(".back ul li").on("click", function(){
    var val = $(this).text();
  $(this).closest('.dropdown').find('.front').text(val);
});