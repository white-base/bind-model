/**
 * @jest-environment @bufbuild/jest-environment-jsdom
 */

// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';
global.jQuery = global.jQuery || require('jquery');
global.axios = require('axios');
require('logic-core');
require('logic-entity');
require('../');

const BindModel     = global._L.BindModel;
const MetaRegistry      = global._L.MetaRegistry;

const { JSDOM } = require('jsdom');
const HTMLColumn  = global._L.HTMLColumn;

//==============================================================
// test
describe("[target: base-column.js]", () => {
    describe("BaseColumn :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });

        describe("MetaObject._valueTypes: <value 타입 설정>", () => {
            it("- 설정 및 조회 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                require('./temp/todoList');
                // const $ = require( "jquery" )( window );
                const $ = require('jquery');

                const newTodoInput = document.getElementById('newTodoInput');
                const addTodoBtn = document.getElementById('addTodoBtn');
                const todolist = document.getElementById('todoList');

                newTodoInput.value = 'New todolist!';
                addTodoBtn.click();
                newTodoInput.value = 'New todolist2';
                // addTodoBtn.click();

                expect($('#newTodoInput').val()).toBe('New todolist2')
                
            });
        });

    });
});
