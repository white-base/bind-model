/**
 * @jest-environment jsdom
 */
'use strict';

test('Check addTodo able add todo to todoList', () => {
    document.body.innerHTML = `
      <input id="newTodoInput" />
      <button id="addTodoBtn">Add todo</button>
      <ol id="todoList"></ol>
    `;
    require('./todoList');
    // const $ = require( "jquery" )( window );
    const $ = require('jquery');

    const newTodoInput = document.getElementById('newTodoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todolist = document.getElementById('todoList');

  newTodoInput.value = 'New todolist!';
  addTodoBtn.click();

  expect(todolist.innerHTML).toBe('<li>New todolist!</li>');

});