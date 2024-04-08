/**
 * @jest-environment @bufbuild/jest-environment-jsdom
 */

/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');

// const { Config } = require('jest');
// const config = {
//     testEnvironment: '@bufbuild/jest-environment-jsdom',
// };
// Config.testEnvironment = '@bufbuild/jest-environment-jsdom';
// const config: Config = {
//     testEnvironment: '@bufbuild/jest-environment-jsdom',
// };

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
// const entity = require('logic-entity');
require('logic-core');
require('logic-entity');
global.jQuery = global.jQuery || require('jquery');

require('../');
// const {IGroupControl} = require('logic-entity');
                // require('../src/i-control-schema');
                // require('../src/i-control-import');
                // require('../src/i-control-export');
                // require('../src/trans-queue');
                // require('../src/collection-transaction');
                // require('../src/meta-row');
                // require('../src/base-column');
                // require('../src/meta-column');
                // require('../src/collection-column');
        
                // require('../src/base-entity')
// require('../src/html-column');

const BindModelAjax = global._L.BindModelAjax;

const { JSDOM } = require('jsdom');

var a = 1
//==============================================================
// test
describe("[target: base-column.js]", () => {
    describe("BaseColumn :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            // MetaRegistry.init();
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
            it("- 설정 및 조회 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                // var bm1 = new BindModelAjax()

                var bm1 = new BindModelAjax({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                        bb:  {selector: {key: '#ERR'}},
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa: { read: ['valid'] },
                        bb: { read: ['bind'] },
                    }
                })
                // bm1.init();
                expect(1).toBe(1)
                
                expect(bm1.checkSelector()).toBe(false)
                expect(bm1.validSelector()).toEqual([])

                
            });
        });
    });
});
