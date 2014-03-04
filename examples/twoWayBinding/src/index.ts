'use strict'

import React = require('react/addons');
import ReactTypeScript = require('react-typescript');

var html = React.DOM;



class InputDefinition extends ReactTypeScript.ReactComponentBase<{}, State> {
    linkState: (state: string) => any;
    getInitialState() {
        return {value: 'Hello!'};
    }
    
    render() {
        var valueLink = this.linkState('value');
        
        return html.div(
            {},
            html.span(null, this.state.value),
            html.input({
                type: 'text', 
                value: valueLink.value, 
                onChange: (event: React.SyntheticEvent) =>{
                    valueLink.requestChange((<HTMLInputElement>event.target).value);
                }
            })
        );
    }
}
export interface State {
    value: string;
}

InputDefinition.applyMixins((<any>React.addons).LinkedStateMixin);


var Input =  ReactTypeScript.toReactComponent(InputDefinition);

React.renderComponent(
    Input({}),
    document.getElementById('main')
);