/* jshint node:true */

'use strict';

var invariant = require('react/lib/invariant'),
    React = require('react');

var arrProto = Array.prototype,
    slice = Function.call.bind(arrProto.slice);

function assign(target, sources) {
    if (!Array.isArray(sources)) {
        sources = Array.prototype.slice.call(arguments, 1);
    }
    sources.forEach(function (object) {
        if (typeof object === 'object') {
            Object.keys(object).reduce(function(target, key) {
                target[key] = object[key];
                return target;
            }, target);   
        }    
    });
    return target;
}
    
function ReactComponentBase() {}

ReactComponentBase.prototype = Object.prototype;

//simply add 
ReactComponentBase.applyMixins = function applyMixins(mixins)  {
    mixins = slice(arguments);
    invariant(
        this === ReactComponentBase,
        'You should not define mixins on ReactComponentBase'
    );
    
    invariant(
        mixins && mixins.length > 0,
        'You should provide at least one mixin'
    );
    this.mixins = (this.mixins || []).concat(mixins);
};

ReactComponentBase.addPropTypes = function setPropTypes(propTypes)  {
    
    invariant(
        this === ReactComponentBase,
        'You should not define propTypes on ReactComponentBase'
    );
    
    invariant(
        typeof propTypes === 'object' > 0,
        'You should provide at least one mixin'
    );
    this.propTypes = assign({}, this.propTypes, propTypes);
};

exports.ReactComponentBase = ReactComponentBase;

function createReactComponent(componentClass) {
    var proto = componentClass.prototype,
        protoChain = [];
    
    //first we get all prototype in the proto chain, to merge them in the spec
    do {
        protoChain.unshift(proto);
        proto = Object.getPrototypeOf(proto);
    } while (proto && proto !== Object.prototype);
    
    var accessorsProperties = {};
    
    var spec = protoChain.reduce(function (spec, proto) {
        Object.keys(proto).reduce(function (spec, key) {
            var descriptor = Object.getOwnPropertyDescriptor(spec, key);
            //getter and setter are quite common in typescript we cannot let them go in the spec
            // so we retrive the descriptors to apply them to the obtained prototype after `createClass`
            if (descriptor.get || descriptor.set) {
                accessorsProperties[key] = descriptor;
            } else {
                spec[key] = proto[key];
            }
            return spec;
        }, spec);
        
        return spec;
    }, {});
    
    //copy all static in the 'statics' property of the chain
    spec.statics = Object.keys(componentClass).reduce(function (statics, key) {
        //mixin is a special case we copy it in the spec
        if (key === 'mixins') {
            spec.mixins = componentClass.mixins.slice();
        //propTypes is a special case we copy it in the spec
        } else if (key === 'propTypes') {
            spec.propTypes = assign({}, componentClass.propTypes);
        } else {
           statics = componentClass[key];
        }
    }, {});
    
    
    var componentFactory = React.createClass(spec);
    
    //redefine properties with accessor on the prototype of the obained component
    Object.keys(accessorsProperties).reduce(function (componentProto, key) {
        Object.defineProperty(componentProto, key, accessorsProperties[key]);
        return componentProto;
    }, componentFactory.constructor.prototype);
    
    //we need to apply the original constructor, at leasr for properties with default value
    //we create wrapper function that call the original componentFactory then apply the constructor
    var typeScriptComponentFactory = function () {
        var component = componentFactory.apply(undefined, arguments);
        componentClass.call(component);
        return component;
    };
    
    //our wrapper should have all the properties of the original componentFactory for react integration
    Object.keys(componentFactory).forEach(function (typeScriptComponentFactory, key) {
        typeScriptComponentFactory[key] = componentFactory[key];
    });
    return typeScriptComponentFactory;
}

exports.createReactComponent = createReactComponent;


