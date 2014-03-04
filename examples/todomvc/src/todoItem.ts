'use strict';


import React = require('react/addons');
import ReactTypeScript = require('react-typescript');
import Todo = require('./todo');


var html = React.DOM;
var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

export class Definition extends ReactTypeScript.ReactComponentBase<Props, State> {
    
    getEditField() {
        return this.refs && <HTMLInputElement>this.refs['editField'].getDOMNode()
    }
    
    handleSubmit() {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({editText: val});
        } else {
            this.props.onDestroy();
        }
        return false;
    }
    
    handleEdit() {
        // react optimizes renders by batching them. This means you can't call
        // parent's `onEdit` (which in this case triggeres a re-render), and
        // immediately manipulate the DOM as if the rendering's over. Put it as a
        // callback. Refer to app.js' `edit` method
        this.props.onEdit(() => {
            this.getEditField().focus();
            this.getEditField().setSelectionRange(this.getEditField().value.length, this.getEditField().value.length);
        });
        this.setState({editText: this.props.todo.title});
    }
    
    handleKeyDown(event: React.KeyboardEvent) {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: this.props.todo.title});
            this.props.onCancel();
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit();
        }
    }
    
    
    handleChange(event: React.SyntheticEvent) {
        this.setState({editText: this.getEditField().value});
    }

    getInitialState() {
        return {editText: this.props.todo.title};
    }
    
    /**
     * This is a completely optional performance enhancement that you can implement
     * on any React component. If you were to delete this method the app would still
     * work correctly (and still be very performant!), we just use it as an example
     * of how little code it takes to get an order of magnitude performance improvement.
     */
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (
            nextProps.todo !== this.props.todo ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText
        );
    }
    
    
    render() {
        return (
            html.li({
                    className: React.addons.classSet({
                        completed: this.props.todo.completed,
                        editing: this.props.editing
                    })
                }, 
                html.div( {className:"view"}, 
                    React.DOM.input({
                        className:"toggle",
                        type:"checkbox",
                        checked:this.props.todo.completed,
                        onChange:this.props.onToggle
                    }),
                    React.DOM.label({ onDoubleClick:this.handleEdit }, this.props.todo.title),
                    React.DOM.button({className:"destroy", onClick:this.props.onDestroy})
                ),
                html.input({
                    ref:"editField",
                    className:"edit",
                    value:this.state.editText,
                    onBlur:this.handleSubmit,
                    onChange:this.handleChange,
                    onKeyDown:this.handleKeyDown
                })
            )
        );
    }
}

export interface Props {
    onSave: (val: string) => void;
    onDestroy: () => void;
    onEdit: (callback: () => void)  => void;
    onCancel: () => void;
    todo: Todo;
    onToggle: () => void;
    editing?: boolean;
}

export interface State {
    editText: string
}


export var TodoItem = ReactTypeScript.toReactComponent(Definition);