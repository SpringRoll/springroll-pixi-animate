/*! SpringRoll Pixi Animate 1.0.0 */
/**
 * @module SpringRoll Plugin
 * @namespace springroll.pixi.animate
 * @requires Pixi Flash
 */
(function(undefined)
{
	var Debug;

	/**
	 * Handles the Asset loading for Pixi Animate art, takes care of unloading
	 * @class AnimateArt
	 * @constructor
	 * @private
	 * @param {String} id The asset id
	 * @param {NodeElement} dom The `<script>` element added to the document
	 * @param {String} [libName='lib'] The window parameter name
	 * @param {Boolean} [suppressWarnings=false] Should we hide 'animate asset collision' warnings
	 */
	var AnimateArt = function(id, dom, libName, suppressWarnings)
	{
		if (true && Debug === undefined)
		{
			Debug = include('springroll.Debug', false);
		}

		/**
		 * Reference to the node element
		 * @property {NodeElement} dom
		 */
		this.dom = dom;

		/**
		 * The collection of loaded symbols by name
		 * @property {Array} symbols
		 */
		this.symbols = [];

		/**
		 * The name of the output lib name
		 * @property {String} libName
		 * @default 'lib'
		 */
		this.libName = libName || 'lib';

		/**
		 * The name of the output lib name
		 * @property {String} id
		 */
		this.id = id;

		// Parse the dom object
		this.parseSymbols(dom.text, suppressWarnings);

		/**
		 * The collection of additional loaded assets (shapes, textures, atlases) with destroy methods.
		 * @property {Array} assets
		 */
		this.assets = [];
	};

	// Reference to the prototype
	var p = AnimateArt.prototype;

	/**
	 * The collection of all symbols and assets
	 * @property {Object} globalSymbols
	 * @static
	 * @private
	 */
	AnimateArt.globalSymbols = {};

	/**
	 * Get the name of all the library elements of the dom text
	 * @method parseSymbols
	 * @param {String} text The DOM text contents
	 * @param {Boolean} suppressWarnings	Should we hide 'animate asset collision' warnings (default false)
	 */
	p.parseSymbols = function(text, suppressWarnings)
	{
		// split into the initialization functions, that take 'lib' as a parameter
		var textArray = text.split(/[\(!]function\s*\(/);

		var globalSymbols = FlashArt.globalSymbols;
		// go through each initialization function
		for (var i = 0; i < textArray.length; ++i)
		{
			text = textArray[i];
			if (!text) continue;

			// determine what the 'lib' parameter has been minified into
			var libName = text.substring(text.indexOf(",") + 1, text.indexOf(")")).trim();
			if (!libName) return;

			// get all the things that are 'lib.X = <stuff>'
			var varFinder = new RegExp("\\(" + libName + ".(\\w+)\\s*=", "g");
			var foundName = varFinder.exec(text);
			var assetId;

			while (foundName)
			{
				assetId = foundName[1];

				// Warn about collisions with assets that already exist
				if (true && Debug && globalSymbols[assetId] && !suppressWarnings)
				{
					Debug.warn(
						"Animate Asset Collision: asset '" + this.id +
						"' wants to create 'lib." + assetId +
						"' which is already created by asset '" +
						AnimateArt.globalSymbols[assetId] + "'"
					);
				}

				// keep track of the asset id responsible
				this.symbols.push(assetId);
				globalSymbols[assetId] = this.id;
				foundName = varFinder.exec(text);
			}
		}
	};

	p.getAssetList = function(stageIds)
	{
		var lib = window[this.libName];
		var assets = {};
		for (var i = 0; i < stageIds.length; ++i)
		{
			var stageAssets = lib[stageIds[i]];
			for (var id in stageAssets)
			{
				assets[id] = stageAssets[id];
			}
		}
		return assets;
	};

	/**
	 * Cleanup the Animate library that's been loaded
	 * @method destroy
	 */
	p.destroy = function()
	{
		// remove the <script> element from the stage
		this.dom.parentNode.removeChild(this.dom);
		this.dom = null;

		// Delete the elements
		var globalSymbols = FlashArt.globalSymbols;
		var lib = window[this.libName];
		this.symbols.forEach(function(id)
		{
			delete globalSymbols[id];
			delete lib[id];
		});
		this.symbols = null;
		this.assets.forEach(function(asset)
		{
			asset.destroy();
		});
		this.assets = null;
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').AnimateArt = AnimateArt;

}());
/**
 * @module SpringRoll Plugin
 * @namespace springroll.pixi.animate
 * @requires Pixi Animate
 */
(function()
{
	var Task = include('springroll.Task'),
		AnimateArt = include('springroll.pixi.animate.AnimateArt'),
		TextureAtlas = include('springroll.pixi.TextureAtlas'),
		Texture = include('PIXI.Texture');

	/**
	 * Loads a AnimateArt, making it easier to load and unload springroll.pixi.animate art.
	 * @class AnimateArtTask
	 * @extends springroll.Task
	 * @constructor
	 * @private
	 * @param {Object} asset The data properties
	 * @param {String} asset.type Asset type must be "pixi"
	 * @param {String} asset.format Asset format must be "springroll.pixi.animate.AnimateArt"
	 * @param {String} asset.src The source
	 * @param {Array} asset.images An array of Image, TextureAtlas, or SpriteSheet assets to load
	 * @param {Boolean} [asset.cache=false] If we should cache the result
	 * @param {String} [asset.id] Id of asset
	 * @param {String[]} [asset.stageIds] Array of stage ids within file (one per FLA/XFL).
	 *                                    Defaults to the asset id.
	 * @param {Function} [asset.complete] The event to call when done
	 * @param {Object} [asset.sizes=null] Define if certain sizes are not supported
	 */
	var AnimateArtTask = function(asset)
	{
		Task.call(this, asset, asset.src);

		/**
		 * The path to the animate asset
		 * @property {String} src
		 */
		this.src = this.filter(asset.src);

		/**
		 * The name of the window object library items hang on
		 * @property {String} libName
		 */
		this.libName = "lib";

		/**
		 * Array of stage ids within file (one per FLA/XFL). Defaults to the asset id.
		 * @property {String[]} stageIds
		 */
		this.stageIds = asset.stageIds || [this.id];

		/**
		 * Do we suppress 'animate asset collision' warnings?
		 * @property {Boolean} suppressWarnings
		 */
		this.suppressWarnings = !!asset.suppress;
	};

	// Reference to prototype
	var p = extend(AnimateArtTask, Task);

	/**
	 * Test if we should run this task
	 * @method test
	 * @static
	 * @param {Object} asset The asset to check
	 * @return {Boolean} If the asset is compatible with this asset
	 */
	AnimateArtTask.test = function(asset)
	{
		return asset.src &&
			asset.src.search(/\.js$/i) > -1 &&
			asset.type == "pixi" &&
			asset.format == "springroll.pixi.animate.AnimateArt";
	};

	/**
	 * Start the task
	 * @method  start
	 * @param  {Function} callback Callback when finished
	 */
	p.start = function(callback)
	{
		var atlas, assetCount = 0;
		var asset;

		var assets = {
			_animate : this.src
		};

		// Load the javascript
		this.load(assets, function(results)
		{
			var art = new AnimateArt(
				this.id,
				results._animate,
				this.libName,
				this.suppressWarnings
			);

			var assetList = art.getAssetList(this.stageIds);

			var baseUrl = this.src.substring(0, this.src.lastIndexOf('/')+1);

			var assets = [];
			for (var id in assetList)
			{
				var url = assetList[url];
				var asset = {
					id: id,
					type: 'pixi'
				};
				if (/\.(png|jpg|jpeg|webp)$/.test(url))
				{
					asset.image = baseUrl + url;
				}
				else if (/\.json$/.test(url))
				{
					asset.src = baseUrl + url;
					asset.format = 'springroll.pixi.animate.JSONAsset';
				}
				else if (/\.txt$/.test(url))
				{
					asset.src = baseUrl + url;
					asset.format = 'springroll.pixi.animate.Shapes';
				}
				assets.push(asset);
			}

			//load sub assets
			this.load(assets, function(results)
			{
				//assuming a dictionary, shoul also cover an array
				for (var id in results)
				{
					art.assets.push(results[id]);
				}
				callback(art);
			}.bind(this));

		}.bind(this));
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').AnimateArtTask = AnimateArtTask;

}());
(function()
{
	var ShapesCache = include('PIXI.animate.ShapesCache');

	var Shapes = function(id, data)
	{
		this.id = id;
		ShapesCache.add(id, data);
	};

	Shapes.prototype.destroy = function()
	{
		ShapesCache.remove(this.id);
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').Shapes = Shapes;

}());
(function()
{
	var LoadTask = include('springroll.LoadTask'),
		Spritesheet = include('PIXI.Spritesheet'),
		Shapes = include('springroll.pixi.animate.Shapes');

	/**
	 * Loads either a spritesheet generated from Animate and the image that it uses, or a JSON
	 * containing vector art information.
	 * @class JSONTask
	 * @extends springroll.LoadTask
	 * @constructor
	 * @private
	 * @param {Object} asset The data properties
	 * @param {String} asset.type Asset type must be "pixi"
	 * @param {String} asset.format Asset format must be "springroll.pixi.animate.JSONAsset"
	 * @param {String} asset.src The source
	 * @param {Boolean} [asset.cache=false] If we should cache the result
	 * @param {String} [asset.id] Id of asset
	 * @param {Function} [asset.complete] The event to call when done
	 * @param {Object} [asset.sizes=null] Define if certain sizes are not supported
	 */
	var JSONTask = function(asset)
	{
		LoadTask.call(this, asset, asset.src);
	};

	// Reference to prototype
	var s = LoadTask.prototype;
	var p = extend(JSONTask, LoadTask);

	/**
	 * Test if we should run this task
	 * @method test
	 * @static
	 * @param {Object} asset The asset to check
	 * @return {Boolean} If the asset is compatible with this asset
	 */
	JSONTask.test = function(asset)
	{
		return asset.src &&
			asset.src.search(/\.json$/i) > -1 &&
			asset.type == "pixi" &&
			asset.format == "springroll.pixi.animate.JSONAsset";
	};

	/**
	 * Start the task
	 * @method  start
	 * @param  {Function} callback Callback when finished
	 */
	p.start = function(callback)
	{
		this.load(this.src, function(data)
		{
			//see if it is a spritesheet
			if (data.frames && data.meta && data.meta.image)
			{
				var baseUrl = this.src.substring(0, this.src.lastIndexOf('/')+1);
				this.load({
					image: baseUrl + data.meta.image,
					type: 'pixi'
				}, function(texture)
				{
					var spritesheet = new Spritesheet(texture.baseTexture, data);
					//dump the texture itself, we just wanted the base texture
					texture.destroy();
					spritesheet.parse(function()
					{
						callback(spritesheet);
					});
				});
			}
			else
			{
				//assumed to be vector art
				callback(new Shapes(this.id, data));
			}
		}
		.bind(this));
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').JSONTask = JSONTask;

}());
(function()
{
	var LoadTask = include('springroll.LoadTask'),
		Shapes = include('springroll.pixi.animate.Shapes');

	/**
	 * Loads a text file containing vector art information.
	 * @class ShapesTask
	 * @extends springroll.LoadTask
	 * @constructor
	 * @private
	 * @param {Object} asset The data properties
	 * @param {String} asset.type Asset type must be "pixi"
	 * @param {String} asset.format Asset format must be "springroll.pixi.animate.ShapesAsset"
	 * @param {String} asset.src The source
	 * @param {Boolean} [asset.cache=false] If we should cache the result
	 * @param {String} [asset.id] Id of asset
	 * @param {Function} [asset.complete] The event to call when done
	 * @param {Object} [asset.sizes=null] Define if certain sizes are not supported
	 */
	var ShapesTask = function(asset)
	{
		LoadTask.call(this, asset, asset.src);
	};

	// Reference to prototype
	var s = LoadTask.prototype;
	var p = extend(ShapesTask, LoadTask);

	/**
	 * Test if we should run this task
	 * @method test
	 * @static
	 * @param {Object} asset The asset to check
	 * @return {Boolean} If the asset is compatible with this asset
	 */
	ShapesTask.test = function(asset)
	{
		return asset.src &&
			asset.src.search(/\.(txt|json)$/i) > -1 &&
			asset.type == "pixi" &&
			asset.format == "springroll.pixi.animate.Shapes";
	};

	/**
	 * Start the task
	 * @method  start
	 * @param  {Function} callback Callback when finished
	 */
	p.start = function(callback)
	{
		this.load(this.src, function(data)
		{
			callback(new Shapes(this.id, data));
		}.bind(this));
	};

	// Assign to namespace
	namespace('springroll.pixi.animate').ShapesTask = ShapesTask;

}());
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
/**
 * @module SpringRoll Plugin
 * @namespace springroll.pixi.animate
 * @requires Pixi Flash
 */
(function()
{
	// Include classes
	var ApplicationPlugin = include('springroll.ApplicationPlugin');

	// Create a new plugin
	var plugin = new ApplicationPlugin();

	plugin.setup = function()
	{
		this.assetManager.register('springroll.pixi.animate.FlashArtTask', 60);
		this.assetManager.register('springroll.pixi.animate.SpriteSheetTask', 70);
		this.animator.register('springroll.pixi.animate.MovieClipInstance', 10);
	};

}());