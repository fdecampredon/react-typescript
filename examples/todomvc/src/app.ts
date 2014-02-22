'use strict';

import React = require('react/addons');
import ReactTypeScript = require('react-typescript');
import Todo = require('./todo');
import Utils = require('./utils');
import routes = require('./routes');
import TodoModel = require('./todoModel');
import TodoFooter = require('./footer');
import TodoItem = require('./todoItem');

//todo
declare var require: any;
var Router: any = require('director').Router;

var html = React.DOM;
var ENTER_KEY = 13;

class TodoApp extends ReactTypeScript.ReactComponentBase<TodoApp.Props, TodoApp.State> {
    get newField() {
        return this.refs && <HTMLInputElement>this.refs['newField'].getDOMNode()
    }

    getInitialState() {
        return {
            nowShowing: routes.ALL_TODOS,
            editing: null
        };
    }
    
    componentDidMount() {
        var setState = this.setState;
        var router = Router({
            '/': () =>  this.setState({nowShowing: routes.ALL_TODOS}),
            '/active': () =>  this.setState({nowShowing: routes.ACTIVE_TODOS}),
            '/completed': () =>  this.setState({nowShowing: routes.COMPLETED_TODOS})
        });
        router.init('/');
    }

    handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
        if (event.which !== ENTER_KEY) {
            return;
        }

        var val = this.newField.value.trim();

        if (val) {
            this.props.model.addTodo(val);
            this.newField.value = '';
        }

        return false;
    }

    toggleAll = (event: React.MouseEvent) => {
        var checked: boolean = (<HTMLInputElement> event.target).checked;
        this.props.model.toggleAll(checked);
    }

    toggle(todoToToggle: Todo) {
        this.props.model.toggle(todoToToggle);
    }

    destroy(todo: Todo) {
        this.props.model.destroy(todo);
    }

    edit(todo: Todo, callback: () => void) {
        // refer to todoItem.js `handleEdit` for the reasoning behind the
        // callback
        this.setState({editing: todo.id}, function () {
            callback();
        });
    }

    save(todoToSave: Todo, text: string) {
        this.props.model.save(todoToSave, text);
        this.setState({editing: null});
    }

    cancel() {
        this.setState({editing: null});
    }

    clearCompleted() {
        this.props.model.clearCompleted();
    }

    render() {
        var footer: TodoFooter;
        var main: React.ReactComponent<any, any>;
        var todos = this.props.model.todos;

        var shownTodos = todos.filter((todo) => {
            switch (this.state.nowShowing) {
                case routes.ACTIVE_TODOS:
                    return !todo.completed;
                case routes.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        });

        var todoItems = shownTodos.map(function (todo) {
            return (
                new TodoItem({
                    key: todo.id,
                    todo: todo,
                    onToggle: () => this.toggle(todo),
                    onDestroy: () => this.destroy(todo),
                    onEdit: (callback: () => void ) => this.edit(todo, callback),
                    editing: this.state.editing === todo.id,
                    onSave: (text: string) => this.save(todo, text),
                    onCancel: () => this.cancel()
                })
            );
        }, this);

        var activeTodoCount = todos.reduce((accum: number, todo: Todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0);

        var completedCount = todos.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer =
                new TodoFooter({
                    count:activeTodoCount,
                    completedCount: completedCount,
                    nowShowing: this.state.nowShowing,
                    onClearCompleted: () => this.clearCompleted()
                });
        }

        if (todos.length) {
            main = (
                React.DOM.section( {id:"main"}, 
                    React.DOM.input({
                        id: "toggle-all",
                        type: "checkbox",
                        onChange: this.toggleAll,
                        checked: activeTodoCount === 0}
                    ),
                    React.DOM.ul( 
                        {id:"todo-list"}, 
                        todoItems
                    )
                )
            );
        }

        return (
            React.DOM.div(null, 
                React.DOM.header( 
                    {id:"header"}, 
                    React.DOM.h1(null, "todos"),
                    React.DOM.input({
                        ref:"newField",
                        id:"new-todo",
                        placeholder:"What needs to be done?",
                        onKeyDown: this.handleNewTodoKeyDown,
                        autoFocus:true
                    })
                ),
                main,
                footer
            )
        );
    }
}

module TodoApp {
    export interface Props {
        model: TodoModel
    }
    
    export interface State {
        editing?: string;
        nowShowing?: string;
    }
}

var model = new TodoModel('react-todos');

function render() {
    React.renderComponent(
        new TodoApp({model: model}),
        document.getElementById('todoapp')
    );
}

model.subscribe(render);
render();