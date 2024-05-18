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

        describe("Util.validSelector(): 셀렉터 검사 ", () => {
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
        describe("Util.loadScript(): 동적 스크립트 로딩 ", () => {
            it("- 확인 ", () => {
                document.body.innerHTML = `
                <head/>
                `;
                var url = 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js'
                var cb = ()=>{
                    expect(typeof global.axios).toBe('object')
                }
                delete global.axios;

                expect(typeof global.axios).toBe('undefined')
                Util.loadScript(url, cb)
                // POINT: 검토 필요
                // expect(typeof global.axios).toBe('object')
            });
            // it("- 실패 ", () => {
            //     expect(Util.validSelector(null)).toBe(false)
            //     expect(Util.validSelector('')).toBe(false)
            // });
            // it("- 예외 ", () => {
            //     document.querySelector = null;
            //     expect(()=>Util.validSelector('#newTodoInput')).toThrow('querySelector')
            // });
        });
    });
});
