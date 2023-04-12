/**
 * @jest-environment jsdom
 */
'use strict';

// jsdom 브라우저 출력
const express = require('express');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

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

    newTodoInput.value = 'New todolist2';
    addTodoBtn.click();

    // expect(todolist.innerHTML).toBe('<li>New todolist!</li>');

    // jsdom 브라우저 출력
    const dom = new JSDOM(`<!DOCTYPE html><body>${document.body.innerHTML}</body>`,
        {
            url: "http://localhost:8000/",
            contentType: "text/html",
            pretendToBeVisual: true,
        }
    );
    const app = express();

    app.get('/', (req, res) => {
        res.send(dom.serialize());
    });

    app.listen(8080, () => {
        console.log('Example app listening at http://localhost:8080');
    });

});



// const jsdom = require("jsdom");

// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<!DOCTYPE html><body><p id="main">My First JSDOM!</p></body>`,
//   {
//     url: "http://localhost:3000/",
//     contentType: "text/html",
//     pretendToBeVisual: true,
//   }
// );

// const app = express();

// app.get('/', (req, res) => {
//   res.send(dom.serialize());
// });

// app.listen(8080, () => {
//   console.log('Example app listening at http://localhost:8080');
// });