/**
 * @jest-environment @bufbuild/jest-environment-jsdom
 */

/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
global.jQuery = global.jQuery || require('jquery');
require('logic-core');
require('logic-entity');
require('../');

const BindModelAjax     = global._L.BindModelAjax;
const MetaRegistry      = global._L.MetaRegistry;

const { JSDOM } = require('jsdom');

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
                require('../temp/todoList');
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
            it("- checkSelector(), getSelector() ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                // var bm1 = new BindModelAjax()

                var bm1 = new BindModelAjax({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                    },
                })
                var bm2 = new BindModelAjax({
                    items: {
                        bb:  {selector: {key: '#ERR'}},
                    },
                })
                // var sel = [{key: '#todoList'}, {key: '#ERR'}]

                // bm1.init();
                expect(1).toBe(1)
                
                expect(bm1.checkSelector().length).toBe(0)
                expect(bm1.getSelector()).toEqual([ {key: '#todoList'}])

                expect(bm2.checkSelector().length).toBe(1)
                expect(bm2.getSelector()).toEqual([{key: '#ERR'}])
            });
        });
        describe("HTMLColumn", () => {
            it("- 설정 및 조회 ", () => {
                document.body.innerHTML = `
                <input id="val" value="val old"/>
                <button id="txt">txt old</button>`;
                const $ = require('jquery');
                var bm1 = new BindModelAjax({
                    items: {
                        aa: {selector: {key: '#val', type: 'val'}},
                        bb: {selector: {key: '#txt', type: 'text'}},
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa: { read: ['valid'] },
                        bb: { read: ['bind'] },
                    }
                })
                var aa = bm1.columns.aa.value
                bm1.columns.aa.value = 'new VAL'
                bm1.columns.bb.value = 'new TXT'

                expect(bm1.columns.count).toBe(2)
                expect($('#val').val()).toBe('new VAL')
                expect($('#txt').text()).toBe('new TXT')
            });
        });
    });
});
