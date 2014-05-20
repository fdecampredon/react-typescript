React Typescript
================

[React](http://facebook.github.io/react/) wrapper to make it play nicely with typescript.

> warning: ReactTypescript can actualy only be used with commonjs modules and [browserify](http://browserify.org/), if someone does want AMD I'll gladly accept any PR that would packages it for another format.

Installation
============

react-typescript is dependent on `npm` so just have to install [Node.js](http://nodejs.org/).
```
npm install git://github.com/fdecampredon/react-typescript.git#no-constructor
#npm install  react-typescript (not published yet since this is alpha)
```

After installing react-typescript with npm, download the declaration files for React, React addons, and ReactTypescript from /Declaration.

Usage
=====

## Basic

To create a React component using ReactTypescript, simply extends `ReactComponentBase` , then pass your definition to `ReactTypescript.toReactComponent`  :

```typescript
import React = require('react');
import ReactTypescript = require('react-typescript');

class HelloMessageDefinition extends ReactTypescript.ReactComponentBase<{ name: string; }, {}> {
  render() {
    return React.DOM.div(null, 'Hello ' + this.props.name);
  }
}

var HelloMessage = ReactTypescript.toReactComponent(HelloMessageDefinition);

React.renderComponent(HelloMessage({ name: 'Jhon' }), mountNode);
```

the 2 generic types passed to ReactComponentBase correspond to the desired type for the 'props' and 'state' of a react component.

## Mixins

To use mixins simply use the `applyMixins` static method of `ReactComponentBase`

```typescript
import React = require('react');
import ReactTypescript = require('react-typescript');

class HelloMessageDefinition extends ReactTypescript.ReactComponentBase<{ name: string; }, {}> {
  getGreetMessage:(name: string) => string
  render() {
    return React.DOM.div(null, this.getGreetMessage(this.props.name));
  }
}
HelloMessageDefinition.applyMixins({
  getGreetMessage(name: string) {
    return 'Hello ' + name;
  }
});

var HelloMessage = ReactTypescript.toReactComponent(HelloMessageDefinition);

```






