'use strict';

import React = require('react/addons');
import ReactTypeScript = require('react-typescript');
import Todo = require('./todo');
import Utils = require('./utils');
import routes = require('./routes');

var html = React.DOM;


class TodoFooter extends ReactTypeScript.ReactComponentBase<TodoFooter.Props, TodoFooter.State> {
    render() {
        var activeTodoWord = Utils.pluralize(this.props.count, 'item');
        var clearButton: React.ReactComponent<any, any> = null;

        if (this.props.completedCount > 0) {
            clearButton = html.button(
                {
                    id: "clear-completed",
                    onClick: this.props.onClearCompleted
                }, 
                "Clear completed (",this.props.completedCount,")"
            );
        }

        // React idiom for shortcutting to `classSet` since it'll be used often
        var cx = React.addons.classSet;
        var nowShowing = this.props.nowShowing;
        return (
            html.footer( {id:"footer"}, 
                html.span( {id:"todo-count"}, 
                    html.strong(null, this.props.count), " ", activeTodoWord, " left"
                ),
                html.ul( 
                    {id:"filters"}, 
                    html.li(null, 
                        html.a(
                            {href: "#/", className: cx({selected: nowShowing === routes.ALL_TODOS})}, 
                            "All"
                        )
                    ),
                    ' ',
                    html.li(null, 
                        html.a(
                            {href: "#/active", className:cx({selected: nowShowing === routes.ACTIVE_TODOS})}, 
                            "Active"
                        )
                    ),
                    ' ',
                    html.li(null, 
                        html.a(
                            {href: "#/completed", className:cx({selected: nowShowing === routes.COMPLETED_TODOS})}, 
                            "Completed"
                        )
                    )
                ),
                clearButton
            )
        );
    }
}

module TodoFooter {
    export interface Props {
        count: number;
        completedCount: number;
        onClearCompleted: () => void;
        nowShowing: string;
    }
    export interface State {
    }
}

export = TodoFooter;