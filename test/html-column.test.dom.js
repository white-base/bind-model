
//=============================================================
// gobal defined
import {jest} from '@jest/globals';

import { BindModel } from '../src/bind-model.js';
import { MetaRegistry } from 'logic-entity';
import { HTMLColumn } from '../src/html-column.js';
import { Message } from '../src/message-wrap.js';

import jQuery from 'jquery';

const $ = jQuery;
// await import('../dist/bind-model.js');

// const { BindModel } = global._L;
// const { MetaRegistry } = global._L;
// const { HTMLColumn } = global._L;

//==============================================================
// test
describe("[target: base-column.js]", () => {
    describe("BaseColumn :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
            globalThis.isDOM = true;
        });
        describe("HTMLColumn", () => {
            it("- value : getter ", () => {
                document.body.innerHTML = `
                <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
                <button id="ID2" value="VALUE2" ETC="ETC"><div>TEXT</div></button>
                <div id="ID3"><div>TEXT</div></div>
                `;
                // const $ = require('jquery');
                $('#ID2').prop('checked', true)

                var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'val'}})
                var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'value'}})
                var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'css.color'}})
                var hc4 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'attr.ETC'}})
                var hc5 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'prop.checked'}})
                var hc6 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'TEXT'}})
                var hc7 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'HTML'}})
                var hc8 = new HTMLColumn('aa', null, {selector: 'NOT'})
                
                // var aa = hc1.value;

                expect(hc1.value).toBe('VALUE')
                expect(hc2.value).toBe('VALUE2')
                expect(hc3.value).toBe('blue')
                expect(hc4.value).toBe('ETC')
                expect(hc5.value).toBe(true)
                expect(hc6.value).toBe('TEXT')
                expect(hc7.value).toBe('<div>TEXT</div>')
                expect(hc8.value).toBe('')
            });
            it("- value : setter ", () => {
                document.body.innerHTML = `
                <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
                <button id="ID2" value="VALUE2"  ETC="ETC"><div>TEXT</div></button>
                <div id="ID3"><div>TEXT</div></div>
                `;
                // const $ = require('jquery');
                $('#ID2').prop('checked', true)

                var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'val'}})
                var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'value'}})
                var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'css.color'}})
                var hc4 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'attr.ETC'}})
                var hc5 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'prop.checked'}})
                var hc6 = new HTMLColumn('aa', null, {selector: {key: '#ID2', type: 'TEXT'}})
                var hc7 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'HTML'}})
                var hc8 = new HTMLColumn('aa', null, {selector: 'NOT'})
                var hc9 = new HTMLColumn('aa', null)

               hc1.value = 'value'
               hc2.value = 'value2'
               hc3.value = 'red'
               hc4.value = 'etc'
               hc5.value = false
               hc6.value = 'text'
               hc7.value = '<div>text</div>'
               hc8.value = 'NOT'
               hc9.value = null
                
                expect(hc1.value).toBe('value')
                expect(hc2.value).toBe('value2')
                expect(hc3.value).toBe('red')
                expect(hc4.value).toBe('etc')
                expect(hc5.value).toBe(false)
                expect(hc6.value).toBe('text')
                expect(hc7.value).toBe('<div>text</div>')
                expect(hc8.value).toBe('NOT')
                expect(hc9.value).toBe('')
            });
            it("- 예외 : getter ", () => {
                document.body.innerHTML = `
                <input id="ID1" value="VALUE" class='CLASS' style="color:blue;" />
                <button id="ID2" value="VALUE2" ETC="ETC"><div>TEXT</div></button>
                <div id="ID3"><div>TEXT</div></div>
                `;
                // const $ = require('jquery');
                $('#ID2').prop('checked', true)
                var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID1', type: 'etc'}})

                expect(()=> hc1.value).toThrow('EL054611')
            });
            it("- 예외 : getter 2 ", () => {
                document.body.innerHTML = `
                <div id="ID3"><div>TEXT</div></div>
                `;
                var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'prop'}})
                var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'attr'}})
                var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'css'}})
                
                expect(()=> hc1.value).toThrow('prop')
                expect(()=> hc2.value).toThrow('attr')
                expect(()=> hc3.value).toThrow('css')
            });
            it("- 예외 : setter ", () => {
                document.body.innerHTML = `
                <div id="ID3"><div>TEXT</div></div>
                `;
                // const $ = require('jquery');
                var c1 = new HTMLColumn('c1')
                c1.selector = {key: 'ID1', type: 'ETC'}

                expect(()=> c1.value = '').toThrow('EL054616')
            });
            it("- 예외 : setter 2 ", () => {
                document.body.innerHTML = `
                <div id="ID3"><div>TEXT</div></div>
                `;
                var hc1 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'prop'}})
                var hc2 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'attr'}})
                var hc3 = new HTMLColumn('aa', null, {selector: {key: '#ID3', type: 'css'}})
                
                expect(()=> hc1.value = 1).toThrow('prop')
                expect(()=> hc2.value = 1).toThrow('attr')
                expect(()=> hc3.value = 1).toThrow('css')
            });
            it("- 경고 : getter ", () => {
                document.body.innerHTML = `
                <div id="ID3"><div>TEXT</div></div>
                `;
                // const $ = require('jquery');
                $('#ID2').prop('checked', true)
                var prop = {
                    items: {
                        aa1: {selector: {key: '#ID1', type: 'attr.ETC'}},
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa1: { read: ['valid'] },
                    }
                }
                var result = [];
                console.warn = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm1 = new BindModel(prop)

                // expect(result[0]).toMatch(/일치하는/);
                expect(result[0]).toBe(undefined);
            });
        });
    });
});
