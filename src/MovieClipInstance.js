/**
 * @module SpringRoll Plugin
 * @namespace springroll.pixi.animate
 * @requires Pixi Animate
 */
(function(undefined)
{
	var MovieClip = include('PIXI.animate.MovieClip');
	var AnimatorInstance = include('springroll.AnimatorInstance');
	var Animator = include('PIXI.animate.Animator');
	var Application = include("springroll.Application");

	/**
	 * The plugin for working with movieclip and animator
	 * @class MovieClipInstance
	 * @extends springroll.AnimatorInstance
	 * @private
	 */
	var MovieClipInstance = function()
	{
		AnimatorInstance.call(this);

		/**
		 * The start time of the current animation on the movieclip's timeline.
		 * @property {Number} startTime
		 */
		this.startTime = 0;

		/**
		 * Length of current animation in frames.
		 * @property {int} length
		 */
		this.length = 0;

		/**
		 * The frame number of the first frame of the current animation. If this is -1, then the
		 * animation is currently a pause instead of an animation.
		 * @property {int} firstFrame
		 */
		this.firstFrame = -1;

		/**
		 * The frame number of the last frame of the current animation.
		 * @property {int} lastFrame
		 */
		this.lastFrame = -1;
	};

	/**
	 * Required to test clip
	 * @method test
	 * @static
	 * @param {*} clip The object to test
	 * @return {Boolean} If the clip is compatible with this plugin
	 */
	MovieClipInstance.test = function(clip)
	{
		return clip instanceof MovieClip;
	};

	/**
	 * Checks if animation exists
	 * @method hasAnimation
	 * @static
	 * @param {*} clip The clip to check for an animation.
	 * @param {String} event The frame label event (e.g. "onClose" to "onClose_stop")
	 * @return {Boolean} does this animation exist?
	 */
	GenericMovieClipInstance.hasAnimation = function(clip, event)
	{
		//the wildcard event plays the entire timeline
		if (event == "*" && !clip.labelsMap[event])
		{
			return true;
		}

		var startFrame = -1;
		var stopFrame = -1;
		var stopLabel = event + Animator.STOP_LABEL;
		var loopLabel = event + Animator.LOOP_LABEL;
		startFrame = instance.labelsMap[label];
		stopFrame = instance.labelsMap[label + Animator.STOP_LABEL];
		if (stopFrame === -1) {
			stopFrame = instance.labelsMap[label + Animator.LOOP_LABEL];
		}
		return startFrame >= 0 && stopFrame > 0;
	};

	/**
	 * Calculates the duration of an animation or list of animations.
	 * @method getDuration
	 * @static
	 * @param  {*} clip The clip to check.
	 * @param  {String} event The animation or animation list.
	 * @return {Number} Animation duration in milliseconds.
	 */
	GenericMovieClipInstance.getDuration = function(clip, event)
	{
		//make sure the movieclip has a framerate
		if (!clip.framerate)
		{
			clip.framerate = Application.instance.options.fps || 15;
		}

		//the wildcard event plays the entire timeline
		if (event == "*" && !clip.labelsMap[event])
		{
			return clip.totalFrames / clip.framerate * 1000;
		}

		var startFrame = -1;
		var stopFrame = -1;
		var stopLabel = event + Animator.STOP_LABEL;
		var loopLabel = event + Animator.LOOP_LABEL;
		startFrame = instance.labelsMap[label];
		stopFrame = instance.labelsMap[label + Animator.STOP_LABEL];
		if (stopFrame === -1) {
			stopFrame = instance.labelsMap[label + Animator.LOOP_LABEL];
		}
		if (startFrame >= 0 && stopFrame > 0)
		{
			return (stopFrame - startFrame) / clip.framerate * 1000;
		}
		else
		{
			return 0;
		}
	};

	// Inherit the AnimatorInstance
	var s = AnimatorInstance.prototype;
	var p = AnimatorInstance.extend(MovieClipInstance, AnimatorInstance);

	p.init = function(clip)
	{
		//make sure clip has a framerate
		if (!clip.framerate)
		{
			clip.framerate = Application.instance.options.fps || 15;
		}
		clip.selfAdvance = false;
		this.clip = clip;
		this.isLooping = false;
		this.currentName = null;
		this.position = this.duration = 0;
	};

	p.beginAnim = function(animObj, isRepeat)
	{
		//calculate frames, duration, etc
		//then gotoAndPlay on the first frame
		var label = this.currentName = animObj.anim;

		var l, first = -1,
			last = -1,
			loop = false;
		//the wildcard event plays the entire timeline
		if (anim == "*" && !this.clip.labelsMap[anim])
		{
			first = 0;
			last = this.clip.totalFrames - 1;
			loop = !!animObj.loop;
		}
		else
		{
			first = instance.labelsMap[label];
			last = instance.labelsMap[label + Animator.STOP_LABEL];
			if (last === undefined) {
				last = instance.labelsMap[label + Animator.LOOP_LABEL];
				loop = true;
			}
		}

		this.firstFrame = first;
		this.lastFrame = last;
		this.length = last - first;
		this.isLooping = loop;
		var fps = this.clip.framerate;
		this.startTime = this.firstFrame / fps;
		this.duration = this.length / fps;
		if (isRepeat)
		{
			this.position = 0;
		}
		else
		{
			var animStart = animObj.start || 0;
			this.position = animStart < 0 ? Math.random() * this.duration : animStart;
		}

		this.clip.play();
		this.clip.elapsedTime = this.startTime + this.position;
		this.clip.advance();
	};

	/**
	 * Ends animation playback.
	 * @method endAnim
	 */
	p.endAnim = function()
	{
		this.clip.gotoAndStop(this.lastFrame);
	};

	/**
	 * Updates position to a new value, and does anything that the clip needs, like updating
	 * timelines.
	 * @method setPosition
	 * @param  {Number} newPos The new position in the animation.
	 */
	p.setPosition = function(newPos)
	{
		this.position = newPos;
		this.clip.elapsedTime = this.startTime + newPos;
		//because the movieclip only checks the elapsed time here (tickEnabled is false),
		//calling advance() with no parameters is fine - it won't advance the time
		this.clip.advance();
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').MovieClipInstance = MovieClipInstance;

}());