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
            it("- 확인 ", () => {
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
            it("- 확인2 ", () => {
                document.body.innerHTML = `
                <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
                <button id="ID2"  ETC="ETC"><div>TEXT</dib></button>
                <p id="ID3" />
                `;
                const $ = require('jquery');
                $('#ID2').prop('checked', true)
                var bm1 = new BindModelAjax({
                    items: {
                        aa1: {selector: {key: '#ID1', type: 'val'}},
                        aa2: {selector: {key: '#ID1', type: 'value'}},
                        aa3: {selector: {key: '#ID1', type: 'css.color'}},
                        bb1: {selector: {key: '#ID2', type: 'attr.ETC'}},
                        bb2: {selector: {key: '#ID2', type: 'prop.checked'}},
                        bb3: {selector: {key: '#ID2', type: 'text'}},
                        bb4: {selector: {key: '#ID2', type: 'html'}},
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa1: { read: ['valid'] },
                        aa2: { read: ['valid'] },
                        aa3: { read: ['valid'] },
                        bb1: { read: ['bind'] },
                        bb2: { read: ['bind'] },
                        bb3: { read: ['bind'] },
                        bb4: { read: ['bind'] },
                    }
                })
                expect(bm1.columns.count).toBe(7)
                expect(bm1.columns.aa1.value).toBe('VALUE')
                expect(bm1.columns.aa2.value).toBe('VALUE')
                expect(bm1.columns.aa3.value).toBe('blue')
                expect(bm1.columns.bb1.value).toBe('ETC')
                expect(bm1.columns.bb2.value).toBe(true)
                expect(bm1.columns.bb3.value).toBe('TEXT')
                expect(bm1.columns.bb4.value).toBe('<div>TEXT</div>')
            });
        });
    });
});
