var hive_loader = require('hive-loader');
var layout_handler = require('./../handlers/layout_handler');
var _DEBUG = false;

module.exports = function(root){
	return hive_loader.loader({}, {root: root, handlers: [layout_handler()]})
}