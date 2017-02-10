var listItems = [],
	detailItems = [],
	playlist = [
		{"title":"Snowflake - Living Nightmare","src":"media/snowflake.mp3","img":"media/snowflake.jpg"},
		{"title":"Bensound - Dubstep","src":"media/dubstep.mp3","img":"media/dubstep2.jpg"},
    {"title":"Secret Of Life - 42","src":"media/track3.mp3","img":"media/track3.jpeg"},
		{"title":"Bensound - Retrosoul","src":"media/retrosoul.mp3","img":"media/retrosoul.jpg"},
		{"title":"Snowflake - Holiday Funky Blues","src":"media/snowflake3.mp3","img":"media/snowflake2.jpg"},
		{"title":"Bensound - Happy Rock","src":"media/happyrock.mp3","img":"media/happyrock.jpg"}
	];

playlist.forEach(function(el, i) {
	let [artist, title] = el.title.split('-');
	let top = (66*(i+1)) + (i*22); 
	let z = i+1;

	let itemList = `<div class="list-item" data-index="${i}">
        <div class="thumb">
        	<img src="${el.img}" alt="song_title" style="top: ${top}px">
        </div>
        <div class="title">
          <span>${title}</span>
          <small>${artist}</small>
        </div>
        <div class="length"><small>${formatTime(el.time) || "0:00"}</small></div>
      </div>`;

    let itemDetail = `<div class="slide">
      <div class="thumb">
        <div style="background-image:url(${el.img})"></div>
        <div style="background-image:url(${el.img})"></div>
      </div>
      <div class="title">
        <i class="zmdi zmdi-minus-circle-outline"></i>
        <h3><span>${title}</span><small>${artist}</small></h3>
        <i class="zmdi zmdi-favorite-outline"></i>
      </div>
    </div>`;

    listItems.push(itemList);
    detailItems.push(itemDetail);
});

document.querySelector('.list section').innerHTML = listItems.join('');
document.querySelector('.detail .slider').innerHTML = detailItems.join('');

let positionElement = document.querySelector('.wrapper'),
	sliderElement = document.querySelector('.slider');

let $listItemImg = $('.list-item img'),
	$detail = $('.detail');


var _player = new Player('.player', {tracks: playlist});
_player.$container.addEventListener('playerStateChanged', function(evt) {
  //console.log('player changed to ' + evt.detail);
  let $wrapper = $('.wrapper');

  if(evt.detail == 'play')
    $wrapper.removeClass('paused').addClass('playing');
  else if(evt.detail == 'pause')
    $wrapper.removeClass('playing').addClass('paused');
  else
    $wrapper.removeClass('paused').removeClass('playing');

}, false);

$('.player-indicator .playb').on('click', function(evt) {
  _player.play();
});


$('.list-item').on('click', function(evt) {
	// select the current detail item
	let $this = $(this),
		index = this.getAttribute('data-index');
	
	positionElement.setAttribute('data-pos', index);
	currentSlide = parseInt(index); 
	
	$this.find('img').addClass('open');
	$detail.addClass('open');
	setTimeout(() => { 
		$detail.addClass('ready');
		
		if(_player.currentTrack != currentSlide)
			_player.changeTrack(currentSlide, true);
	}, 300);
});


$('.detail .close').on('click', function(evt) {
	$listItemImg.removeClass('open');
	$detail.addClass('lock');
	
	setTimeout(() => {
		$detail.removeClass('ready lock open');
	}, 250);
});

$('.controls .zmdi-fast-rewind').on('click', prev);
$('.controls .zmdi-fast-forward').on('click', next);

let slideCount = 6,
	step = 5,
  maxSpan = 100,
  currentSpan = 0,
  currentSlide = 0;

let hammertime = new Hammer(sliderElement);
hammertime.on("panleft panright panstart panend", function(evt) {
  
  if(evt.type == 'panleft') {
    currentSpan += step;
    
    if(currentSpan > maxSpan)
      next();    
  } 
  
  if (evt.type == 'panright') {
    currentSpan -= step;

    if(currentSpan < - (maxSpan+20))
      prev();
  }

  // pull the borders
  if (evt.type == 'panstart' && evt.additionalEvent == 'panleft') {
    let s = currentSlide + 1;
    $('.slide:nth-child('+s+') .thumb').addClass('skewLeft');
  }

  if (evt.type == 'panstart' && evt.additionalEvent == 'panright') {
    let s = currentSlide + 1;
    $('.slide:nth-child('+s+') .thumb').addClass('skewRight');
  }

  if (evt.type == 'panend') {
    $('.thumb').removeClass('skewLeft skewRight');
    currentSpan = 0;
  }

  // sync the selected list item with the current detail item
	$listItemImg
		.removeClass('open')
		.eq(currentSlide)
		.addClass('open');
});


function next() {
  let slide = parseInt(positionElement.getAttribute('data-pos'))
      newSlide = (slide + 1 > (slideCount - 1))? slide : slide + 1;
  positionElement.setAttribute('data-pos', newSlide);
  currentSlide = newSlide;
  currentSpan = 0;
  _player.changeTrack(currentSlide, true);
}

function prev() {
  let slide = parseInt(positionElement.getAttribute('data-pos'))
      newSlide = (slide - 1 < 0)? slide : slide - 1;
  positionElement.setAttribute('data-pos', newSlide);
  currentSlide = newSlide;
  currentSpan = 0;
  _player.changeTrack(currentSlide, true);
}

function formatTime(seconds) {
  minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}