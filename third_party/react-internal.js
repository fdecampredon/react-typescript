/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/*jshint node: true, eqnull: true */


/* contains extracted internal code from React */

'use strict';

var invariant = require('react/lib/invariant'),
    React = require('react'),
    keyMirror = require('react/lib/keyMirror'),
    ReactPropTypeLocations = require('react/lib/ReactPropTypeLocations'), 
    ReactPropTypeLocationNames = require('react/lib/ReactPropTypeLocationNames'),
    merge = require('react/lib/merge'),
    objMap = require('react/lib/objMap');

var SpecPolicy = keyMirror({
  DEFINE_ONCE: null,
  DEFINE_MANY: null,
  OVERRIDE_BASE: null,
  DEFINE_MANY_MERGED: null
});


var ReactCompositeComponentInterface = {
  mixins: SpecPolicy.DEFINE_MANY,
  statics: SpecPolicy.DEFINE_MANY,
  propTypes: SpecPolicy.DEFINE_MANY,
  contextTypes: SpecPolicy.DEFINE_MANY,
  childContextTypes: SpecPolicy.DEFINE_MANY,
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,
  render: SpecPolicy.DEFINE_ONCE,
  componentWillMount: SpecPolicy.DEFINE_MANY,
  componentDidMount: SpecPolicy.DEFINE_MANY,
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,
  componentWillUpdate: SpecPolicy.DEFINE_MANY,
  componentDidUpdate: SpecPolicy.DEFINE_MANY,
  componentWillUnmount: SpecPolicy.DEFINE_MANY,
  updateComponent: SpecPolicy.OVERRIDE_BASE
};

var ReactCompositeComponentMixin = {
  construct: null,
  isMounted: null,
  mountComponent: null,
  unmountComponent: null,
  setState: null,
  replaceState: null,
  _processContext: null,
  _processChildContext: null,
  _processProps: null,
  _checkPropTypes: null,
  performUpdateIfNecessary: null,
  _performUpdateIfNecessary: null,
  _performComponentUpdate: null,
  receiveComponent: null,
  updateComponent: null,
  forceUpdate: null,
  _renderValidatedComponent: null,
  _bindAutoBindMethods: null,
  _bindAutoBindMethod: null
};

var RESERVED_SPEC_KEYS = {
  displayName: function(Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function(Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function(Constructor, childContextTypes) {
    validateTypeDef(
      Constructor,
      childContextTypes,
      ReactPropTypeLocations.childContext
    );
    Constructor.childContextTypes = merge(
      Constructor.childContextTypes,
      childContextTypes
    );
  },
  contextTypes: function(Constructor, contextTypes) {
    validateTypeDef(
      Constructor,
      contextTypes,
      ReactPropTypeLocations.context
    );
    Constructor.contextTypes = merge(Constructor.contextTypes, contextTypes);
  },
  propTypes: function(Constructor, propTypes) {
    validateTypeDef(
      Constructor,
      propTypes,
      ReactPropTypeLocations.prop
    );
    Constructor.propTypes = merge(Constructor.propTypes, propTypes);
  }, 
  statics: function(Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  }
};

function validateMethodOverride(proto, name) {
  var specPolicy = ReactCompositeComponentInterface[name];

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactCompositeComponentMixin.hasOwnProperty(name)) {
    invariant(
      specPolicy === SpecPolicy.OVERRIDE_BASE,
      'ReactCompositeComponentInterface: You are attempting to override ' +
      '`%s` from your class specification. Ensure that your method names ' +
      'do not overlap with React methods.',
      name
    );
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (proto.hasOwnProperty(name)) {
    invariant(
      specPolicy === SpecPolicy.DEFINE_MANY ||
      specPolicy === SpecPolicy.DEFINE_MANY_MERGED,
      'ReactCompositeComponentInterface: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be due ' +
      'to a mixin.',
      name
    );
  }
}

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      invariant(
        typeof typeDef[propName] == 'function',
        '%s: %s type `%s` is invalid; it must be a function, usually from ' +
        'React.PropTypes.',
        Constructor.displayName || 'ReactCompositeComponent',
        ReactPropTypeLocationNames[location],
        propName
      );
    }
  }
}



/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    return mergeObjectsWithNoDuplicateKeys(a, b);
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}


/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeObjectsWithNoDuplicateKeys(one, two) {
  invariant(
    one && two && typeof one === 'object' && typeof two === 'object',
    'mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects'
  );

  objMap(two, function(value, key) {
    invariant(
      one[key] === undefined,
      'mergeObjectsWithNoDuplicateKeys(): ' +
      'Tried to merge two objects with the same key: %s',
      key
    );
    one[key] = value;
  });
  return one;
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name) || !property) {
      return;
    }

    var isInherited = name in Constructor;
    var result = property;
    if (isInherited) {
      var existingProperty = Constructor[name];
      var existingType = typeof existingProperty;
      var propertyType = typeof property;
      invariant(
        existingType === 'function' && propertyType === 'function',
        'ReactCompositeComponent: You are attempting to define ' +
        '`%s` on your component more than once, but that is only supported ' +
        'for functions, which are chained together. This conflict may be ' +
        'due to a mixin.',
        name
      );
      result = createChainedFunction(existingProperty, property);
    }
    Constructor[name] = result;
  }
}


/**
 * Custom version of `mixInto` which handles policy validation and reserved
 * specification keys when building `ReactCompositeComponent` classses.
 */
function mixSpecIntoComponent(Constructor, spec) {
  invariant(
    !React.isValidClass(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component class as a mixin. Instead, just use a regular object.'
  );
  invariant(
    !React.isValidComponent(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component as a mixin. Instead, just use a regular object.'
  );

  var proto = Constructor.prototype;
  for (var name in spec) {
    var property = spec[name];
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    validateMethodOverride(proto, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactCompositeComponent methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isCompositeComponentMethod = name in ReactCompositeComponentInterface;
      var isInherited = name in proto;
      var markedDontBind = property && property.__reactDontBind;
      var isFunction = typeof property === 'function';
      var shouldAutoBind =
        isFunction &&
        !isCompositeComponentMethod &&
        !isInherited &&
        !markedDontBind;

      if (shouldAutoBind) {
        bindMethod(proto, name, property);
      } else {
        if (isInherited) {
          // For methods which are defined more than once, call the existing
          // methods before calling the new property.
          if (ReactCompositeComponentInterface[name] ===
              SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
        }
      }
    }
  }
}

function bindMethod(proto, name, func) {
  if (!proto.__reactAutoBindMap) {
    proto.__reactAutoBindMap = {};
  }
  if (!proto.hasOwnProperty('__reactAutoBindMap')) {
    var __parentReactAutoBindMap = proto.__reactAutoBindMap;
    proto.__reactAutoBindMap = {};
    for (var propName in __parentReactAutoBindMap) {
      proto[propName] = __parentReactAutoBindMap[propName];
    }
  }
  proto.__reactAutoBindMap[name] = func;
  proto[name] = func;
}

module.exports = {
  mixSpecIntoComponent: mixSpecIntoComponent,
  ReactCompositeComponentInterface: ReactCompositeComponentInterface,
  bindMethod: bindMethod
};

