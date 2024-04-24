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

const Util     = global._L.Util;

const { JSDOM } = require('jsdom');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("[target: util.js]", () => {
    describe("Util :: 모듈 ", () => {
        beforeEach(() => {
            jest.resetModules();
            // MetaRegistry.init();
        });

        describe("Util.validSelector: 셀렉터 검사 ", () => {
            it("- 확인 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;

                expect(Util.validSelector('#newTodoInput')).toBe(true)
                expect(Util.validSelector('#newTodoInput')).toBe(true)
                expect(Util.validSelector('#newTodoInput2')).toBe(false)

            });
            it("- 실패 ", () => {
                expect(Util.validSelector(null)).toBe(false)
                expect(Util.validSelector('')).toBe(false)
            });
            it("- 예외 ", () => {
                document.querySelector = null;
                expect(()=>Util.validSelector('#newTodoInput')).toThrow('querySelector')
            });
        });
    });
});
