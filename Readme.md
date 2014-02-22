React Typescript
================

[React](http://facebook.github.io/react/) wrapper to make it play nicely with typescript.

> warning: react typescript can actualy only be used with commonjs module and [browserify](http://browserify.org/), if someone do want AMD I'll gladly accept any PR that would packages it for another format.

Installation
============

```
npm install react-typescript
```

Declarations file for React, React addons, and ReactTypescript can also be found in the declarations folder.

Usage
=====

## Basic

To create a React component using ReactTypescript, simply extends `ReactComponentBase` :

```typescript
import React = require('react');
import ReactTypescript = require('react-typescript');

class HelloMessage extends ReactTypescript.ReactComponentBase<{ name: string; }, {}> {
  render() {
    return React.DOM.div(null, 'Hello ' + this.props.name);
  }
}

React.renderComponent(new HelloMessage({ name: 'Jhon' }), mountNode);
```

the 2 generic type passed to ReactComponentBase correspond to the desired type for the 'props' and 'state' of a react component.

## Mixins

To use mixins simply use the `applyMixins` static method of `ReactComponentBase`

```typescript
import React = require('react');
import ReactTypescript = require('react-typescript');

class HelloMessage extends ReactTypescript.ReactComponentBase<{ name: string; }, {}> {
  getGreetMessage:(name: string) => string
  render() {
    return React.DOM.div(null, this.getGreetMessage(this.props.name));
  }
}
HelloMessage.applyMixins({
  getGreetMessage(name: string) {
    return 'Hello ' + name;
  }
});

```

## AutoBind Methods

In react methods are autobounds to a component, this is not the case when using ReactTypecript, to activate this behavious you can use the `autoBindMethods` function of react typescript

```typescript

class MyComponent extends  ReactTypescript.ReactComponentBase<any, any> {
 //etc ...
}

ReactTypeScript.autoBindMethods(MyComponent);
```

However you can also use the TypeScript way with property assigned to fat arrow function.







