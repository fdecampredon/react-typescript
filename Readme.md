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

the 2 generic types passed to ReactComponentBase correspond to the desired type for the 'props' and 'state' of a react component.

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

In react, methods are automaticly bound to a component, this is not the case when using ReactTypecript, to activate this behavious you can use the `autoBindMethods` function of ReactTypescript :

```typescript

class MyButton extends  ReactTypeScript.ReactComponentBase<{ message: string}, any> {
    clickHandler(event: React.MouseEvent) {
        alert(this.props.message);
    }
    
    render() {
        return React.DOM.button({ onClick: this.clickHandler }, 'Click Me');
    }
}

ReactTypeScript.autoBindMethods(MyComponent);
```

However you can also use the TypeScript way with a property assigned to fat arrow function: 

```typescript
class MyButton extends  ReactTypeScript.ReactComponentBase<{ message: string}, any> {
    clickHandler = (event: React.MouseEvent) => {
        alert(this.props.message);
    }
    
    render() {
        return React.DOM.button({ onClick: this.clickHandler }, 'Click Me');
    }
}
```

> Mixins methods are always automaticly bound






