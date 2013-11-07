var Component = require('hive-component');
var path = require('path');
var util = require('util');
var _DEBUG = true;

module.exports = function (apiary, callback){

	var _mixins = {

	};

	function Layout(root) {
		function _load(cb) {
			var ll = require('./loaders/layout_loader')(this);
			ll.core(apiary);
			ll.load(function () {
				cb();
			})
		}

		function _static(cb) {
			var static = this.get_config('static');
			if (static) {
				this.static = apiary.Static({}, {
					map:  static,
					root: path.resolve(this.get_config('root'), 'static')
				});
				this.static.init();
			}
			cb();
		}

		function _enlist(cb) {
            var layout_model = apiary.model('$layouts');
			var root = this.get_config('root');
			if (!root) {
				if (_DEBUG) {
					console.log('attempting to enlist layout - no root');
				}
				root = this.component_id; // gotta have something...
			}
			this.$root = root;

            if (_DEBUG) {
                console.log('enlisting layout %s root %s', this.name, root);
            }

			var existing_root = layout_model.get(root);
			if (existing_root) {
				throw new Error('redundant layout for root %s', root);
			}
			if (_DEBUG) {
				console.log('putting a layout %s - %s in the model',this.name, root);
			}
            layout_model.put(this);
			cb();
		}

		function _emit(cb) {
			if (_DEBUG) {
				console.log('emitting layout %s', this.get_config('root'));
			}
			apiary.emit('layout', this);
			cb();
		}


		if (_DEBUG) {
			console.log('Layout: creating a layout for %s', root);
		}
		return Component(_mixins, {
			root:       root,
			init_tasks: [
				_load,
				_enlist,
				_static,
				_emit]
			,
            apiary: apiary});
	}

    apiary.Layout = Layout;

    callback();

};
