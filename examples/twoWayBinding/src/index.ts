'use strict'

import React = require('react/addons');
import ReactTypeScript = require('react-typescript');

var html = React.DOM;



class Input extends ReactTypeScript.ReactComponentBase<{}, Input.State> {
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
module Input {
    export interface State {
        value: string;
    }
}

Input.applyMixins((<any>React.addons).LinkedStateMixin);

React.renderComponent(
    new Input({}),
    document.getElementById('main')
);