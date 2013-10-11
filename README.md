hive_layout
===========

A foundational frame for adding a layout to your pages

hive_layout uses a post-render filter to encase action output in a page wrapper. `action` level `$out` parameters are exposed to the layout. 

To choose which template to use set the `layout_name` configuration property. This property can be sat at:

* the `hive` configuration file
* the `action` configuration file
* the action's `$out' property

If this property is unset, no layout will be used. 

Also, layouts are only applied to HTML output; data that is sent via `context.$send` (or actions without a template) will not be affected by hive_layout.
