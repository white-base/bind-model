/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
const { MetaRegistry }          = require('logic-entity');
const { BindModelAjax }         = require('../src/bind-model-ajax');
const { HTMLColumn }            = require('../src/html-column');
const { MetaColumn } = require('logic-entity');
const { BindCommand, BindModel, BaseBind } = require('..');
const { MetaTable } = require('logic-entity');
const { MetaObject } = require('logic-entity');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("[target: bind-model-ajax.js]", () => {
    describe("BindModelAjax :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });

        describe("BindModelAjax.BindModelAjax(): 생성자", () => {
            it("- 확인", () => {
                var bm = new BindModelAjax();
                expect(bm._columnType).toEqual(HTMLColumn)
            });
        });
        describe(" BindModelAjax static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindModelAjax._UNION).toEqual([])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindModelAjax._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindModelAjax._PARAMS).toEqual(['$service'])
            });
        });
        describe("BindModelAjax.baseAjaxSetup: 기본 ajax 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var ajax = {url: '', type: 'GET', dataType: 'json', async: true, crossDomain: false}
                
                expect(bm.baseAjaxSetup).toEqual(ajax);
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                var ajax1 = {url: '', type: 'GET', dataType: 'json', async: true, crossDomain: false}
                var ajax2 = {url: 'a', type: 'POST', etc: 'json'}
                var ajax3 = {url: 'a', type: 'POST', dataType: 'json', async: true, crossDomain: false}
                
                expect(bm.baseAjaxSetup).toEqual(ajax1);
                bm.baseAjaxSetup = ajax2
                expect(bm.baseAjaxSetup).toEqual(ajax3);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                expect(()=>bm.baseAjaxSetup = 10).toThrow('baseAjaxSetup')
            });
        });
        describe("BindModelAjax.barUrl: 기본 ajax url 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var url = 'URL'
                bm.baseUrl = url

                expect(bm.baseAjaxSetup.url).toBe(url);
                expect(bm.baseUrl).toBe(url);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                expect(()=>bm.baseUrl = {}).toThrow('string')
                expect(()=>bm.baseUrl = '').toThrow('string')
            });
        });
        describe("BindModelAjax._columnType: 기본 컬럼 타입", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                expect(bm._columnType).toBe(HTMLColumn)                
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                bm._columnType = MetaColumn;

                expect(bm._columnType).toBe(MetaColumn)
                expect(()=> bm._columnType = {}).toThrow()
            });
        });
        describe("BindModelAjax.addCommand() ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                bm.addCommand('read');
                bm.addCommand('list', 2);
               
                expect(bm.cmd.read instanceof BindCommand).toBe(true)
                expect(bm.cmd.list instanceof BindCommand).toBe(true)
                expect(bm.cmd.read.outOpt).toEqual({"index": 0, "option": 0})
                expect(bm.cmd.list.outOpt).toEqual({"index": 0, "option": 2})
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                bm.addCommand('read');

                expect(()=>bm.addCommand('count')).toThrow('예약어')
                expect(()=>bm.addCommand('read')).toThrow('중복')
            });
        });
        describe("BindModelAjax.setService() ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var svc = {
                    baseAjaxSetup: {type: 'POST'},
                    baseUrl: 'URL',
                    tables: ['second', 'three'],
                    command : {'read': {}},
                    items: {
                        aa: '',
                        bb: 10,
                        cc: {},
                        dd: null
                    },
                    fn: {
                        fn1: (aa)=>{ return 'fn1'}
                    },
                    mapping: {
                        aa: {all: []},
                        'second.bb': {all: []},
                        'three.cc': {all: []},
                    },
                    preRegister: ()=> 'preRegister',
                    preCheck: ()=> 'preCheck',
                    preReady: ()=> 'preReady',
                    cbFail: ()=> 'cbFail',
                    cbError: ()=> 'cbError',
                    cbBaseValid: ()=> 'cbBaseValid',
                    cbBaseBind: ()=> 'cbBaseBind',
                    cbBaseResult: ()=> 'cbBaseResult',
                    cbBaseOutput: ()=> 'cbBaseOutput',
                    cbBaseEnd: ()=> 'cbBaseEnd',
                    onExecute: ()=> 'onExecute',
                    onExecuted: ()=> 'onExecuted',
                }   
                bm.setService(svc)

                expect(bm.baseUrl).toBe('URL')
                expect(bm.baseAjaxSetup.type).toBe('POST')
                expect(bm._tables.count).toBe(3)
                expect(bm._tables.count).toBe(3)
                expect(bm.columns.count).toBe(1)
                expect(bm._tables['second'].columns.count).toBe(1)
                expect(bm._tables['three'].columns.count).toBe(1)
                expect(bm.fn.count).toBe(1)
                expect(bm.fn['fn1']()).toBe('fn1')
                expect(bm.preRegister()).toBe('preRegister')
                expect(bm.preCheck()).toBe('preCheck')
                expect(bm.preReady()).toBe('preReady')
                expect(bm.cbFail()).toBe('cbFail')
                expect(bm.cbError()).toBe('cbError')
                expect(bm.cbBaseValid()).toBe('cbBaseValid')
                expect(bm.cbBaseBind()).toBe('cbBaseBind')
                expect(bm.cbBaseResult()).toBe('cbBaseResult')
                expect(bm.cbBaseOutput()).toBe('cbBaseOutput')
                expect(bm.cbBaseEnd()).toBe('cbBaseEnd')
                expect(bm.$event._list.length).toBe(2)
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();

                expect(()=>bm.setService({baseAjaxSetup: 10})      ).toThrow('baseAjaxSetup')
                expect(()=>bm.setService({baseUrl: 10})      ).toThrow('baseUrl')
                expect(()=>bm.setService({tables: 10})      ).toThrow('tables')
                expect(()=>bm.setService({command: 10})     ).toThrow('command')
                expect(()=>bm.setService({items: 10})     ).toThrow('items')
                expect(()=>bm.setService({fn: 10})     ).toThrow('fn')
                expect(()=>bm.setService({mapping: 10})     ).toThrow('mapping')
                expect(()=>bm.setService({preRegister: {} })     ).toThrow('preRegister')
                expect(()=>bm.setService({preCheck: {} })     ).toThrow('preCheck')
                expect(()=>bm.setService({preReady: {} })     ).toThrow('preReady')
                expect(()=>bm.setService({cbFail: {}})     ).toThrow('cbFail')
                expect(()=>bm.setService({cbError: {} })     ).toThrow('cbError')
                expect(()=>bm.setService({cbBaseValid: {} })     ).toThrow('cbBaseValid')
                expect(()=>bm.setService({cbBaseBind: {} })     ).toThrow('cbBaseBind')
                expect(()=>bm.setService({cbBaseResult: {} })     ).toThrow('cbBaseResult')
                expect(()=>bm.setService({cbBaseOutput: {} })     ).toThrow('cbBaseOutput')
                expect(()=>bm.setService({cbBaseEnd: {} })     ).toThrow('cbBaseEnd')
            });
        });

        describe("MetaObject <- BaseBind <- BindModel : 상속 ", () => {

            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new BindModelAjax();
                    // MetaObject
                    expect(bm.$KEYWORD.indexOf('equal')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('instanceOf')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('getTypes')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_guid')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_type')> -1).toBe(true)
                    // BaseBind
                    expect(bm.$KEYWORD.indexOf('$event')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('$KEYWORD')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('onExecute')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('onExecuted')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_onExecute')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_onExecuted')> -1).toBe(true)
                    // BindModel
                    expect(bm.$KEYWORD.indexOf('_tables')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_columnType')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('items')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('fn')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('command')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cmd')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('columns')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbFail')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbError')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseResult')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseValid')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseBind')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseOutput')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseEnd')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('init')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preRegister')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preCheck')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preReady')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addColumn')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addColumnValue')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_readItem')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('setMapping')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addCommand')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('setService')> -1).toBe(true)
                    // BindModelAjax
                    expect(bm.$KEYWORD.indexOf('$service')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('baseAjaxSetup')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('baseUrl')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('getSelector')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('checkSelector')> -1).toBe(true)
                    // ETC
                    expect(bm.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    expect(bm._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    expect(bm._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    expect(bm._type === BindModelAjax).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var b2 = new BindModelAjax();
                    var b3 = new BindModelAjax();
                    var t1 = new MetaTable('t1');
                    b3.cbBaseBind = ()=>true;
    
                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.equal(b3)).toBe(false)
                    expect(bm.equal(t1)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    expect(bm.getTypes()).toEqual([BindModelAjax, BindModel, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
    
                    expect(bm.instanceOf('BindModelAjax')).toBe(true)
                    expect(bm.instanceOf('BindModel')).toBe(true)
                    expect(bm.instanceOf('BaseBind')).toBe(true)
                    expect(bm.instanceOf('MetaObject')).toBe(true)
                    expect(bm.instanceOf('Object')).toBe(true)
                    expect(bm.instanceOf('MetaTable')).toBe(false)
                    expect(bm.instanceOf(BindModelAjax)).toBe(true)
                    expect(bm.instanceOf(BindModel)).toBe(true)
                    expect(bm.instanceOf(BaseBind)).toBe(true)
                    expect(bm.instanceOf(MetaObject)).toBe(true)
                    expect(bm.instanceOf(Object)).toBe(true)
                    expect(bm.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.BindModelAjax")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new BindModelAjax();
                    bm._baseTable = t1
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.BindModelAjax")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('undefined')
                    expect(obj1._guid.length > 0).toBe(true)
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax()
                    bm.columns.addValue('aa', 'AA')
                    // bm._baseTable = t1;
                    var obj1  = bm.getObject()
                    var b2 = new BindModelAjax();
                    b2.setObject(obj1);

                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.columns.aa.value).toBe('AA')
                    expect(b2.columns.aa.value).toBe('AA')
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new BindModelAjax()
                    bm._baseTable = t1;
                    bm.columns.addValue('aa', 'AA')
                    var obj1  = bm.getObject()
                    var b2 = new BindModelAjax();
                    b2.setObject(obj1);

                    expect(bm.equal(b2)).toBe(true)
                    // bm
                    expect(bm.columns.aa.value).toBe('AA')
                    expect(bm._baseTable === t1).toBe(true)
                    expect(bm.first.columns.count).toBe(0)
                    // b2
                    expect(b2.columns.aa.value).toBe('AA')
                    expect(b2._baseTable.equal(t1)).toBe(true)
                    expect(b2.first.columns.count).toBe(0)
                    // expect(b2.columns.aa.value).toBe('AA')
                });
            });
            
        });
    });
});
