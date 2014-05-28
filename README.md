slidizle
========

jQuery plugin for creating custom slideshow

Settings
========

```javascript
this.settings = {
	classes : {
		content 				: 'slidizle-content', 			// class applied on content wrrapper
		next 					: 'slidizle-next',			// class applied on next element
		previous 				: 'slidizle-previous',			// class applied on previous element
		navigation 				: 'slidizle-navigation',			// class applied on navigation element
		timer 					: 'slidizle-timer',			// class applied on timer element
		slide 					: 'slidizle-slide',			// class applied on each slide
		play 					: 'played',				// the play class applied on the container
		pause 		 			: 'paused',				// the pause class applied on the container
		stop 					: 'stoped',				// the stop class applied on the container
		slider 					: 'slidizle',				// an class to access the slider
		active 					: 'active',				// the className to add to active navigation, etc...
		loading 				: 'loading'				// the className to add to the slider when it is in loading mode
	},
	timeout					: null,					// the slider interval time between each medias
	
	transition : {										// save the transition options like duration, ease, etc...
		callback				: null,					// the name of the transition to use
		duration				: 1000,
		ease					: ''
	},
	
	pauseOnOver				: false,						// set if the slider has to make pause on hover
	nextOnClick 				: false,						// set if the slider has to go next on mouse click
	loop 					: false,						// set if the slider has to go first item when next on last
	autoPlay				: true,						// set if the slider has to play directly or not
	timerInterval				: 1000,						// save the interval for the timer refreshing
	loadBeforeTransition 			: false, 						// specify if need to load the next content before the transition
	onInit					: null,						// callback when the slider is inited
	onClick					: null,						// callback when a slide is clicked
	onChange				: null,						// callback when the slider change from one media to another
	onNext					: null,						// callback when the slider change for the next slide
	onPrevious				: null,						// callback when the slider change for the previous slide
	onPlay					: null,						// callback when the slider change his state to play
	onPause				: null,						// callback when the slider change his state to pause
	onTimer				: null						// callback when the slider timeout progress.
};
```
