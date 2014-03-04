/* jshint node:true */

'use strict';

var invariant = require('react/lib/invariant'),
  React = React || require('react'),
  reactInternal = require('./third_party/react-internal'),
  mixSpecIntoComponent = reactInternal.mixSpecIntoComponent,
  ReactCompositeComponentInterface  = reactInternal.ReactCompositeComponentInterface,
  bindMethod = reactInternal.bindMethod;
    
function ReactComponentBase() {
}

ReactComponentBase.applyMixins = function applyMixins(mixins)  {
  mixins = Array.prototype.slice.call(arguments);
  invariant(
      mixins && mixins.length > 0,
      'You should provide at least one mixin'
  );
  for (var i = 0; i < mixins.length; i++) {
      mixSpecIntoComponent(this, mixins[i]);
  }
};

/*ReactComponentBase.prototype = React.createClass( { render: function () {} }).componentConstructor.prototype;
if ("production" !== process.env.NODE_ENV) {
    //debug membrne is really not compatible with our way of doing things
    ReactComponentBase.prototype = Object.getPrototypeOf(ReactComponentBase.prototype);
}
delete ReactComponentBase.prototype.render;*/

exports.ReactComponentBase = ReactComponentBase;

function toReactComponent(componentClass) {
    delete componentClass.prototype.constructor;
    var componentFactory = React.createClass(componentClass.prototype);
    var typeScriptComponentFactory = function () {
        var component = componentFactory.apply(this, arguments);
        componentClass.call(component);
        return component;
    };
    
    Object.keys(componentFactory).forEach(function (typeScriptComponentFactory, key) {
        typeScriptComponentFactory[key] = componentFactory[key];
    });
    return typeScriptComponentFactory;
    
}

exports.toReactComponent = toReactComponent;


