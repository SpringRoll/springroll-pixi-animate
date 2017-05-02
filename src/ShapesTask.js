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