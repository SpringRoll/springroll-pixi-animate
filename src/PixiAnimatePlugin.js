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