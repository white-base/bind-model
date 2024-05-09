/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';

const { MetaRegistry } = require("logic-entity");
const { BindCommandAjax } = require("../src/bind-command-ajax");
const { BindModelAjax } = require("../src/bind-model-ajax");

// const request                 = require('request');
const { MetaTable } = require("logic-entity");
const { BindCommand } = require("../src/bind-command");
const { BaseBind } = require("../src/base-bind");
const { MetaObject } = require("logic-entity");
const  axios  = require("axios");

jest.mock('axios');
// import axios from 'axios';


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
        describe("BindCommandAjax.config: 기본 ajax 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var ajax = {url: null, method: null, responseType: null}
                
                expect(bc.config).toEqual(ajax);
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var ajax1 = {url: null, method: null, responseType: null}
                var ajax2 = {url: 'a', method: 'POST', responseType: 'json'}
                var ajax3 = {url: 'a', method: 'POST', responseType: 'json'}
                
                expect(bc.config).toEqual(ajax1);
                bc.config = ajax2
                expect(bc.config).toEqual(ajax3);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                
                expect(()=>bc.config = 10).toThrow('config')
            });
        });
        describe("BindCommandAjax.url: 기본 ajax url 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                var url = 'URL'
                bc.url = url

                expect(bc.config.url).toBe(url);
                expect(bc.url).toBe(url);
            });
            it("- 예외 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm);
                
                expect(()=>bc.url = {}).toThrow('string')
                expect(()=>bc.url = '').toThrow('string')
            });
        });
        describe("BindCommandAjax._execBind() ", () => {
            beforeEach(() => {
                const body = {
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
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

            });
            it("- baseConfig 설정 ", async () => {
                expect.assertions(1);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                var setup = {url: 'http://127.0.0.1:8080/json/sample_row_single.json', method: 'GET', responseType: 'json', async: true, crossDomain: true}
                bm.baseConfig = setup
                await bc._execBind();

                expect(bc.output.columns.count).toBe(4);
                // expect(bm.columns.count).toBe(4);
            });
            it("- baseConfig 설정 2 비동기 ", () => {
                expect.assertions(1);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                var setup = {url: 'http://127.0.0.1:8080/json/sample_row_single.json', method: 'GET', responseType: 'json', async: true, crossDomain: true}
                bm.baseConfig = setup
                bc._execBind();

                expect(bc.output.columns.count).toBe(0);
                // expect(bm.columns.count).toBe(4);
            });
            // it("- config 설정 ", () => {
            //     var bm = new BindModelAjax();
            //     var bc = new BindCommandAjax(bm, 1);
            //     var setup = {url: 'a2', type: 'GET', responseType: 'json', async: true, crossDomain: true}
            //     bc.config = setup
            //     bc._execBind();

            //     expect(bc.output.columns.count).toBe(4);
            //     expect(bm.columns.count).toBe(4);
            // });
            it("- config 설정 3", async () => {
                const body = {
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
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                // var setup = {url: 'a', type: 'POST', responseType: 'json', async: true}
                // bc.config = setup
                await bc._execBind();

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
            });
            // it("- 예외 ", () => {
            //     var bm = new BindModelAjax();
            //     var bc = new BindCommandAjax(bm);
                
            //     expect(()=>bc.url = {}).toThrow('string')
            //     expect(()=>bc.url = '').toThrow('string')
            // });
        });
        describe("BindCommandAjax.execute(): 실행 (get) ", () => {
            beforeEach(() => {
                // request.get = jest.fn( (config, cb) => {
                //     const response = { statusCode: 200 };
                //     const body = `
                //     {
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
                //     }`;
                //     cb(null, response, body);
                // }); 
                const body = {
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
                const res = {data: body, status: 200};
                // jest.mock('axios');
                axios.get.mockResolvedValue(res);
            });
            it("- 확인 ", async () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                await bc.execute()

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
            });
            it("- 오류 ", async () => {
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.cbEnd = ()=>{
                    throw new Error('강제오류')
                }
                // expect(async ()=>await bc.execute()).toThrow('aaa')
                await bc.execute()
                 
                // expect(()=>bc.execute()).toThrow('강제오류')
                expect(result[0]).toMatch(/강제오류/);
                // expect(bc.output.columns.count).toBe(4);
                // expect(bm.columns.count).toBe(4);
            });
            it("- 에러 로그 ", () => {
                // request.get = jest.fn( (config, cb) => {
                //     const response = { statusCode: 200 };
                //     const body = `
                //     {
                //         "entity": {
                //             "return": 0,
                //             "rows_total": 2,     
                //             "rows": {
                //                     "row_count": 1,
                //             }
                //         }
                //     }`;
                //     cb(null, response, body);
                // });
                // const logSpy = jest.spyOn(console, 'error');
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.cbBegin = ()=> {throw new Error('begin오류')};
                bc.execute()
                
                expect(result[0]).toMatch(/begin오류/);
                expect(()=>bc.url = {}).toThrow('string')
                // logSpy.mockRestore();
                // expect(()=>bc.url = '').toThrow('string')
            });
        });
        describe("BindCommandAjax.execute(): 실행 (post) ", () => {
            beforeEach(() => {
                // request.post = jest.fn( (config, cb) => {
                //     const response = { statusCode: 200 };
                //     const body = `
                //     {
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
                //     }`;
                //     cb(null, response, body);
                // });
                const body = {
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
                const res = {data: body, status: 200};
                // jest.mock('axios');
                axios.post.mockResolvedValue(res);

            });
            it("- 확인 ", async () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.config.method = 'POST'
                await bc.execute()

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
            });
            it("- 에러 로그 ", async () => {
                // request.post = jest.fn( (config, cb) => {
                //     const response = { statusCode: 200 };
                //     const body = `
                //     {
                //         "entity": {
                //             "return": 0,
                //             "rows_total": 2,     
                //             "rows": {
                //                     "row_count": 1,
                //             }
                //         }
                //     }`;
                //     cb(null, response, body);
                // });
                // const logSpy = jest.spyOn(console, 'error');
                const errorMessage = 'Network Error';
                axios.post.mockImplementationOnce(() =>
                    Promise.reject(new Error(errorMessage)),
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.config.method = 'POST'
                await bc.execute()
                
                
                // expect(logSpy).toHaveBeenCalledTimes(1);
                // expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                expect(result[0]).toMatch(/Network Error/);
                // logSpy.mockRestore();
                // expect(()=>bc.url = '').toThrow('string')
            });
        });
        describe("BindCommandAjax.execute(): 실행 (put) ", () => {
            beforeEach(() => {
                // request.defaults = jest.fn( (config, cb) => {
                //     const response = { statusCode: 200 };
                //     const body = `
                //     {
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
                //     }`;
                //     cb(null, response, body);
                // }); 
            });
            it.skip("- 확인 ", () => {
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.config.type = 'PUT'
                bc.execute()

                expect(bc.output.columns.count).toBe(4);
                expect(bm.columns.count).toBe(4);
            });
            it("- 확인 : POST, entity", async () => {
                const body = {
                    "entity": {
                        "return": 0,
                        "rows_total": 2,     
                        "rows": {
                                "adm_id": "logicfeel",
                                "admName": "관리자명."
                        }
                    }
                };
                const res = {data: body, status: 200};
                axios.post.mockResolvedValue(res);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.config.method = 'POST'
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
            });
            it("- 확인 : GET, array enrity", async () => {
                const body = [
                    {
                        "rows": {
                            "acc_idx": 3
                        }
                    },
                    {
                        "rows": {
                            "adm_id": "logicfeel",
                            "admName": "관리자명."
                        }
                    }
                ];
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                await bc.execute()

                expect(bc.output.columns.count).toBe(1);
                expect(bm.columns.count).toBe(3);
            });
            it("- 확인 : GET, 단일 output 단일 index", async () => {
                const body = {
                    "rows": [
                        {
                            "adm_id": "logicfeel",
                            "admName": "관리자명"
                        },
                        {
                            "adm_id": "logicfeel 2",
                            "admName": "관리자명 2"
                        }
                    ]
                };
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                bc.addColumnValue('adm_id', '', 'output');
                bc.addColumnValue('admName', '', 'output');
                bc.outputOption.index = 1
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(bm.columns.adm_id.value).toBe('logicfeel 2');
                expect(bm.columns.admName.value).toBe('관리자명 2');
            });
            it("- 실패 : GET, 단일 row 존재하지 않음", async () => {
                const body = {
                    "rows": {}
                };
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);
                
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                await bc.execute()

                expect(bc.output.columns.count).toBe(0);
                expect(bm.columns.count).toBe(0);
                expect(result[0]).toMatch(/컬럼이/);
            });
            it("- 실패 : GET, 단일 output 단일 index 존재하지 않음", async () => {
                const body = {
                    "rows": [
                        {
                            "adm_id": "logicfeel",
                            "admName": "관리자명"
                        },
                        {
                            "adm_id": "logicfeel 2",
                            "admName": "관리자명 2"
                        }
                    ]
                };
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                bc.addColumnValue('adm_id', '', 'output');
                bc.addColumnValue('admName', '', 'output');
                bc.outputOption.index = 2
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(result[0]).toMatch(/row가/);
                expect(bm.columns.adm_id.value).toBe('');
                expect(bm.columns.admName.value).toBe('');
            });
            it("- 실패 : GET, 단일 output 문자열 index ", async () => {
                const body = {
                    "rows": [
                        {
                            "adm_id": "logicfeel",
                            "admName": "관리자명"
                        },
                        {
                            "adm_id": "logicfeel 2",
                            "admName": "관리자명 2"
                        }
                    ]
                };
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                bc.addColumnValue('adm_id', '', 'output');
                bc.addColumnValue('admName', '', 'output');
                bc.outputOption.index = ['ERR']
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(result[0]).toMatch(/인덱스가/);
                expect(bm.columns.adm_id.value).toBe('');
                expect(bm.columns.admName.value).toBe('');
            });
            it("- 확인 : GET, 멀티 output 멀티 index", async () => {
                const body = [
                    {
                        "rows": [
                            {
                                "adm_id": "10"
                            },
                            {
                                "adm_id": "20"
                            }
                        ]
                    },
                    {
                        "rows": [
                            {
                                "admName": "30"
                            },
                            {
                                "admName": "40"
                            }
                        ]
                    }
                ];
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                bc.newOutput();
                bc.addColumnValue('adm_id', '', 'output1');
                bc.addColumnValue('admName', '', 'output2');
                bc.outputOption.index = [0, 1]
                await bc.execute()

                expect(bc.output1.columns.count).toBe(1);
                expect(bc.output2.columns.count).toBe(1);
                expect(bc.output1.columns.adm_id.value).toBe('10');
                expect(bc.output2.columns.admName.value).toBe('40');
                expect(bm.columns.count).toBe(2);
                expect(bm.columns.adm_id.value).toBe('10');
                expect(bm.columns.admName.value).toBe('40');
            });
            it("- 실패 : GET, 멀티 output 멀티 index", async () => {
                const body = [
                    {
                        "rows": [
                            {
                                "adm_id": "10"
                            },
                            {
                                "adm_id": "20"
                            }
                        ]
                    },
                    {
                        "rows": [
                            {
                                "admName": "30"
                            },
                            {
                                "admName": "40"
                            }
                        ]
                    }
                ];
                const res = {data: body, status: 200};
                axios.get.mockResolvedValue(res);

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 3);
                bc.newOutput();
                bc.addColumnValue('adm_id', '', 'output1');
                bc.addColumnValue('admName', '', 'output2');
                bc.outputOption.index = [1, 2]
                await bc.execute()

                expect(bc.output1.columns.count).toBe(1);
                expect(bc.output2.columns.count).toBe(1);
                expect(result[0]).toMatch(/row가/);
                expect(bc.output1.columns.adm_id.value).toBe('20');
                expect(bc.output2.columns.admName.value).toBe('');
                expect(bm.columns.count).toBe(2);
                expect(bm.columns.adm_id.value).toBe('20');
                expect(bm.columns.admName.value).toBe('');
            });
            it.skip("- 에러 로그 ", () => {
                request.defaults = jest.fn( (config, cb) => {
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
                // const logSpy = jest.spyOn(console, 'error');
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 

                var bm = new BindModelAjax();
                var bc = new BindCommandAjax(bm, 1);
                bc.config.type = 'PUT'
                bc.execute()
                
                expect(result[0]).toMatch(/오류/);
                // expect(logSpy).toHaveBeenCalledTimes(1);
                // expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                // logSpy.mockRestore();
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
                    // expect(bc.$KEYWORD.indexOf('output1')> -1).toBe(true)
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
                    expect(bc.$KEYWORD.indexOf('config')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('url')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execValid')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execBind')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execOutput')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_execError')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxSuccess')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxComplete')> -1).toBe(true)
                    expect(bc.$KEYWORD.indexOf('_ajaxCall')> -1).toBe(true)
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
                it("- 독립 테이블 사용 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new BindCommandAjax();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new BindCommandAjax();
                    bc2.setObject(obj);

                    expect(bc1.equal(bc2)).toBe(true)
                    expect(bc1._baseTable.equal(bc2._baseTable)).toBe(true)
                });
                // command 만 분리해서 가져오는건 의미가 없음
                // it.skip("- command setObject() ", () => {
                //     var bm = new SubBindModel()
                //     bm.addCommand('read')
                //     var bc1 = bm.cmd.read;
                //     bc1.newOutput();
                //     var obj  = bc1.getObject()
                //     bm.addCommand('list')
                //     var bc2 = bm.cmd.list;
                //     bc2.setObject(obj);

                //     expect(bm.equal(b2)).toBe(true)
                // });
            });
        });
    });
});
