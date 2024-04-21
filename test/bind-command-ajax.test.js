/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';

const { MetaRegistry } = require("logic-entity");
const { BindCommandAjax } = require("../src/bind-command-ajax");
const { BindModelAjax } = require("../src/bind-model-ajax");

const request                 = require('request');
const { MetaTable } = require("logic-entity");
const { BindCommand } = require("../src/bind-command");
const { BaseBind } = require("../src/base-bind");
const { MetaObject } = require("logic-entity");

// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');
const T = true;
// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("[target: bind-commnad-ajax.js]", () => {
    describe("BindCommandAjax :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });

        describe("BindCommandAjax.BindCommandAjax(): 생성자", () => {
            it("- 확인", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);

                expect(bc instanceof BindCommandAjax).toBe(true)
            });
        });
        describe(" BindCommandAjax static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindCommandAjax._UNION).toEqual([])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindCommandAjax._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindCommandAjax._PARAMS).toEqual(['_model', 'outputOption', '_baseTable'])
            });
        });
        describe("BindCommandAjax.ajaxSetup: 기본 ajax 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var ajax = {url: null, type: null, dataType: null, async: null,
                    success: null, error: null, complete: null, crossDomain: null}
                
                expect(bc.ajaxSetup).toEqual(ajax);
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var ajax1 = {url: null, type: null, dataType: null, async: null,
                    success: null, error: null, complete: null, crossDomain: null}
                var ajax2 = {url: 'a', type: 'POST', etc: 'json',
                    success: null, error: null, complete: null, crossDomain: null}
                var ajax3 = {url: 'a', type: 'POST', dataType: null, async: null, 
                    success: null, error: null, complete: null, crossDomain: null}
                
                expect(bc.ajaxSetup).toEqual(ajax1);
                bc.ajaxSetup = ajax2
                expect(bc.ajaxSetup).toEqual(ajax3);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                
                expect(()=>bc.ajaxSetup = 10).toThrow('ajaxSetup')
            });
        });
        describe("BindCommandAjax.url: 기본 ajax url 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var url = 'URL'
                bc.url = url

                expect(bc.ajaxSetup.url).toBe(url);
                expect(bc.url).toBe(url);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                
                expect(()=>bc.url = {}).toThrow('string')
                expect(()=>bc.url = '').toThrow('string')
            });
        });
        describe("BindCommandAjax.execute(): 실행 ", () => {
            beforeEach(() => {
                request.get = jest.fn( (ajaxSetup, cb) => {
                    const response = { statusCode: 200 };
                    const body = `
                    {
                        "entity": {
                            "return": 0,
                            "rows_total": 2,     
                            "rows": {
                                    "row_count": 1,
                                    "acc_idx": 3,
                                    "adm_id": "logicfeel",
                                    "admName": "관리자명."
                            }
                        }
                    }`;
                    cb(null, response, body);
                }); 
            });
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
            });
            it("- 에러 로그 ", () => {
                request.get = jest.fn( (ajaxSetup, cb) => {
                    const response = { statusCode: 200 };
                    const body = `
                    {
                        "entity": {
                            "return": 0,
                            "rows_total": 2,     
                            "rows": {
                                    "row_count": 1,
                            }
                        }
                    }`;
                    cb(null, response, body);
                });
                const logSpy = jest.spyOn(console, 'error');

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()
                
                expect(logSpy).toHaveBeenCalledTimes(1);
                expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                logSpy.mockRestore();
                // expect(()=>bc.url = '').toThrow('string')
            });
        });

        describe("MetaObject <- BaseBind <- BindCommand : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);
                    
                    // MetaObject
                    expect(bc.$KEYWORD.indexOf('equal')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('instanceOf')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('getTypes')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_guid')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_type')> -1).toBe(true)
                    // BaseBind
                    expect(bc.$KEYWORD.indexOf('$event')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('$KEYWORD')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('onExecute')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('onExecuted')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_onExecute')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_onExecuted')> -1).toBe(true)
                    // BindCommand
                    expect(bc.$KEYWORD.indexOf('_model')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_outputs')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('valid')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('bind')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('output')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('output1')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('cbValid')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('cbBind')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('cbResult')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('cbOutput')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('cbEnd')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('outputOption')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('outOpt')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('addColumnValue')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('setColumn')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('release')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('execute')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('newOutput')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('removeOutput')> -1).toBe(true)
                    // BindCommandAjax
                    expect(bc.$KEYWORD.indexOf('ajaxSetup')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('url')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execValid')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execBind')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execOutput')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxSuccess')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxError')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxComplete')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_callAjax')> -1).toBe(true)
                    // ETC
                    expect(bc.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);

                    expect(bc._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);

                    expect(bc._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);

                    expect(bc._type === BindCommandAjax).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc1 = new BindCommandAjax(bm);
                    var bc2 = new BindCommandAjax(bm);
                    var bc3 = new BindCommandAjax(bm);
                    bc3.outOpt = 2

                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc3)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);

                    expect(bc.getTypes()).toEqual([BindCommandAjax, BindCommand, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);

                    expect(bc.instanceOf('BindCommandAjax')).toBe(true)
                    expect(bc.instanceOf('BindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBind')).toBe(true)
                    expect(bc.instanceOf('MetaObject')).toBe(true)
                    expect(bc.instanceOf('Object')).toBe(true)
                    expect(bc.instanceOf('MetaTable')).toBe(false)
                    expect(bc.instanceOf(BindCommandAjax)).toBe(true)
                    expect(bc.instanceOf(BindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBind)).toBe(true)
                    expect(bc.instanceOf(MetaObject)).toBe(true)
                    expect(bc.instanceOf(Object)).toBe(true)
                    expect(bc.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);
                    var obj  = bc.getObject()

                    expect(obj._type).toBe("Meta.Bind.BindCommandAjax")
                    expect(typeof obj._guid).toBe('string')
                    expect(obj._guid.length > 0).toBe(true)
                });
                it("- output 추가 ", () => {
                    var bm = new BindModelAjax();
                    var bc = new BindCommandAjax(bm);
                    bc.newOutput();
                    bc.newOutput('etc');
                    var obj  = bc.getObject()

                    expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
                    expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModelAjax()
                    bm.addCommand('read')
                    var bc1 = bm.cmd.read;
                    bc1.newOutput();
                    var obj  = bm.getObject()
                    var b2 = new BindModelAjax()
                    b2.setObject(obj);

                    expect(bm.equal(b2)).toBe(true)
                });
                // command 만 분리해서 가져오는건 의미가 없음
                it.skip("- command setObject() ", () => {
                    var bm = new SubBindModel()
                    bm.addCommand('read')
                    var bc1 = bm.cmd.read;
                    bc1.newOutput();
                    var obj  = bc1.getObject()
                    bm.addCommand('list')
                    var bc2 = bm.cmd.list;
                    bc2.setObject(obj);

                    expect(bm.equal(b2)).toBe(true)
                });
            });
        });
    });
});
