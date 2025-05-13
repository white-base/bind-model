//==============================================================
// gobal defined
import { expect, jest } from '@jest/globals';

import { Message } from '../src/message-wrap';
import { MetaRegistry } from 'logic-entity';
import { BindModel } from '../src/bind-model';
import $ from 'jquery';

//==============================================================
// test
describe("[target: bind-model.js]", () => {
    describe("BindModel :: 클래스", () => {
        beforeEach( async() => {
            jest.resetModules();
            MetaRegistry.init();
            globalThis.isDOM = true;
            Object.defineProperty(navigator, 'languages', {
                configurable: true,
                get: () => ['ko-KR', 'ko'],
            });
            await Message.autoDetect();
        });
        describe("BindModel.addSelector() ", () => {
            it("- 확인 : 샐렉터 추가", () => {
                document.body.innerHTML = `
                <input id="myInput" value="Hello" style="color:blue;">
                <div id="myDiv">Some text</div>
                <span id="mySpan"><strong>Bold</strong></span>
                <p id="emptyPara"></p>
                `;
                var bm = new BindModel();
                bm.addSelector('item1', '#myInput');
                bm.addSelector('item2', '#myDiv');
                bm.addSelector('item3', '#mySpan');
                bm.addSelector('item4', '#emptyPara');
                bm.addSelector('item5', {key: '#myInput', type: 'css.color'});

                expect(bm.cols.item1.selector.type).toBe('value');
                expect(bm.cols.item2.selector.type).toBe('text');
                expect(bm.cols.item3.selector.type).toBe('html');
                expect(bm.cols.item4.selector.type).toBe('text');
                expect(bm.cols.item5.selector.type).toBe('css.color');
                // 값 확인
                expect(bm.cols.item1.value).toBe('Hello');
                expect(bm.cols.item2.value).toBe('Some text');
                expect(bm.cols.item3.value).toBe('<strong>Bold</strong>');
                expect(bm.cols.item4.value).toBe('');
                expect(bm.cols.item5.value).toBe('blue');
            });
            it("- 예외 : value 설정", () => {
                document.body.innerHTML = `
                <input id="myInput" value="Hello" style="color:blue;">
                <div id="myDiv">Some text</div>
                <span id="mySpan"><strong>Bold</strong></span>
                <p id="emptyPara"></p>
                `;
                var bm = new BindModel();
                
                expect(() => bm.addSelector('item1', '#NOT')).toThrow('EL06158');
                expect(() => bm.addSelector('item1', {})).toThrow('EL06159');
                expect(() => bm.addSelector('item1', {})).toThrow('EL0615A');

            });
        });
        
    });
});
