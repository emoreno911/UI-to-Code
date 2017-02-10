var Player = function(containerSelector, opts) {
	this.$container = document.querySelector(containerSelector);
	this.$audioEl = this.$container.querySelector('.audio');
	this.$timeline = this.$container.querySelector('.progress');
	this.$playbtn = this.$container.querySelector('.playbtn');
	
	this.duration = 0;
	this.timelineWidth = 0;
	this.currentTrack = 0;
	this.playerState = 'stop';
	this.$audioEl.crossOrigin = "anonymous";
	this.tracks = opts.tracks;

	this.$audioEl.addEventListener("timeupdate", this.timeUpdate.bind(this), false);
	this.$playbtn.addEventListener("click", this.play.bind(this), false);

	this.$audioEl.addEventListener("canplaythrough", () => { this.duration = this.$audioEl.duration; }, false);
	this.$timeline.addEventListener("click", (e) => {
		var skipTo = e.offsetX / this.timelineWidth;
		this.$audioEl.currentTime = this.duration * skipTo;
	});

	this.analyserInitialized = false;

}

Player.prototype.play = function() {
	this.timelineWidth = this.$timeline.offsetWidth;
	
	if (this.$audioEl.paused) {
		this.$audioEl.play();
		// remove play, add pause
		this.$playbtn.className = "playbtn pause";
		this.setPlayerState('play');
	} else { // pause audio
		this.$audioEl.pause();
		// remove pause, add play
		this.$playbtn.className = "playbtn";
		this.setPlayerState('pause');
	}

	setTimeout(()=>{
		this.$container.querySelector('.end').innerText = this.formatTime(this.$audioEl.duration);
		this.duration = this.$audioEl.duration;
	}, 1000);

	// check for the analyser
	if(!this.analyserInitialized) {
		this.setupAnalyser();
		this.analyserInitialized = true;
	}

	// color references for analyser bars
	this.barBG = this.getBgColor(this.$timeline);
	this.barFG = this.getBgColor(this.$timeline.querySelector('.bar'));
}

Player.prototype.timeUpdate = function() {
	var playPercent = 
		(this.$audioEl.duration == 'Infinity')? 100 
		: this.$audioEl.currentTime * 100 / this.$audioEl.duration;

	this.setTimeline(playPercent, this.$audioEl.currentTime);

	if (playPercent > 99.9) {
		this.$playbtn.className = "playbtn";
		this.setPlayerState('stop');
	}
}

Player.prototype.changeTrack = function(index, autoplay) {
	//Stopping the download of media
	this.$audioEl.removeAttribute("src");
	this.$audioEl.load();

	this.currentTrack = index;
	this.$audioEl.setAttribute("src", this.tracks[index].src);
	this.$audioEl.load();

	setTimeout(()=>{
		this.setTimeline(0, 0, this.$audioEl.duration);
		if(autoplay){
			this.play();
		}
	}, 400);
}

Player.prototype.setTimeline = function(playPercent, elapsed, duration) {
	var _playPercent = (playPercent > 99)? playPercent - 1 : playPercent,
		_elapsed = elapsed || this.$audioEl.currentTime;

	this.$timeline.querySelector('.bar').style.width = _playPercent + "%";
	this.$container.querySelector('.begin').innerText = this.formatTime(_elapsed);

	if(duration)
		this.$container.querySelector('.end').innerText = this.formatTime(duration);

}

Player.prototype.setPlayerState = function(state) {
	var evt = new CustomEvent('playerStateChanged', {'detail': state});
	this.playerState = state;
	this.$container.dispatchEvent(evt);
}

Player.prototype.formatTime = function(seconds) {
	minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

// http://www.developphp.com/video/JavaScript/Analyser-Bars-Animation-HTML-Audio-API-Tutorial
Player.prototype.setupAnalyser = function() {
	this.$canvas = this.$container.querySelector('.analyser');
	this.ctx = this.$canvas.getContext('2d');
	this.audioContext = new AudioContext() || new webkitAudioContext();
	this.analyser = this.audioContext.createAnalyser();

	var source = this.audioContext.createMediaElementSource(this.$audioEl);
	source.connect(this.analyser);
	this.analyser.connect(this.audioContext.destination);
	this.frameLooper();
}

Player.prototype.frameLooper = function() {
	window.requestAnimationFrame(this.frameLooper.bind(this));
	var fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
	var bars = 75;
	var currentPercent = parseInt(this.$audioEl.currentTime*bars/this.$audioEl.duration);

	this.analyser.getByteFrequencyData(fbc_array);
	this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height); // Clear the canvas
	this.ctx.fillStyle = this.barFG; // Color of the bars
	
	for (var i = 0; i < bars; i++) {
		if(i > currentPercent)
			this.ctx.fillStyle = this.barBG;

		bar_x = i * 4;
		bar_width = 3.5;
		bar_height = -(fbc_array[i] / 2);
		this.ctx.fillRect(bar_x, this.$canvas.height, bar_width, bar_height);
	}
}

// https://permadi.com/tutorial/cssGettingBackgroundColor/index.html
Player.prototype.getBgColor = function(element) 
{
  if (element.currentStyle)
    return element.currentStyle.backgroundColor;
  if (window.getComputedStyle)
  {
    var elementStyle=window.getComputedStyle(element,"");
    if (elementStyle)
      return elementStyle.getPropertyValue("background-color");
  }
  // Return 0 if both methods failed.  
  return 0;
}
