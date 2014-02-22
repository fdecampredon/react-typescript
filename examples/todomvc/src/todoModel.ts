'use strict';

import Utils = require('./utils');
import Todo = require('./todo');



// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel{
    
    todos: Todo[];
    onChanges: { (): void }[] = [];
    
    
    constructor(private key: string) { 
        this.todos =  Utils.store(key);
    }
    
    subscribe(callback: () => void) {
        this.onChanges.push(callback);
    }
    
    inform() {
        Utils.store(this.key, this.todos);
        this.onChanges.forEach(callback => callback());
    }
    
    addTodo(title: string) {
        this.todos = this.todos.concat({
            id: Utils.uuid(),
            title: title,
            completed: false
        });

		this.inform();
    }
    
    toggleAll(checked: boolean) {
        // Note: it's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why we
        // use map() and filter() everywhere instead of mutating the array or todo
        // items themselves.
        this.todos = this.todos.map(todo => {
            return <Todo>Utils.extend({}, todo, {completed: checked});
        });

        this.inform();
    }
    
    toggle(todoToToggle: Todo) {
        this.todos = this.todos.map(todo => {
            return todo !== todoToToggle ?
                todo :
                <Todo>Utils.extend({}, todo, {completed: !todo.completed});
        });

        this.inform();
    }
    
    destroy(todo: Todo) {
        this.todos = this.todos.filter(candidate => candidate !== todo);
        this.inform();
    }
    
    save(todoToSave: Todo, text: string) {
        this.todos = this.todos.map(todo => 
            todo !== todoToSave ? todo : <Todo>Utils.extend({}, todo, {title: text}));

        this.inform();
    }
    
    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.inform();
    }
}

export = TodoModel;