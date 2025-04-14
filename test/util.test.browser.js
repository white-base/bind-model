
//==============================================================
// gobal defined
import {jest} from '@jest/globals';

await import('../dist/bind-model.js');

const { Util } = global._L;

import jQuery from 'jquery';
global.jQuery = jQuery;
import axios from 'axios';
global.axios = axios;
//==============================================================
// test
describe("[target: util.js]", () => {
    describe("Util :: 모듈 ", () => {
        beforeEach(async () => {
            jest.resetModules();
            // await import('logic-bind-model');
            
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
                expect(()=>Util.validSelector('#newTodoInput')).toThrow('EL01611')
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
