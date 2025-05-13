//==============================================================
// gobal defined
import {jest} from '@jest/globals';

// await import('../dist/bind-model.js');
// const { BindModel } = await import('../src/bind-model.js');

import { BindModel } from '../src/bind-model.js';
import { MetaRegistry } from 'logic-entity';
import { BindCommand } from '../src/bind-command.js';
import { MetaTable } from 'logic-entity';
import { BaseBindCommand } from '../src/base-bind-command.js';
import { BaseBind } from '../src/base-bind.js';
import { MetaObject } from 'logic-entity';
import { Message } from '../src/message-wrap.js';

// const {MetaRegistry} = global._L;
// const {BindCommand} = global._L;
// const {BindModel} = global._L;

// const {MetaTable} = global._L;
// const {BaseBindCommand} = global._L;
// const {BaseBind} = global._L;
// const {MetaObject} = global._L;


import axios from 'axios';

// import { TextEncoder, TextDecoder } from 'util';

// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// import { http } from 'msw';
// import { setupWorker } from 'msw/browser';

// const server = setupWorker();
// const  axios  = require("axios");
// jest.mock('axios');

const T = true;
// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass; 

//==============================================================
// test
describe("[target: bind-commnad.js]", () => {
  // beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // afterEach(() => server.resetHandlers());
  // afterAll(() => server.close());  
    describe("BindCommand :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            // MetaRegistry.init();
            jest.restoreAllMocks();
            globalThis.isDOM = true;
        });
        describe("BindModel.addSelector() : 셀렉터 추가", () => {
            it("- 기본 추가 ", () => {              
                document.body.innerHTML = `
                <input id="myInput" value="Hello">
                <div id="myDiv">Some text</div>
                <span id="mySpan"><strong>Bold</strong></span>
                <p id="emptyPara"></p>
                `;
                var bm1 = new BindModel();
                bm1.addSelector('aa', '#myInput');
                bm1.addSelector('bb', '#myDiv');
                bm1.addSelector('cc', '#mySpan');
                bm1.addSelector('dd', '#emptyPara');

                expect(bm1.cols.aa.value).toBe('Hello')
                expect(bm1.cols.bb.value).toBe('Some text')
                expect(bm1.cols.cc.value).toBe('<strong>Bold</strong>')
                expect(bm1.cols.dd.value).toBe('')
            });
            it("- 명령에 추가 ", async () => {              
                Object.defineProperty(navigator, 'languages', {
                    configurable: true,
                    get: () => ['ko_KR', 'ko'],
                });
                await Message.autoDetect();

                document.body.innerHTML = `
                <input id="myInput" value="Hello">
                <div id="myDiv">Some text</div>
                <span id="mySpan"><strong>Bold</strong></span>
                <input id="myInput2" value="">
                <p id="emptyPara"></p>
                `;
                var bm1 = new BindModel();
                bm1.addSelector('aa', '#myInput', 'read');
                bm1.addSelector('bb', '#myDiv', 'read');
                bm1.addSelector('cc', '#mySpan', 'read');
                bm1.addSelector('dd', '#emptyPara', 'read');
                bm1.addSelector('ee', '#myInput2', 'read');

                expect(bm1.cols.aa.selector.type).toBe('value')
                expect(bm1.cols.bb.selector.type).toBe('text')
                expect(bm1.cols.cc.selector.type).toBe('html')
                expect(bm1.cols.dd.selector.type).toBe('text')
                expect(bm1.cols.ee.selector.type).toBe('value')

                expect(bm1.cmd.read.output.cols.aa.value).toBe('Hello')
                expect(bm1.cmd.read.output.cols.bb.value).toBe('Some text')
                expect(bm1.cmd.read.output.cols.cc.value).toBe('<strong>Bold</strong>')
                expect(bm1.cmd.read.output.cols.dd.value).toBe('')
                expect(bm1.cmd.read.output.cols.ee.value).toBe('')
            });
            it("- 지정한 테이블에 추가 ", async () => {              
                Object.defineProperty(navigator, 'languages', {
                    configurable: true,
                    get: () => ['ko_KR', 'ko'],
                });
                await Message.autoDetect();

                document.body.innerHTML = `
                <input id="myInput" value="Hello">
                <div id="myDiv">Some text</div>
                <span id="mySpan"><strong>Bold</strong></span>
                <p id="emptyPara"></p>
                `;
                var bm1 = new BindModel();
                bm1.addSelector('aa', '#myInput', null, null, 'second');
                // bm1.addSelector('bb', '#myDiv', 'read');
                // bm1.addSelector('cc', '#mySpan', 'read');
                // bm1.addSelector('dd', '#emptyPara', 'read');

                expect(bm1._tables['second'].cols.aa.value).toBe('Hello')

                // expect(bm1.cmd.read.output.cols.aa.value).toBe('Hello')
                // expect(bm1.cmd.read.output.cols.bb.value).toBe('Some text')
                // expect(bm1.cmd.read.output.cols.cc.value).toBe('<strong>Bold</strong>')
                // expect(bm1.cmd.read.output.cols.dd.value).toBe('')
            });
        });
        describe("BindModel.checkSelector() : 셀렉터 체크", () => {
            it("- 확인 ", async () => {              
                // const { BindModel } = await import('../src/bind-model.js');
                // const { MetaView } = await import('logic-bind-model');
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                var bm1 = new BindModel({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                        bb: ''
                    },
                })

                expect(bm1.checkSelector().length).toBe(0)
            });
            it("- 실패 ", () => {
                document.body.innerHTML = `
                    <input id="newTodoInput" />
                    <button id="addTodoBtn">Add todo</button>
                    <ol id="todoList"></ol>
                `;
                var bm2 = new BindModel({
                    items: {
                        bb:  {selector: {key: '#ERR'}},
                    },
                })

                expect(bm2.checkSelector().length).toBe(1)
            });
            it("- 실패 2 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                var result = [];
                console.warn = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm2 = new BindModel({
                    items: {
                        bb:  {selector: {key: '#ERR'}},
                    },
                })

                expect(bm2.checkSelector(null, true).length).toBe(1)
                expect(result[0]).toMatch(/selector/);
            });
            it("- 예외 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                var bm1 = new BindModel({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                    },
                })

                expect(()=> bm1.checkSelector(1)).toThrow('PropertyCollection')
            });
        });
        describe("BindModel.getSelector() : 셀렉터 얻기", () => {
            it("- 확인 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                var bm1 = new BindModel({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                        bb: ''
                    },
                })
                var bm2 = new BindModel({
                    items: {
                        bb:  {selector: {key: '#ERR'}},
                    },
                })

                expect(1).toBe(1)
                expect(bm1.getSelector()).toEqual([ {key: '#todoList'}])
                expect(bm2.getSelector()).toEqual([{key: '#ERR'}])
            });
            it("- 예외 ", () => {
                document.body.innerHTML = `
                <input id="newTodoInput" />
                <button id="addTodoBtn">Add todo</button>
                <ol id="todoList"></ol>
                `;
                var bm1 = new BindModel({
                    items: {
                        aa: {selector: {key: '#todoList'}},
                    },
                })

                expect(()=> bm1.getSelector(1)).toThrow('PropertyCollection')
            });
        });
        describe("BindCommand.execute(): 실행 ", () => {
            // beforeEach(() => {
            //     function ajax_response(response, success) {
            //         return function (params) {
            //           if (success) {
            //             // params.success(response);
            //             params.done(response);
            //           } else {
            //             // params.error(response);
            //             params.fail(response);
            //           }
            //           if (typeof params.complete === 'function') params.complete(response);
            //         };
            //     }
            //     var result = { 
            //         "entity": {
            //             "return": 0,
            //             "rows_total": 2,     
            //             "rows": {
            //                     "row_count": 1,
            //                     "acc_idx": 3,
            //                     "adm_id": "logicfeel",
            //                     "admName": "관리자명."
            //             }
            //         }
            //     };
            //     jQuery.ajax = ajax_response(result, true); 
            //     // jQuery.ajax = jest.fn( (config) => {
            //     //     ajax_response(result, true);
            //     // }); 

            // });
            const result = { 
              "entity": {
                  "return": 0,
                  "rows_total": 2,     
                  "rows": {
                          "acc_idx": 3,
                          "adm_id": "logicfeel",
                          "admName": "관리자명."
                  }
              }
            };
            beforeEach(() => {
              // function ajax_response(response, success) {
              //     return function (params) {
              //       if (success) {
              //         // params.success(response);
              //         params.done(response);
              //       } else {
              //         // params.error(response);
              //         params.fail(response);
              //       }
              //       if (typeof params.complete === 'function') params.complete(response);
              //     };
              // }
              // var result = { 
              //     "entity": {
              //         "return": 0,
              //         "rows_total": 2,     
              //         "rows": {
              //                 "row_count": 1,
              //                 "acc_idx": 3,
              //                 "adm_id": "logicfeel",
              //                 "admName": "관리자명."
              //         }
              //     }
              // };
              // function ajax_response(response) {
              //   var deferred = jQuery.Deferred().resolve(response);
              //   return deferred.promise;
              // }

              // jQuery.ajax = ajax_response(result); 
              // jQuery.ajax = jest.fn( (config) => {
              //     ajax_response(result, true);
              // }); 
              const body = { 
                "entity": {
                    "return": 0,
                    "rows_total": 2,     
                    "rows": {
                            "acc_idx": 3,
                            "adm_id": "logicfeel",
                            "admName": "관리자명."
                    }
                }
              };
              const res = {data: body, status: 200};
              axios.mockResolvedValue(res);

            });
            it.skip("- 확인 axios ", async () => {
              var bm = new BindModel();
              var bc = new BindCommand(bm, 'VIEW');
              // bc.config.async = false;
              // bc.cbEnd = ()=> {
              //   expect(bc.output.columns.count).toBe(3);
              //   expect(bm.columns.count).toBe(3);
              //   // done();
              // }
              
              await bc.execute()

              expect(bc.output.columns.count).toBe(3);
              expect(bm.columns.count).toBe(3);
              // logSpy.mockRestore();
              // done();
            });

            it.skip("- 확인 ", () => {
              var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
              jQuery.support.cors = true;
              jQuery.ajaxSettings.xhr = function() {
                  return new XMLHttpRequest();
              };
              // expect.assertions(1);
              function ajax_response(response) {
                var deferred = jQuery.Deferred().resolve(response);
                return deferred.promise;
              }
              jQuery.ajax = ajax_response(result);    // REVIEW: overlap
              var bm = new BindModel();
              var bc = new BindCommand(bm, 'VIEW');
              // bc.config.async = false;
              bc.cbEnd = ()=> {
                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
                // done();
              }
              
              bc.execute()

              expect(bc.output.columns.count).toBe(3);
              expect(bm.columns.count).toBe(3);
              // logSpy.mockRestore();
              // done();
            });
            // POINT: 임의로 스킵해둠..
            it.skip("- 확인 2 ",  async () => {
              expect.assertions(1);

              var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
              jQuery.support.cors = true;
              jQuery.ajaxSettings.xhr = function() {
                  return new XMLHttpRequest();
              };

              // expect.assertions(1);
              var bm = new BindModel();
              var bc = new BindCommand(bm, 'VIEW');
              bm.url = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
              // bc.config.async = false;
              // bc.crossDomain = true;
              bc.cbEnd = ()=> {
                // expect(bc.output.columns.count).toBe(20);
                // expect(bm.columns.count).toBe(10);
                // done();
              }
              await bc.execute()

              expect(bc.output.columns.count).toBe(10);
              // expect(bm.columns.count).toBe(3);

              // expect(bc.output.columns.count).toBe(4);
              // expect(bm.columns.count).toBe(4);
              // logSpy.mockRestore();
              // done();
              console.log('...');
              
            });
            it.skip("- 확인 3 ", () => {
              var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

              jQuery.support.cors = true;
              jQuery.ajaxSettings.xhr = function() {
                  return new XMLHttpRequest();
              };

              try {
                jQuery.ajax({
                  url: 'http://127.0.0.1:8080/json/sample_row_single.json',
                })
                .done(function(date, status, xhr) {
                    // p_config.success.call(this, date, status, xhr);
                    console.log('done call');
                  })
                .fail(function(status, xhr) {
                    // p_config.error.call(this, status, xhr);
                  console.log('fail call');
                });

              } catch (e) {
              console.log('e call');

              }

              console.log('fail call');
            });
            it.skip("- 확인 4 ", () => {
              var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

              jQuery.support.cors = true;
              jQuery.ajaxSettings.xhr = function() {
                  return new XMLHttpRequest();
              };

              
              try {
                jQuery.ajax({
                  url: 'http://127.0.0.1:8080/json/sample_row_single.json',
                  success: function(date, status, xhr) {
                    // p_config.success.call(this, date, status, xhr);
                    console.log('done call');
                  },
                  error: function(status, xhr) {
                    // p_config.error.call(this, status, xhr);
                  console.log('fail call');
                  }
                });

              } catch (e) {
                console.log('e call');

              } finally {
                done()
              }

            });

            it.skip("- 확인 5 ", () => {
              var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

              jQuery.support.cors = true;
              jQuery.ajaxSettings.xhr = function() {
                  return new XMLHttpRequest();
              };

              jQuery.ajax({    
                // type : 'post',           // 타입 (get, post, put 등등)    
                url : 'http://127.0.0.1:8080/json/sample_row_single.json',           // 요청할 서버url    
                // async : true,            // 비동기화 여부 (default : true)    
                // headers : {              // Http header      
                //   "Content-Type" : "application/json",      
                //   "X-HTTP-Method-Override" : "POST"    
                // },    
                responseType : 'json',       // 데이터 타입 (html, xml, json, text 등등)    
                data : {},    
                success : function(result) { // 결과 성공 콜백함수        
                  console.log(result);    
                },    
                error : function(request, status, error) { // 결과 에러 콜백함수        
                  console.log(error)    
                }});

                console.log('fail call');
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
                      if (typeof params.complete === 'function') params.complete(response);
                    };
                }
                var result = `{ 
                    "entity": {
                        "return": 0,
                        "rows_total": 2,     b
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

                var bm = new BindModel();
                var bc = new BindCommand(bm, 'VIEW');
                bc.execute()
                
                expect(logSpy).toHaveBeenCalledTimes(1);
                expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                logSpy.mockRestore();
            });
            it.skip("- 에러 로그 2 ", () => {
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

                var bm = new BindModel();
                var bc = new BindCommand(bm, "VIEW");
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
        //         var bm = new BindModel();
        //         var bc = new BindCommand(bm);
        //         var obj  = bc.getObject()

        //         expect(obj._type).toBe("Meta.Bind.BindCommand")
        //         expect(typeof obj._guid).toBe('string')
        //         expect(obj._guid.length > 0).toBe(true)
        //     });
        //     it("- output 추가 ", () => {
        //         var bm = new BindModel();
        //         var bc = new BindCommand(bm);
        //         bc.newOutput();
        //         bc.newOutput('etc');
        //         var obj  = bc.getObject()

        //         expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
        //         expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
        //     });
        // });
        // describe("MetaObject.setObject() : 객체 설정 ", () => {
        //     it("- 확인 ", () => {
        //         var bm = new BindModel()
        //         bm.addCommand('read')
        //         var bc1 = bm.cmd.read;
        //         bc1.newOutput();
        //         var obj  = bm.getObject()
        //         var b2 = new BindModel()
        //         b2.setObject(obj);

        //         expect(bm.equal(b2)).toBe(true)
        //     });
        //     // command 만 분리해서 가져오는건 의미가 없음
        //     it.skip("- command setObject() ", () => {
        //         var bm = new SubBaseBindModel()
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
