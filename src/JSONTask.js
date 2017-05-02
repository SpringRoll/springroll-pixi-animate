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