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

const { JSDOM } = require('jsdom');

const MetaRegistry      = global._L.MetaRegistry;
const BindCommandAjax   = global._L.BindCommandAjax
const BindModelAjax     = global._L.BindModelAjax

const request                 = require('request');
const MetaTable         = global._L.MetaTable
const BindCommand       = global._L.BindCommand
const BaseBind          = global._L.BaseBind
const MetaObject        = global._L.MetaObject

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

        
        describe("BindCommandAjax.execute(): 실행 ", () => {
            beforeEach(() => {
                function ajax_response(response, success) {
                    return function (params) {
                      if (success) {
                        params.success(response);
                      } else {
                        params.error(response);
                      }
                      params.complete(response);
                    };
                }
                var result = { 
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
                };
                jQuery.ajax = ajax_response(result, true); 
                // jQuery.ajax = jest.fn( (ajaxSetup) => {
                //     ajax_response(result, true);
                // }); 

            });
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
                // logSpy.mockRestore();
            });
            // REVIEW: log 는 아래 방식으러 대체
            it.skip("- 에러 로그 ", () => {
                function ajax_response(response, success) {
                    return function (params) {
                      if (success) {
                        params.success(response);
                      } else {
                        params.error(response);
                      }
                      params.complete(response);
                    };
                }
                var result = `{ 
                    "entity": {
                        "return": 0,
                        "rows_total": 2,     
                        "rows": {
                                "row_count": 1,
                                "acc_idx": 3,
                                "adm_id": "logicfeel",
                                "admName": "관리자명.",
                        }
                    }
                }`;

                jQuery.ajax = ajax_response(result, true); 

                const logSpy = jest.spyOn(console, 'error');

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()
                
                expect(logSpy).toHaveBeenCalledTimes(1);
                expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                logSpy.mockRestore();
            });
            it("- 에러 로그 2 ", () => {
                function ajax_response(response, success) {
                    return function (params) {
                      if (success) {
                        params.success(response);
                      } else {
                        params.error(response);
                      }
                      params.complete(response);
                    };
                }
                var result = `{ 
                    "entity": {
                        "return": 0,
                        "rows_total": 2,     
                        "rows": {
                                "row_count": 1,
                                "acc_idx": 3,
                                "adm_id": "logicfeel",
                                "admName": "관리자명.",
                        }
                    }
                }`;

                jQuery.ajax = ajax_response(result, true); 

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                // const logSpy = jest.spyOn(console, 'error');

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.execute()

                expect(result[0]).toMatch(/오류/);
                // expect(logSpy).toHaveBeenCalledTimes(1);
                // expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                // expect(()=>bc.url = {}).toThrow('string')
                // logSpy.mockRestore();
            });
        });

        
            // describe("MetaObject.getObject() : 객체 얻기 ", () => {
            //     it("- 확인 ", () => {
            //         var bm = new BindModelAjax();
            //         var bc = new BindCommandAjax(bm);
            //         var obj  = bc.getObject()

            //         expect(obj._type).toBe("Meta.Bind.BindCommandAjax")
            //         expect(typeof obj._guid).toBe('string')
            //         expect(obj._guid.length > 0).toBe(true)
            //     });
            //     it("- output 추가 ", () => {
            //         var bm = new BindModelAjax();
            //         var bc = new BindCommandAjax(bm);
            //         bc.newOutput();
            //         bc.newOutput('etc');
            //         var obj  = bc.getObject()

            //         expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
            //         expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
            //     });
            // });
            // describe("MetaObject.setObject() : 객체 설정 ", () => {
            //     it("- 확인 ", () => {
            //         var bm = new BindModelAjax()
            //         bm.addCommand('read')
            //         var bc1 = bm.cmd.read;
            //         bc1.newOutput();
            //         var obj  = bm.getObject()
            //         var b2 = new BindModelAjax()
            //         b2.setObject(obj);

            //         expect(bm.equal(b2)).toBe(true)
            //     });
            //     // command 만 분리해서 가져오는건 의미가 없음
            //     it.skip("- command setObject() ", () => {
            //         var bm = new SubBindModel()
            //         bm.addCommand('read')
            //         var bc1 = bm.cmd.read;
            //         bc1.newOutput();
            //         var obj  = bc1.getObject()
            //         bm.addCommand('list')
            //         var bc2 = bm.cmd.list;
            //         bc2.setObject(obj);

            //         expect(bm.equal(b2)).toBe(true)
            //     });
            // });
    });
});