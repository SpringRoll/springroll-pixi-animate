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