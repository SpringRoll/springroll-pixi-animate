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
		if (DEBUG && Debug === undefined)
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
				if (DEBUG && Debug && globalSymbols[assetId] && !suppressWarnings)
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