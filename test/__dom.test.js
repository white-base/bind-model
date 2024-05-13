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
global.axios = require('axios');
require('logic-core');
require('logic-entity');
require('../');

const BindModelAjax     = global._L.BindModelAjax;
const MetaRegistry      = global._L.MetaRegistry;

const { JSDOM } = require('jsdom');
const HTMLColumn  = global._L.HTMLColumn;

//==============================================================
// test
describe.skip("[target: base-column.js]", () => {
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
        });

        // describe("BindModelAjax", () => {
        //     describe("BindModelAjax.checkSelector() : 셀렉터 체크", () => {
        //         it("- 확인 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var bm1 = new BindModelAjax({
        //                 items: {
        //                     aa: {selector: {key: '#todoList'}},
        //                     bb: ''
        //                 },
        //             })

        //             expect(bm1.checkSelector().length).toBe(0)
        //         });
        //         it("- 실패 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var bm2 = new BindModelAjax({
        //                 items: {
        //                     bb:  {selector: {key: '#ERR'}},
        //                 },
        //             })

        //             expect(bm2.checkSelector().length).toBe(1)
        //         });
        //         it("- 실패 2 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var result = [];
        //             console.warn = jest.fn( (msg) => {
        //                 result.push(msg);
        //             });
        //             var bm2 = new BindModelAjax({
        //                 items: {
        //                     bb:  {selector: {key: '#ERR'}},
        //                 },
        //             })

        //             expect(bm2.checkSelector(null, true).length).toBe(1)
        //             expect(result[0]).toMatch(/selector/);
        //         });
        //         it("- 예외 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var bm1 = new BindModelAjax({
        //                 items: {
        //                     aa: {selector: {key: '#todoList'}},
        //                 },
        //             })

        //             expect(()=> bm1.checkSelector(1)).toThrow('PropertyCollection')
        //         });
        //     });
        //     describe("BindModelAjax.getSelector() : 셀렉터 얻기", () => {
        //         it("- 확인 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var bm1 = new BindModelAjax({
        //                 items: {
        //                     aa: {selector: {key: '#todoList'}},
        //                     bb: ''
        //                 },
        //             })
        //             var bm2 = new BindModelAjax({
        //                 items: {
        //                     bb:  {selector: {key: '#ERR'}},
        //                 },
        //             })

        //             expect(1).toBe(1)
        //             expect(bm1.getSelector()).toEqual([ {key: '#todoList'}])
        //             expect(bm2.getSelector()).toEqual([{key: '#ERR'}])
        //         });
        //         it("- 예외 ", () => {
        //             document.body.innerHTML = `
        //             <input id="newTodoInput" />
        //             <button id="addTodoBtn">Add todo</button>
        //             <ol id="todoList"></ol>
        //             `;
        //             var bm1 = new BindModelAjax({
        //                 items: {
        //                     aa: {selector: {key: '#todoList'}},
        //                 },
        //             })

        //             expect(()=> bm1.getSelector(1)).toThrow('PropertyCollection')
        //         });
        //     });
        // });
        // describe("HTMLColumn", () => {
        //     it("- value : getter ", () => {
        //         document.body.innerHTML = `
        //         <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
        //         <button id="ID2" value="VALUE2" ETC="ETC"><div>TEXT</div></button>
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         const $ = require('jquery');
        //         $('#ID2').prop('checked', true)

        //         var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'val'}})
        //         var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'value'}})
        //         var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'css.color'}})
        //         var hc4 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'attr.ETC'}})
        //         var hc5 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'prop.checked'}})
        //         var hc6 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'TEXT'}})
        //         var hc7 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'HTML'}})
        //         var hc8 = new HTMLColumn('aa', null, {selector: 'NOT'})
                
        //         expect(hc1.value).toBe('VALUE')
        //         expect(hc2.value).toBe('VALUE2')
        //         expect(hc3.value).toBe('blue')
        //         expect(hc4.value).toBe('ETC')
        //         expect(hc5.value).toBe(true)
        //         expect(hc6.value).toBe('TEXT')
        //         expect(hc7.value).toBe('<div>TEXT</div>')
        //         expect(hc8.value).toBe('')
        //     });
        //     it("- value : setter ", () => {
        //         document.body.innerHTML = `
        //         <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
        //         <button id="ID2" value="VALUE2"  ETC="ETC"><div>TEXT</div></button>
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         const $ = require('jquery');
        //         $('#ID2').prop('checked', true)

        //         var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'val'}})
        //         var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'value'}})
        //         var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'css.color'}})
        //         var hc4 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'attr.ETC'}})
        //         var hc5 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'prop.checked'}})
        //         var hc6 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'TEXT'}})
        //         var hc7 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'HTML'}})
        //         var hc8 = new HTMLColumn('aa', null, {selector: 'NOT'})
        //         var hc9 = new HTMLColumn('aa', null)

        //        hc1.value = 'value'
        //        hc2.value = 'value2'
        //        hc3.value = 'red'
        //        hc4.value = 'etc'
        //        hc5.value = false
        //        hc6.value = 'text'
        //        hc7.value = '<div>text</div>'
        //        hc8.value = 'NOT'
        //        hc9.value = null
                
        //         expect(hc1.value).toBe('value')
        //         expect(hc2.value).toBe('value2')
        //         expect(hc3.value).toBe('red')
        //         expect(hc4.value).toBe('etc')
        //         expect(hc5.value).toBe(false)
        //         expect(hc6.value).toBe('text')
        //         expect(hc7.value).toBe('<div>text</div>')
        //         expect(hc8.value).toBe('NOT')
        //         expect(hc9.value).toBe('')
        //     });
        //     it("- 예외 : getter ", () => {
        //         document.body.innerHTML = `
        //         <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
        //         <button id="ID2" value="VALUE2" ETC="ETC"><div>TEXT</div></button>
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         const $ = require('jquery');
        //         $('#ID2').prop('checked', true)
        //         var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'etc'}})

        //         expect(()=> hc1.value).toThrow('selector의')
        //     });
        //     it("- 예외 : getter 2 ", () => {
        //         document.body.innerHTML = `
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'prop'}})
        //         var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'attr'}})
        //         var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'css'}})
                
        //         expect(()=> hc1.value).toThrow('prop')
        //         expect(()=> hc2.value).toThrow('attr')
        //         expect(()=> hc3.value).toThrow('css')
        //     });
        //     it("- 예외 : setter ", () => {
        //         document.body.innerHTML = `
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         const $ = require('jquery');
        //         var c1 = new HTMLColumn('c1')
        //         c1.selector = {key: 'ID1', type: 'ETC'}

        //         expect(()=> c1.value = '').toThrow('이어야합니다')
        //     });
        //     it("- 예외 : setter 2 ", () => {
        //         document.body.innerHTML = `
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'prop'}})
        //         var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'attr'}})
        //         var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'css'}})
                
        //         expect(()=> hc1.value = 1).toThrow('prop')
        //         expect(()=> hc2.value = 1).toThrow('attr')
        //         expect(()=> hc3.value = 1).toThrow('css')
        //     });
        //     it("- 경고 : getter ", () => {
        //         document.body.innerHTML = `
        //         <div id="ID3"><div>TEXT</div></div>
        //         `;
        //         const $ = require('jquery');
        //         $('#ID2').prop('checked', true)
        //         var prop = {
        //             items: {
        //                 aa1: {selector: {key: '#ID1', type: 'attr.ETC'}},
        //             },
        //             command: {
        //                 read: { outputOption: 3}
        //             },
        //             mapping: {
        //                 aa1: { read: ['valid'] },
        //             }
        //         }
        //         var result = [];
        //         console.warn = jest.fn( (msg) => {
        //             result.push(msg);
        //         });
        //         var bm1 = new BindModelAjax(prop)

        //         expect(result[0]).toMatch(/일치하는/);
        //     });
        // });
    });
});
