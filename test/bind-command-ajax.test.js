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

// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');

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
        describe("BindCommandAjax.baseAjaxSetup: 기본 ajax 설정 ", () => {
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
        describe("BindModelAjax.barUrl: 기본 ajax url 설정 ", () => {
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
        describe("BindModelAjax.execute(): 실행 ", () => {
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
            it("- 예외 ", () => {
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
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()
                
                expect(()=>bc.url = {}).toThrow('string')
                expect(()=>bc.url = '').toThrow('string')
            });
        });
    });
});
