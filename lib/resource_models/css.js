var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Base = require('./base');

/* ************************************
 * note = the css_model that is returned is unique
 * for every request.
 * ************************************ */

/* ******* CLOSURE ********* */

var css_template = _.template("\n<link rel=\"stylesheet\" href=\"<%= url %>\">");

var css_head_template = _.template("\n\n<!-- -------- CSS FOR <%= context %> ---------- -->\n\n");
var css_foot_template = _.template("\n\n<!-- -------- END OF CSS FOR <%= context %> ---------- -->\n\n");

function merge(new_data, old_data){
	if(old_data.defer){
		new_data.defer = true;
	}

	if(!new_data.requires){
		new_data.requires = [];
	}

	if (old_data.requires){
		new_data.requires.push.call(new_data.requires, old_data.requires);
	}

	if(old_data.name){
		new_data.name = old_data.name;
	}

	return new_data;
}

function is_rendered(css){
	if (css.rendered){
		return true;
	}else	if (this.rendered_things[css.url]){
		css.rendered = true;
		return true;
	} else if(css.name){
		if(this.rendered_things[css.name]){
			css.rendered = true;
			return true;
		}
	}
	return false;
}

function find(query){
	return _.filter(this.items, function(item){
		if (query.url && (item.url != query.url)){
			return false;
		}
		if (query.context && (item.context != query.context)){
			return false;
		}

		if (query.name && (item.name != query.name)){
			return false;
		}

		return true;
	})
}

function render(context){
	var csss = this.find({context: context});
	//@TODO: order by requirements
	var out = css_head_template({context: context});
	csss.forEach(function(css){
		if (!this.is_rendered(css)) {
			out += css_template(css);
			css.rendered = true;
		}
	}, this);
	out += css_foot_template({context:context });
	return out;
}

/* ********* EXPORTS ******** */

module.exports = function (apiary) {
	//var alias_model = apiary.model('css_path_alias');

	var model = new Base();
	model.rendered_things = {};

	model.find = find;
	model.is_rendered = is_rendered;
	model.merge = merge;

	model.on('add', function(css){
		if(!css.defer){
			css.defer = false;
		}
		if (!css.requires){
			css.requires = [];
		}
	/*	var alias = alias_model.match(css.url);
		if (alias){
			_.extend(css, alias);
		}*/
	});

	model.render = render;

	return model;
}; // end export function