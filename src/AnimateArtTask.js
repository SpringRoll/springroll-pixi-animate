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