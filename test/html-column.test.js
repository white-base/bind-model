// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

const { HTMLColumn } = require("../src/html-column");

// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
const T = true;

//==============================================================
// test
describe("[target: html-column.js]", () => {
    describe("HTMLColumn :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            // MetaRegistry.init();
        });

        describe("HTMLColumn.HTMLColumn(): 생성자", () => {
            it("- 확인", () => {
                var hc = new HTMLColumn('c1');

                expect(hc instanceof HTMLColumn).toBe(true)
            });
        });
        describe(" HTMLColumn static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(HTMLColumn._UNION).toEqual([])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(HTMLColumn._NS).toEqual('Meta.Entity')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(HTMLColumn._PARAMS).toEqual(['columnName', '_entity'])
            });
            it("- _VALUE_TYPE : 인터페이스 타입 ", () => {
                expect(HTMLColumn._VALUE_TYPE).toEqual([null, String, Number, Boolean])
            });
        });
        describe("HTMLColumn.domType: DOM 타입 ", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.domType).toBe(null);
            });
            it("- 수정 ", () => {
                var hc = new HTMLColumn('c1');
                hc.domType = {};
                
                expect(hc.domType).toEqual({});
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=>hc.domType = '').toThrow('object')
            });
        });
        describe("HTMLColumn.isReadOnly: 읽기전용 여부 ", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.isReadOnly).toBe(false);
            });
            it("- 수정 ", () => {
                var hc = new HTMLColumn('c1');
                hc.isReadOnly = true;
                
                expect(hc.isReadOnly).toBe(true);
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=>hc.isReadOnly = '').toThrow('boolean')
            });
        });
        describe("HTMLColumn.isHide: 숨김 여부 ", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.isHide).toBe(false);
            });
            it("- 수정 ", () => {
                var hc = new HTMLColumn('c1');
                hc.isHide = true;
                
                expect(hc.isHide).toBe(true);
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=>hc.isHide = '').toThrow('boolean')
            });
        });
        describe("HTMLColumn.element: DOM 요소 ", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.element).toBe(null);
            });
            it("- 수정 ", () => {
                var hc = new HTMLColumn('c1');
                hc.element = {};
                
                expect(hc.element).toEqual({});
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=>hc.element = '').toThrow('object')
            });
        });
        describe("HTMLColumn.selector: 셀렉터 ", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                var selector = {key: '', type:'none'}

                expect(hc.selector).toEqual(selector);
            });
            it("- 수정 ", () => {
                var hc1 = new HTMLColumn('c1');
                var hc2 = new HTMLColumn('c2');
                var hc3 = new HTMLColumn('c3');
                var hc4 = new HTMLColumn('c4');
                hc1.selector = '#ID';
                hc2.selector = {key: '#ID'};
                hc3.selector = {key: '#ID', type: 'text'};
                hc4.selector = {type: 'text'};
                
                expect(hc1.selector).toEqual({key: '#ID', type: 'none'});
                expect(hc2.selector).toEqual({key: '#ID', type: 'none'});
                expect(hc3.selector).toEqual({key: '#ID', type: 'text'});
                expect(hc4.selector).toEqual({key: '', type: 'text'});
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=>hc.selector = 0).toThrow('EL061405')
            });
        });
        describe("HTMLColumn.getFilter", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.getFilter).toBe(null)
            });
            it("- 변경 ", () => {
                var hc = new HTMLColumn('c1');
                var f1 = (a)=>{}
                hc.getFilter = f1
                expect(hc.getFilter).toBe(f1)
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=> hc.getFilter = '').toThrow('function')
            });
        });
        describe("HTMLColumn.setFilter", () => {
            it("- 확인 ", () => {
                var hc = new HTMLColumn('c1');
                expect(hc.setFilter).toBe(null)
            });
            it("- 변경 ", () => {
                var hc = new HTMLColumn('c1');
                var f1 = (a)=>{}
                hc.setFilter = f1
                expect(hc.setFilter).toBe(f1)
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=> hc.setFilter = '').toThrow('function')
            });
        });
        describe("HTMLColumn.value", () => {
            it("- 확인 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                expect(hc1.value).toBe('AA')
                expect(hc1.$value).toBe('AA')
            });
            it("- getter 가 있는 경우 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                var val = 'CC'
                hc1.getter = ()=> val;

                expect(hc1.value).toBe('CC')
                expect(hc1.$value).toBe('CC')
            });
            it("- getFilter 가 있는 경우 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                var hc2 = new HTMLColumn('c2', null, 'AA');
                var val = 'CC'
                hc1.getFilter = ()=> val;
                hc2.getFilter = ()=> undefined;

                expect(hc1.value).toBe('CC')
                expect(hc1.$value).toBe('AA')   // REVIEW: 내부값과 다른 확인 필요!!
                expect(hc2.value).toBe('AA')    // 필터 리턴 없을시 기본값 또는 내부값
                expect(hc2.$value).toBe('AA')
            });
            it("- getter, getFilter 가 있는 경우 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                var val1 = 'BB'
                var val2 = 'CC'
                hc1.getFilter = ()=> val1;
                hc1.getter = ()=> val2;

                expect(hc1.value).toBe('CC')
                expect(hc1.$value).toBe('CC')
            });
            it("- 변경 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                hc1.value = 'BB'
                
                expect(hc1.value).toBe('BB')
                expect(hc1.$value).toBe('BB')
            });
            it("- setter 가 있는 경우 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                var val
                hc1.setter = (aa)=> {val = aa};
                hc1.value = 'BB'

                expect(hc1.value).toBe('BB')
                expect(hc1.$value).toBe('BB')
                expect(val).toBe('BB')
            });
            it("- setFilter 가 있는 경우 ", () => {
                var hc1 = new HTMLColumn('c1', null, 'AA');
                var hc2 = new HTMLColumn('c2', null, 'AA');
                var val
                hc1.setFilter = (aa)=> {val = aa};
                hc2.setFilter = ()=> undefined;
                hc1.value = 'BB'
                hc2.value = 'BB'

                expect(hc1.value).toBe('BB')
                expect(hc1.$value).toBe('BB')   // REVIEW: 내부값과 다른 확인 필요!!
                expect(val).toBe('BB')
                expect(hc2.value).toBe('BB')
                expect(hc2.$value).toBe('BB')
            });
            it("- 예외 ", () => {
                var hc = new HTMLColumn('c1');
                expect(()=> hc.value = {}).toThrow('number, string, boolean')
            });
        });
        describe("HTMLColumn.clone() <복제>", () => {
            it("- clone() : 복제 ", () => {
                var getFilter = (aa) => {}
                var setFilter = (aa) => {}
                var prop =  {
                    alias: 'cc1',
                    selector: '#ID',
                    getFilter: getFilter,
                    setFilter: setFilter,
                    domType: {},
                    element: {},
                    isReadOnly: true,
                    isHide: true,
                    default: 'D1',
                    caption: 'C1',
                    required: true,
                    // isNullPass: true,
                    constraints: [
                        { regex: /\D/, msg: 'message', code: 'C1', return: true },         // true : 충족조건
                    ],   
                    value: 'V1',
                    getter: getFilter,
                    setter: setFilter,
                };
                var hc1 = new HTMLColumn('c1', null, prop);
                var hc2 = hc1.clone();
        
                expect(hc1.equal(hc2)).toBe(T);
            });
        });
        describe("HTMLColumn.getObject() 직렬화 ", () => {
            it("- 확인 ", () => {
                var getFilter = (aa) => {}
                var setFilter = (aa) => {}
                var prop =  {
                    selector: '#ID',
                    getFilter: getFilter,
                    setFilter: setFilter,
                    domType: {},
                    element: {},
                    isReadOnly: true,
                    isHide: true,
                    default: 'D1',
                    caption: 'C1',
                    required: true,
                    // isNullPass: true,
                    constraints: [
                        { regex: /\D/, msg: 'message', code: 'C1', return: true },         // true : 충족조건
                    ],   
                    value: 'V1',
                    getter: getFilter,
                    setter: setFilter,
                };
                var hc1 = new HTMLColumn('c1', null, prop);
                var obj = hc1.getObject()

                expect(obj._type).toBe('Meta.Entity.HTMLColumn');
            });
        });
        describe("HTMLColumn.setObject() 직렬화 ", () => {
            it("- 확인 ", () => {
                var getFilter = (aa) => {}
                var setFilter = (aa) => {}
                var prop =  {
                    selector: '#ID',
                    getFilter: getFilter,
                    setFilter: setFilter,
                    domType: {},
                    element: {},
                    isReadOnly: true,
                    isHide: true,
                    default: 'D1',
                    caption: 'C1',
                    required: true,
                    // isNullPass: true,
                    constraints: [
                        { regex: /\D/, msg: 'message', code: 'C1', return: true },         // true : 충족조건
                    ],   
                    value: 'V1',
                    getter: getFilter,
                    setter: setFilter,
                };
                var hc1 = new HTMLColumn('c1', null, prop);
                var hc2 = new HTMLColumn('c2');
                var obj = hc1.getObject()
                hc2.setObject(obj)

                expect(hc1.equal(hc2)).toBe(true);
            });
        });
        
    });
});
