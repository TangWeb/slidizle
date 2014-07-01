/**
 * Slider jQuery Plugin
 *
 * This plugin allow to create sliders from images, video or html content.
 *
 * @author	Olivier Bossel (andes)
 * @created	21.02.2012
 * @updated 	01.07.2014
 * @version	1.2.52
 */
(function($) {
	
	/**
	 * Plugin :
	 */
	function slidizle(item, options) {
		
		// vars :
		this.settings = {

			/**
			 * Some classes applied on different elements
			 */
			classes : {
				
				// class applied on content wrrapper
				content 				: 'slidizle-content', 	

				// class applied on next navigation element		
				next 					: 'slidizle-next',			
				
				// class applied on previous navigation element
				previous 				: 'slidizle-previous',			
				
				// class applied on navigation element
				navigation 				: 'slidizle-navigation',			
				
				// class applied on timer element
				timer 					: 'slidizle-timer', // not documented		
				
				// class applied on each slide
				slide 					: 'slidizle-slide',			
				
				// class applied on the next and previous navigation when disabled
				disabled 				: 'disabled',				
				
				// the play class applied on the container
				play 					: 'played',				
				
				// the pause class applied on the container
				pause 		 			: 'paused',				
				
				// the stop class applied on the container
				stop 					: 'stoped',				
				
				// an class to access the slider
				slider 					: 'slidizle',				
				
				// the className to add to active navigation, slides, etc...
				active 					: 'active',				
				
				// the className to add to the slider and slides when it is in loading mode
				loading 				: 'loading'				
			},

			// the slider interval time between each medias
			timeout					: null,					
			
			// save the transition options like duration, ease, etc (by default, no transition in js)...
			transition : {										
				
				// the name or callback function of the transition to use
				callback				: null,					
				duration				: 1000, 
				ease					: ''
			},	
			
			// set if the slider has to make pause on mouse hover
			pauseOnHover				: false,						
			
			// set if the slider has to go next on mouse click
			nextOnClick 				: false,						
			
			// set if the slider has to go first item when next on last
			loop 					: false,						
			
			// set if the slider has to play directly or not if a timeout is specified
			autoPlay				: true,						
			
			// activate or not the keyboard
			keyboardEnabled  			: true,						
			
			// activate or not the touch navigation for mobile (swipe)
			touchEnabled 				: true, 						
			
			// save the interval for the timer refreshing
			timerInterval				: 1000,						
			
			// specify if need to load the next content before the transition
			loadBeforeTransition 			: true, 						
			
			// callback when the slider is inited
			onInit					: null,						
			
			// callback when a slide is clicked
			onClick					: null,						
			
			// callback when the slider change from one media to another
			onChange				: null,						
			
			// callback when the slider change for the next slide
			onNext					: null,						
			
			// callback when the slider change for the previous slide
			onPrevious				: null,						
			
			// callback when the slider change his state to play
			onPlay					: null,						
			
			// callback when the slider change his state to pause
			onPause				: null,						
			
			// callback when the slider timeout progress.
			onTimer				: null						
		};
		this.$refs = {
			slider					: null,						// save the reference to the slider container itself
			content					: null,						// save the reference to the content element
			medias					: null,						// save the references to all medias element
			nextMedia 				: null,						// save the reference to the next media element
			previousMedia 				: null,						// save the reference to the previous media element
			currentMedia 				: null,						// save the reference to the current media element
			navigation				: null,						// save the reference to the navigation element
			next					: null,						// save the reference to the next button element
			previous				: null,						// save the reference to the previous button element
			current					: null,						// save the reference to the current media displayed
			timer 					: null						// save the reference to the timer element if exist
		};
		this.config = {
			native_transitions : [									// list of native transitions
				'default', 'fade'
			]
		};
		this.current_timeout_time = 0;									// save the current time of the timeout
		this.timer = null;										// save the timeout used as timer
		this.timeout = null;										// save the timeout for playing slider
		this.previous_index = 0;									// save the index of the previous media displayed
		this.current_index = 0;										// save the index of the current media displayed
		this.next_index = 0; 										// save the index of the next media
		this.isPlaying = false;										// save the playing state
		this.isOver = false;										// save the over state
		this.total = 0;											// save the total number of element in the slider				
		this.$this = $(item);										// save the jQuery item to access it
		this.clickEvent = navigator.userAgent.match(/mobile/gi) ? 'touchend' : 'click'; 		// the best click event depending on device

		// init :
		this.init($(item), options); 
		
	}
	
	/**
	 * Init : init the plugin
	 *
	 * @param	jQuery	item	The jQuery item
	 * @param	object	options	The options
	 */
	slidizle.prototype.init = function(item, options) {
		
		// vars :
		var _this = this,
			$this = item;
		
		// add bb-slider class if needed :
		if (!$this.hasClass(_this._getSetting('classes.slider'))) $this.addClass(_this._getSetting('classes.slider'));

		// update options :
		$.extend(true, _this.settings, options);

		// save all references :
		_this.$refs.slider = $this;
		_this.$refs.content = $this.find('[data-slidizle-content]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});
		_this.$refs.navigation = $this.find('[data-slidizle-navigation]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.previous = $this.find('[data-slidizle-previous]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.next = $this.find('[data-slidizle-next]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.timer = $this.find('[data-slidizle-timer]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;

		// apply class :
		if (_this.$refs.content) _this.$refs.content.addClass(_this._getSetting('classes.content'));
		if (_this.$refs.next) _this.$refs.next.addClass(_this._getSetting('classes.next'));
		if (_this.$refs.previous) _this.$refs.previous.addClass(_this._getSetting('classes.previous'));
		if (_this.$refs.navigation) _this.$refs.navigation.addClass(_this._getSetting('classes.navigation'));
		if (_this.$refs.timer) _this.$refs.timer.addClass(_this._getSetting('classes.timer'));

		// get all medias in the slider :
		var $content_childs = _this.$refs.content.children(':first-child');
		if ($content_childs.length > 0) {
			var content_childs_type = $content_childs[0]['nodeName'].toLowerCase();
			_this.$refs.medias = _this.$refs.content.children(content_childs_type);
		}
		
		// check if are some medias :
		if (_this.$refs.medias) {

			// add class on medias :
			_this.$refs.medias.addClass(_this._getSetting('classes.slide'));

			// adding click on slides :
			_this.$refs.medias.bind(_this.clickEvent, function(e) {
				// trigger an event :
				$this.trigger('slidizle.click',[_this]);
				// callback :
				if (_this._getSetting('onClick')) _this._getSetting('onClick')(_this);
			});
			
			// creating data :
			_this.total = _this.$refs.medias.length;
			_this.current_index = 0;
		
			// init navigation :
			if (_this.$refs.navigation.length>=1) _this._initNavigation();
			_this.initPreviousNextNavigation();
		
			// hiding all medias :
			if (_this._getSetting('transition') && _this._isNativeTransition(_this._getSetting('transition.callback'))) _this.$refs.medias.hide();

			// check if a content is already active :
			var $active_slide = _this.$refs.medias.filter('.active:first');
			if ($active_slide.length >= 1) {
				// go to specific slide :
				_this.current_index = $active_slide.index();
			}
				
			// change medias for the first time :
			_this._changeMedias();	

			// check if pauseOnHover is set to true :
			if (_this._getSetting('pauseOnHover')) {
				// add hover listener :
				$this.hover(function(e) {
					// pause :
					_this.pause();
					// update isOver state :
					_this.isOver = true;
				}, function(e) {
					// play :
					_this.play();
					// update isOver state :
					_this.isOver = false;
				});
			}

			// keyboard navigation :
			if (_this._getSetting('keyboardEnabled') && _this._getSetting('keyboardEnabled') != 'false') _this._initKeyboardNavigation();

			// touch navigation :
			if (_this._getSetting('touchEnabled') && navigator.userAgent.match(/mobile/gi)) _this._initTouchNavigation();

			// play :
			if (_this._getSetting('autoPlay') && _this.$refs.medias.length > 1) _this.play();

			// check if next on click :
			if (_this._getSetting('nextOnClick'))
			{
				_this.$refs.content.bind('click', function() {
					_this.next();
				});
			}

		}

		// apply class :
		$this.addClass(_this._getSetting('classes.slider'));

		// check the on init :
		if (_this._getSetting('onInit')) _this._getSetting('onInit')(_this);
		$this.trigger('slidizle.init', [_this]);
		
	}
	
	/**
	 * Creation of the navigation :
	 */
	slidizle.prototype._initNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// check if is an navigation tag :
		if (!_this.$refs.navigation) return false;
		
		// check if we have to popule the navigation :
		if (_this.$refs.navigation.children().length <= 0)
		{
			// determine how to populate the navigation :
			var navigation_type = _this.$refs.navigation[0]['nodeName'].toLowerCase(),
				navigation_children_type = (navigation_type == 'dl') ? 'dt' :
											(navigation_type == 'ol') ? 'li' :
											(navigation_type == 'ul') ? 'li' :
											'div';
			
			// create an navigation element for each media :
			for (var i=0; i<_this.total; i++)
			{
				// create an navigation element :
				_this.$refs.navigation.append('<'+navigation_children_type+'>'+(i+1)+'</'+navigation_children_type+'>');	
			}
		}
		
		// add click event on navigation :
		_this.$refs.navigation.children().bind(_this.clickEvent, function(e) {
			
			// vars :
			var $nav = $(this),
				slide_id = $nav.attr('data-slidizle-slide-id'),
				content_by_slide_id = _this.$refs.medias.filter('[data-slidizle-slide-id="'+slide_id+'"]');

			// saving previous var :
			_this.previous_index = _this.current_index;

			// check if nav has an slide id :
			if (slide_id && content_by_slide_id)
			{
				// get index :
				var idx = content_by_slide_id.index();

				// check if index is not the same as now :
				if (idx != _this.current_index)
				{
					// updating current index :
					_this.current_index = idx;

					// change media :
					_this._changeMedias();
				}
			} else {
				// check if is not the same :
				if ($(this).index() != _this.current_index)
				{
					// updating current var :
					_this.current_index = $(this).index();
					
					// change media :
					_this._changeMedias();
				}
			}
			
			// prevent default behaviors :
			e.preventDefault();
		});
	}

	/**
	 * Init keyboard navigation :
	 */
	slidizle.prototype._initKeyboardNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// listen for keyboard events :
		$(document).bind('keyup', function(e) {

			// check the pressed key :
			switch (e.keyCode)
			{
				case 39:
					_this.next();
				break;
				case 37:
					_this.previous();
				break;
			}

		});
	}

	/**
	 * Init touch navigation :
	 */
	slidizle.prototype._initTouchNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			xStart, yStart;

		// listen for needed events :
		$(document).bind('touchstart', function(e) {
			xStart = e.originalEvent.touches[0].clientX;
			yStart = e.originalEvent.touches[0].clientY;
		});
		$(document).bind('touchmove', function(e) {
			if ( ! xStart || ! yStart) return;
			var x = e.originalEvent.touches[0].clientX,
				y = e.originalEvent.touches[0].clientY,
				xDiff = xStart - x,
				yDiff = yStart - y;

			// check direction :
			if (Math.abs(xDiff) > Math.abs(yDiff))
			{
				if (xDiff > 0)
				{
					_this.next();
				} else {
					_this.previous();
				}
			}

			// reset values :
			xStart = yStart = null;
		});
	}

	/**
	 * Init next and prev links :
	 */
	slidizle.prototype.initPreviousNextNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// add click event on previous tag :
		if (_this.$refs.previous)
		{	
			// add click handler :
			if (_this.total > 1) _this.$refs.previous.bind(_this.clickEvent, function() { _this.previous(); });
			// hide if no multiple medias :
			if (_this.total <= 1) _this.$refs.previous.hide();
		}
		
		// add click event on next tag :
		if (_this.$refs.next)
		{
			// add click handler :
			if (_this.total > 1) _this.$refs.next.bind(_this.clickEvent, function() { _this.next(); });
			// hide if no multiple medias :
			if (_this.total <= 1) _this.$refs.next.hide();
		}
	}

	/**
	 * tick tick tick...
	 */
	slidizle.prototype._tick = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// update current timeout time :
		_this.current_timeout_time -= _this._getSetting('timerInterval');

		// call the onTimer callback :
		if (_this._getSetting('onTimer')) {
			var total_timeout = _this.$refs.current.data('slide-timeout') || _this._getSetting('timeout');
			_this._getSetting('onTimer')(_this, _this.current_timeout_time, total_timeout);
			$this.trigger('slidizle.timer', [_this, _this.current_timeout_time, total_timeout]);
		}

		// check current timeout time :
		if (_this.current_timeout_time <= 0) {
			// change media :
			_this.next();
		}
	}
			
	/**
	 * Managing the media change :
	 */
	slidizle.prototype._changeMedias = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			disabledClass = _this._getSetting('classes.disabled');
			
		// clear timer (relaunchec on transition) :
		clearInterval(_this.timer);
		_this.timer = null;

		// save the reference to the previous media displayed :
		_this.$refs.previousMedia = _this.$refs.currentMedia;
	
		// save the reference to the current media displayed :
		_this.$refs.currentMedia = _this.$refs.content.children(':eq('+_this.current_index+')');

		// save the reference to next media :
		_this.$refs.nextMedia = _this.$refs.content.children(':eq('+_this.next_index+')');

		// manage disabled class on navigation :
		if (_this.$refs.next)
		{
			if (_this.isLast() && ! _this.isLoop())
			{
				_this.$refs.next.addClass('disabled');
			} else {
				if (_this.$refs.next.hasClass(disabledClass)) _this.$refs.next.removeClass(disabledClass);
			}
		}
		if (_this.$refs.previous)
		{
			if (_this.$refs.previous && _this.isFirst() && ! _this.isLoop())
			{
				_this.$refs.previous.addClass(disabledClass);
			} else {
				if (_this.$refs.previous.hasClass(disabledClass)) _this.$refs.previous.removeClass(disabledClass);
			}
		}

		// manage navigation classes :
		var current_slide_id = _this.$refs.currentMedia.attr('data-slidizle-slide-id');
		_this.$refs.navigation.each(function() {
			var $nav = $(this),
				current_navigation_by_slide_id = $(this).children('[data-slidizle-slide-id="'+current_slide_id+'"]');

			if (current_slide_id && current_navigation_by_slide_id)
			{
				$nav.children().removeClass(_this._getSetting('classes.active'));
				current_navigation_by_slide_id.addClass(_this._getSetting('classes.active'));
			} else {
				$nav.children().removeClass(_this._getSetting('classes.active'));
				$nav.children(':eq('+_this.current_index+')').addClass(_this._getSetting('classes.active'));
			}

		});

		// reset the timeout :
		var t = _this.$refs.currentMedia.data('slide-timeout') || _this._getSetting('timeout');
		if (t) {
			_this.current_timeout_time = t;
		}

		// call the onTimer callback if exist :
		if (_this._getSetting('onTimer') && _this._getSetting('timeout')) _this._getSetting('onTimer')(_this, _this.current_timeout_time, t);
		$this.trigger('slidizle.timer', [_this, _this.current_timeout_time, t]);

		// remove the class of the current media on the container :
		if (_this.$refs.previousMedia) _this.$this.removeClass('slide-'+_this.$refs.previousMedia.index());

		// set the class of the current media on the container :
		_this.$this.addClass('slide-'+_this.$refs.currentMedia.index());

		// add the loading clas to the slider :
		_this.$refs.slider.addClass(_this._getSetting('classes.loading'));

		// add load class on current element :
		_this.$refs.currentMedia.addClass(_this._getSetting('classes.loading'));

		// launch transition :
		if ( ! _this._getSetting('loadBeforeTransition') || _this._getSetting('loadBeforeTransition') == 'false') 
		{
			// launch transition directly :
			launchTransition();
		} else {
			// load content of slide :
			_this._loadSlide(_this.$refs.currentMedia, function($slide) {

				// remove loading class
				$slide.removeClass(_this._getSetting('classes.loading'));

				// remove loading class :
				_this.$refs.slider.removeClass(_this._getSetting('classes.loading'));

				// launch transition if has to be launched after loading :
				launchTransition();
			});
		}

		// launch transition and dispatch en change event :
		function launchTransition()
		{
			// delete active_class before change :
			_this.$refs.medias.removeClass(_this._getSetting('classes.active'));

			// delete active_class before change :
			_this.$refs.currentMedia.addClass(_this._getSetting('classes.active'));

			// check transition type :
			if (_this._getSetting('transition') && _this._isNativeTransition(_this._getSetting('transition.callback'))) _this._transition(_this._getSetting('transition.callback'));
			else if (_this._getSetting('transition') && _this._getSetting('transition.callback')) _this._getSetting('transition.callback')(_this);
			
			// callback :
			if (_this._getSetting('onChange')) _this._getSetting('onChange')(_this);
			$this.trigger('slidizle.change', [_this]);

			// manage onNext onPrevious events :
			if (_this.$refs.currentMedia.index() == 0 && _this.$refs.previousMedia)
			{
				if (_this.$refs.previousMedia.index() == _this.$refs.medias.length-1) {
					if (_this._getSetting('onNext')) _this._getSetting('onNext')(_this);
					$this.trigger('slidizle.next', [_this]);
				} else {
					if (_this._getSetting('onPrevious')) _this._getSetting('onPrevious')(_this);
					$this.trigger('slidizle.previous', [_this]);
				}
			} else if (_this.$refs.currentMedia.index() == _this.$refs.medias.length-1 && _this.$refs.previousMedia)
			{
				if (_this.$refs.previousMedia.index() == 0) {
					if (_this._getSetting('onPrevious')) _this._getSetting('onPrevious')(_this);
					$this.trigger('slidizle.previous', [_this]);
				} else {
					if (_this._getSetting('onNext')) _this._getSetting('onNext')(_this);
					$this.trigger('slidizle.next', [_this]);
				}
			} else if (_this.$refs.previousMedia) {
				if (_this.$refs.currentMedia.index() > _this.$refs.previousMedia.index()) {
					if (_this._getSetting('onNext')) _this._getSetting('onNext')(_this);
					$this.trigger('slidizle.next', [_this]);
				} else {
					if (_this._getSetting('onPrevious')) _this._getSetting('onPrevious')(_this);
					$this.trigger('slidizle.previous', [_this]);
				}
			} else {
				if (_this._getSetting('onNext')) _this._getSetting('onNext')(_this);
				$this.trigger('slidizle.next', [_this]);
			}

			// init the timer :
			if (_this._getSetting('timeout') && _this.$refs.medias.length > 1 && _this.isPlaying && !_this.timer) {
				clearInterval(_this.timer);
				_this.timer = setInterval(function() {
					_this._tick();
				}, _this._getSetting('timerInterval'));
			}
		}
	}

	/**
	 * Load a slide :
	 */
	slidizle.prototype._loadSlide = function(content, callback) {

		// vars :
		var _this = this,
			$this = _this.$this,
			$content = $(content),
			toLoad = [], loaded = 0;

		// get contents in slide :
		var $items = $content.find('*:not(script)').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});

		// add the slide itself :
		$items = $items.add($content);

		// loop on each content :
		$items.each(function() {

			// vars :
			var $item = $(this),
				imgUrl;

			// check if is a custom element to load :
			if (typeof $item.attr('data-slidizle-preload-custom') != 'undefined' && $item.attr('data-slidizle-preload-custom') !== false)
			{
				// add to load array :
				toLoad.push({
					type : 'custom',
					$elm : $item
				});
				return;
			}

			// check if image is in css :
			if ($item.css('background-image').indexOf('none') == -1) {
				var bkg = $item.css('background-image');
				if (bkg.indexOf('url') != -1) {
					var temp = bkg.match(/url\((.*?)\)/);
					imgUrl = temp[1].replace(/\"/g, '');
				}
			} else if ($item.get(0).nodeName.toLowerCase() == 'img' && typeof($item.attr('src')) != 'undefined') {
				imgUrl = $item.attr('src');
			}

			if ( ! imgUrl) return;

			// add image to array :
			toLoad.push({
				type : 'image',
				url : imgUrl
			});

		});

		// check if has nothing to load :
		if ( ! toLoad.length)
		{
			callback($content);
			return;
		}

		// loop on all the elements to load :
		$(toLoad).each(function(index, item) {

			// switch on type :
			switch (item.type) {
				case 'image':
					// create image :
					var imgLoad = new Image();
					$(imgLoad).load(function() {
						// call loaded callback :
						loadedCallback();
					}).error(function() {
						// call loaded :
						loadedCallback();
					}).attr('src', item.url);
				break;
				case 'custom':
					// bind event :
					item.$elm.bind('slidizle.loaded', function(e) {
						// call loaded :
						loadedCallback();
					});
				break;
			}
		});

		// loaded callback :
		function loadedCallback() {
			// update number of elements loaded :
			loaded++;

			// check if loading is finished :
			if (loaded >= toLoad.length) callback($content);
		}

	}
			
	/**
	 * Execute an native transition :
	 *
	 * @param	String	transition	The transition to operate
	 */
	slidizle.prototype._transition = function(transition)
	{
		// vars :
		var _this = this,
			$this = _this.$this;
	
		// get previous and current item :
		var previous = _this.$refs.previousMedia,
			current = _this.$refs.currentMedia;
		
		// switch on transition name :
		switch (transition)
		{
			case 'fade':
				// hide previous :
				if (previous) {
					previous.clearQueue().animate({
						opacity:0
					}, 400, function() {
						// hide :
						$(this).css('display','none');
					});
				}
				
				// display current :
				if (current) {
					current.css({
						opacity:0,
						display:'block'
					}).clearQueue().animate({
						opacity:1
					}, 400);
				}	
			break;
			case 'default':
			default:
				// hide previous :
				if (previous) previous.hide();
				// display current :
				current.show();
			break;
		}
	}
			
	/**
	 * Check if the given transition exist in native mode
	 *
	 * @param	String	$transition	The transition to check
	 * @return	Boolean	true if exist, false it not
	 */
	slidizle.prototype._isNativeTransition = function(transition)
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// loop on each native transition :
		for(var i=0; i<_this.config.native_transitions.length; i++) {
			// check if is this transition :
			if (transition == _this.config.native_transitions[i]) return true;
		}
		
		// this is not an native transition :
		return false;
	}
	
	/**
	 * Is loop :
	 */
	slidizle.prototype.isLoop = function() {
		var _this = this,
			loop = _this._getSetting('loop');
		return (loop && loop != 'false');
	};

	/**
	 * Play :
	 */
	slidizle.prototype.play = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// remove the pause class :
		_this.$this.removeClass(_this._getSetting('classes.pause'));
		_this.$this.removeClass(_this._getSetting('classes.stop'));

		// check the status :
		if (!_this.isPlaying && _this._getSetting('timeout') && _this.$refs.medias.length > 1) {
			// update the state :
			_this.isPlaying = true;
			// check the current_timeout_time :
			if (_this.current_timeout_time <= 0) {
				// reset the timeout :
				var t = _this.$refs.current.data('slide-timeout') || _this._getSetting('timeout');
				if (t) {
					_this.current_timeout_time = t;
				}
			}
			// start the timer :
			clearInterval(_this.timer);
			_this.timer = setInterval(function() {
				_this._tick();
			}, _this._getSetting('timerInterval'));
			// add the play class :
			_this.$this.addClass(_this._getSetting('classes.play'));
			// trigger callback :
			if (_this._getSetting('onPlay')) _this._getSetting('onPlay')(_this);
			$this.trigger('slidizle.play', [_this]);
		}
	}

	/**
	 * Pause :
	 */
	slidizle.prototype.pause = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// remove the play class :
		_this.$this.removeClass(_this._getSetting('classes.play'));
		_this.$this.removeClass(_this._getSetting('classes.stop'));

		// check the status :
		if (_this.isPlaying) {
			// update the state :
			_this.isPlaying = false;
			// stop the timer :
			clearInterval(_this.timer);
			// add the pause class :
			_this.$this.addClass(_this._getSetting('classes.pause'));
			// trigger callback :
			if (_this._getSetting('onPause')) _this._getSetting('onPause')(_this);
			$this.trigger('slidizle.pause', [_this]);
		}
	}

	/**
	 * Stop :
	 * Stop timer and reset it 
	 */
	slidizle.prototype.stop = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// remove the play and pause class :
		_this.$this.removeClass(_this._getSetting('classes.play'));
		_this.$this.removeClass(_this._getSetting('classes.pause'));

		// check the status :
		if (_this.isPlaying) {
			// update the state :
			_this.isPlaying = false;
			// stop the timer :
			clearInterval(_this.timer);
			// reset the timer :
			var t = _this.$refs.current.data('slide-timeout') || _this._getSetting('timeout');
			_this.current_timeout_time = t;
			// call onTimer if exist :
			if (_this._getSetting('onTimer')) _this._getSetting('onTimer')(_this, _this.current_timeout_time, t);
			$this.trigger('slidizle.timer', [_this, _this.current_timeout_time, t]);
			// add the pause class :
			_this.$this.addClass(_this._getSetting('classes.stop'));
			// trigger callback :
			if (_this._getSetting('onStop')) _this._getSetting('onStop')(_this);
			$this.trigger('slidizle.stop', [_this]);
		}
	}

	/**
	 * Toggle play pause :
	 */
	slidizle.prototype.togglePlayPause = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// check the status :
		if (_this.isPlaying) _this.pause();
		else _this.play();
	}
	
	/**
	 * Next media :
	 */
	slidizle.prototype.next = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			disabledClass = _this._getSetting('classes.disabled'),
			loop = _this._getSetting('loop'),
			isLoop = loop && loop != 'false';

		// in on last item :
		if (_this.isLast())
		{
			// check if on last item and the slider if on loop :
			if ( ! isLoop) return;
		}

		// saving previous :
		_this.previous_index = _this.current_index;
		
		// managing current :
		_this.current_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;
		
		// managing next :
		_this.next_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;

		// change medias :
		_this._changeMedias();
	}
			
	/**
	 * Previous media :
	 */
	slidizle.prototype.previous = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// check if on last item and the slider if on loop :
		if ( ! _this._getSetting('loop') && _this.current_index <= 0) return;	

		// saving previous :
		_this.previous_index = _this.current_index;
		
		// managing current :
		_this.current_index = (_this.current_index-1 < 0) ? _this.total-1 : _this.current_index-1;
		
		// managing next :
		_this.next_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;

		// change medias :
		_this._changeMedias();
	}

	/**
	 * Go to a specific slide :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	slidizle.prototype.goto = function(ref)
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			$slide = null;

		// check the ref :
		if (typeof ref == 'string') {
			// check if is an selector specified :
			if (ref.substr(0,1) == '.' || ref.substr(0,1) == '#') {
				// try to find the slide by selector :
				$slide = _this.$refs.content.children(ref);
			} else {
				// check if we can find an slide ref :
				var slideById = _this.$refs.medias.filter('[data-slidizle-slide-id="'+ref+'"]');
				if (slideById.length == 1) {
					$slide = slideById;
				} else if (_this.$refs.medias.filter('#'+ref).length == 1) {
					$slide = _this.$refs.medias.filter('#'+ref);
				}
			}
		} else if (typeof ref == 'number') {
			// get the slide :
			$slide = _this.$refs.medias.filter(':eq('+ref+')');
		}

		// try to get the index of the slide :
		if ($slide && $slide.index() != null) {
			// set the current index :
			_this.current_index = $slide.index();
			// change media :
			_this._changeMedias();
		}
	}

	/**
	 * Go to and play :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	slidizle.prototype.gotoAndPlay = function(ref)
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// go to a slide :
		_this.gotoSlide(ref);

		// play :
		_this.play();
	}

	/**
	 * Go to and stop :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	slidizle.prototype.gotoAndStop = function(ref)
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// go to a slide :
		_this.gotoSlide(ref);

		// play :
		_this.stop();
	}
	
	/**
	 * Get current media :
	 *
	 * @return	jQuery Object	The current media reference
	 */
	slidizle.prototype.getCurrentMedia = function()
	{
		// vars :
		var _this = this;
		
		// return the current media reference :
		return _this.$refs.currentMedia;
	}

	/**
	 * Get previous slide :
	 *
	 * @return 	jQuery Object 	The previous media reference
	 */
	slidizle.prototype.getPreviousSlide = function() {

		// vars :
		var _this = this;

		// return the previous media :
		return _this.$refs.previousMedia;
	}

	/**
	 * Get the next slide :
	 *
	 * @return 	jQuery Object 	The next media reference
	 */
	slidizle.prototype.getNextSlide = function() {

		// vars :
		var _this = this;

		// get the next media :
		return _this.$refs.nextMedia;

	}
	
	/**
	 * Get all slide :
	 *
	 * @return	jQuery Object	All medias references
	 */
	slidizle.prototype.getAllSlides = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// return all medias :
		return _this.$refs.medias;
	}

	/**
	 * Return if is last or not :
	 *
	 * @return 	boolean 	true | false
	 */
	slidizle.prototype.isLast = function() {

		// vars :
		var _this = this;

		return (_this.getCurrentMedia().index() >= _this.getAllMedias().length-1);

	}

	/**
	 * Return if is first or not :
	 *
	 * @return 	boolean 	true | false
	 */
	slidizle.prototype.isFirst = function() {

		// vars :
		var _this = this;

		return (_this.getCurrentMedia().index() <= 0);

	}
	
	/**
	 * Get setting :
	 * this function try to get the setting asked on the html tag itself
	 * the name has to be a string separated by the "." -> classes.loading
	 * this function will check if data-{pluginName}-classes-loading attr ecist and return it, or return the _this._getSetting('classes.loading value if not
	 *
	 * @param 	string 	name 	The name of the setting to get (use dot notation) (ex : classes.loading)
	 */
	slidizle.prototype._getSetting = function(name) {

		// vars :
		var _this = this,
			$this = _this.$this;

		// split the setting name :
		var inline_setting = 'data-slidizle-' + name.replace('.','-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
			inline_attr = $this.attr(inline_setting);

		// check if element has inline setting :
		if (typeof inline_attr !== 'undefined' && inline_attr !== false) return inline_attr;
		else return eval('_this.settings.'+name);
	};
	 
	/**
	 * jQuery bb_counter controller :
	 */
	$.fn.slidizle = function(method) {

		// store args to use later :
		var args = Array.prototype.slice.call(arguments, 1);

		// check what to do :
		if (slidizle.prototype[method])
		{
			// apply on each elements :
			this.each(function() {
				// get the plugin :
				var plugin = $(this).data('slidizle_api');
				// call the method on api :
				plugin[method].apply(plugin, args);
			});
		}
		else if (typeof method == 'object' || ! method)
		{
			// apply on each :
			this.each(function() {
				$this = $(this);

				// stop if already inited :
				if ($this.data('slidizle_api') != null && $this.data('slidizle_api') != '') return;

				// make a new instance :
				var api = new slidizle($this, args[0]);

				// save api in element :
				$this.data('slidizle_api', api);
			});
		}
		else
		{
			// error :
			$.error( 'Method ' +  method + ' does not exist on jQuery.slidizle' );
		}

		// if ( methods[method] ) {
		// 	return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		// } else if ( typeof method === 'object' || ! method ) {
		// 	return methods.init.apply( this, arguments );
		// } else {
		// 	$.error( 'Method ' +  method + ' does not exist on jQuery.slidizle' );
		// }    
	}

})(jQuery);
(function($) {
	// check auto init :
	$.fn.l = $.fn.livequery || $.fn.each;
	if (typeof autoinit != 'undefined' && autoinit.slidizle) {
		var settings = (typeof autoinit.slidizle == 'object') ? autoinit.slidizle : {};
		$('[data-slidizle]').l(function() {
			$(this).slidizle(settings);
		});
	}
})(jQuery);