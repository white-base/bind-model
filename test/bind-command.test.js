// ES6, cjs, jest
//==============================================================
// gobal defined
// 'use strict';

// const { MetaRegistry } = require("logic-bind-model");
// const { BindCommand } = require("logic-bind-model");
// const { BindModel } = require("logic-bind-model");

// // // const request                 = require('request');
// const { MetaTable } = require("logic-bind-model");
// const { BaseBindCommand } = require("logic-bind-model");
// const { BaseBind } = require("logic-bind-model");
// const { MetaObject } = require("logic-bind-model");
// const  axios  = require("axios");

// jest.mock('axios');
import { jest } from '@jest/globals';

import { Message } from '../src/message-wrap';
import { MetaRegistry } from 'logic-entity';
import { BindCommand } from '../src/bind-command';
import { BindModel } from '../src/bind-model';
import { MetaTable } from 'logic-entity';
import { BaseBindCommand } from '../src/base-bind-command';
import { BaseBind } from '../src/base-bind';
import { MetaObject } from 'logic-entity';

// jest.unstable_mockModule('axios', () => {
//     // 개별 메서드를 mock
//     const get = jest.fn();
//     const post = jest.fn();
//     const request = jest.fn();
    
//     const axiosFn = jest.fn();

//     // 직접 mockReset 메서드 구현
//     const mockAxios = {
//       get,
//       post,
//       request,
//       mockReset: () => {
//         get.mockReset();
//         post.mockReset();
//       }
//     };
  
//     return {
//       default: mockAxios
//     };
//   });

//////////////////
// let mockResponse;  // ✅ 이 값을 테스트마다 설정

// jest.unstable_mockModule('axios', async () => {
//     const axiosMock = jest.fn();
  
//     axiosMock.mockImplementation(() => Promise.resolve(mockResponse));
//     // const { default: axios } = await import('axios');
//     // const axiosClass = (await import('axios'));
//     // axiosClass.prototype.request = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));
    
//     axiosMock.mockReset = () => axiosMock.mockClear();
//     axiosMock.create = jest.fn(() => axiosMock);
//     axiosMock.get = jest.fn();
//     axiosMock.request = jest.fn();
//     axiosMock.create = jest.fn(() => axiosMock);
//     return {
//       default: axiosMock
//     };
// });

// const { default: axios } = await import('axios');
//////////////////
//   const { fetchData } = await import('./fetchData.js');


// Step 1: axios 모듈을 mocking
// jest.unstable_mockModule('axios', () => {
//     const get = jest.fn();
//     const post = jest.fn();
  
//     // Step 2: mockReset을 직접 구현
//     const mockAxios = {
//       get,
//       post,
//       mockReset: () => {
//         get.mockReset();
//         post.mockReset();
//       }
//     };
  
//     return {
//       default: mockAxios
//     };
// });

import axios from 'axios';

// jest.mock('axios');
// jest.mock('axios', () => {
//     const mockAxios = {
//       get: jest.fn(),
//       post: jest.fn(),
//       mockReset: jest.fn(() => {
//         mockAxios.get.mockReset();
//         mockAxios.post.mockReset();
//       }),
//     };
//     return mockAxios;
//   });
// import { rest } from 'msw';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
const T = true;

const server = setupServer();


describe.skip('axios mock test with mockReset', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'warn' });
        
    });
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
    afterEach(() => server.resetHandlers());
    afterAll(() => {
        server.close()
    });
    // beforeEach(() => {
    //   axios.mockReset(); // 이게 이제 정상 동작함
    // });
  
    it('GET /api/user returns user data', async () => {
        
        server.use(
            http.get('http://localhost/api/user', () => {
                return HttpResponse.json({ id: 1, name: 'Alice' });
            })
        );
        
        const response = await axios.get('http://localhost/api/user');
    
        expect(response.status).toBe(200);
        expect(response.data.name).toBe('Alice');
    });

    it("- baseConfig 설정 ", async () => {
        // expect.assertions(2);
        const body = {
            "rows": {
                "aa": 10,
                "bb": "S1",
                "cc": false
            }
        };
        server.use(
            http.get('http://localhost/api/user', () => {
                return HttpResponse.json(body);
            })
        );
        // server.use(
        //     http.get('http://localhost/api/user', (req, res, ctx) => {
        //         return res(ctx.json(body));
        //     })
        // );
        
        var bm = new BindModel();
        var bc = new BindCommand(bm, 1);
        
        var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json'}
        bm.baseConfig = setup
        await bc._execBind();

        expect(bc.output.columns.count).toBe(3);
        // expect(bm.columns.count).toBe(3);

        // await new Promise(resolve => setTimeout(resolve, 1000));
    });
    it('should call axios.get with correct URL', async () => {
        const body = {
            "rows": {
                "aa": 10,
                "bb": "S1",
                "cc": false
            }
        };
        server.use(
            http.get('http://localhost/api/user', () => {
                return HttpResponse.json(body);
            })
        );

        var  aaa;
        function ajaxCall(p_config) {
            return axios(p_config)
            .then(function(res){
                aaa = res;
                console.log(res);
                // return res;
            })
            .catch(function(err){
                console.log(err);
            });
        }

        var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json'}
        const bbb = await ajaxCall(setup);
        const response = await axios.get('http://localhost/api/user');

        expect(response.status).toBe(200);
        expect(response.data.rows.aa).toBe(10);
    });
    it.skip('should call axios.get with correct URL', async () => {
      axios.get.mockResolvedValue({ data: { ok: true } });
  
      const result = await axios.get('/api/data');
      expect(result.data.ok).toBe(true);
    });
  });

  
//==============================================================
// test
describe("[target: bind-commnad.js]", () => {
    // beforeAll(() => {
    //     let  axios  = require("axios");
    //     jest.mock('axios');
    // });
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    describe("BindCommand :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
            // axios.mockReset();
            // axios.mockReset(); // 이게 이제 정상 동작함
        });
        describe("BindCommand.BindCommand(): 생성자", () => {
            it("- 확인", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);

                expect(bc instanceof BindCommand).toBe(true)
            });
        });
        describe(" BindCommand static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindCommand._UNION).toEqual([])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindCommand._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindCommand._PARAMS).toEqual(['_model', 'outputOption', '_baseTable'])
            });
        });
        describe("BindCommand.config: 기본 ajax 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);
                var ajax = {url: null, method: null, responseType: null}
                
                expect(bc.config).toEqual(ajax);
            });
            it("- 변경 ", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);
                var ajax1 = {url: null, method: null, responseType: null}
                var ajax2 = {url: 'a', method: 'POST', responseType: 'json', data: {dd: 10}}
                var ajax3 = {url: 'a', method: 'POST', responseType: 'json', data: {dd: 10}}
                
                expect(bc.config).toEqual(ajax1);
                bc.config = ajax2
                expect(bc.config).toEqual(ajax3);
            });
            it("- 예외 ", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);
                
                expect(()=>bc.config = 10).toThrow('config')
            });
        });
        describe("BindCommand.url: 기본 ajax url 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);
                var url = 'URL'
                bc.url = url

                expect(bc.config.url).toBe(url);
                expect(bc.url).toBe(url);
            });
            it("- 예외 ", () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm);
                
                expect(()=>bc.url = {}).toThrow('string')
                expect(()=>bc.url = '').toThrow('string')
            });
        });
        describe("BindCommand._execBind() ", () => {
            beforeEach(() => {
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );
            });
            it("- baseConfig 설정 ", async () => {
                expect.assertions(2);

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                
                var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json'}
                bm.baseConfig = setup
                await bc._execBind();

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);

                // await new Promise(resolve => setTimeout(resolve, 10));
            });
            it("- baseConfig 설정 2", async () => {
                expect.assertions(1);

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json', data: { aa: 10 }}
                bm.baseConfig = setup
                await bc._execBind();

                expect(bc.output.columns.count).toBe(3);
            });
            it("- baseConfig 설정, data 와 컬럼명 중복시", async () => {
                expect.assertions(1);

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.addColumnValue('aa', 1);
                var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json', data: { aa: 10 }}
                bm.baseConfig = setup
                await bc._execBind();

                expect(bc.output.columns.count).toBe(3);
            });
            // TODO: async.test 로 이동
            it("- baseConfig 설정 2 비동기 ", () => {
                expect.assertions(1);

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                var setup = {url: 'http://localhost/api/user', method: 'GET', responseType: 'json'}
                bm.baseConfig = setup
                bc._execBind();

                expect(bc.output.columns.count).toBe(0);
                // expect(bm.columns.count).toBe(4);
            });
            // it("- 예외 ", () => {
            //     var bm = new BindModel();
            //     var bc = new BindCommand(bm);
                
            //     expect(()=>bc.url = {}).toThrow('string')
            //     expect(()=>bc.url = '').toThrow('string')
            // });
        });
        describe("BindCommand.execute(): 실행 (get) ", () => {
            beforeEach(() => {
                
            });
            it("- 확인 ", async () => {
                expect.assertions(2);
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
            });
            it("- 확인 : _baseEntity 해제시 ", async () => {
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.output._baseEntity = null;
                bm.url = 'http://localhost/api/user'
                await bc.exec()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(0);
            });
            it("- 확인 : GET, array enrity", async () => {
                const body = [
                    {
                        "rows": [
                            {
                                "aa": 10,
                                "bb": "S1",
                                "cc": false
                            },
                            {
                                "aa": 20,
                                "bb": "S2",
                                "cc": true
                            },
                            {
                                "aa": 30,
                                "bb": "S3",
                                "cc": "true"
                            }
                        ]
                    },
                    {
                        "rows": {
                            "aa": 100,
                            "bb": "S10",
                            "cc": true
                        }
                    }
                ];
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
            });
            it("- 확인 : GET, 단일 output 단일 index", async () => {
                const body = {
                    "rows": [
                        {
                            "aa": 10,
                            "bb": "S1",
                            "cc": false
                        },
                        {
                            "aa": 20,
                            "bb": "S2",
                            "cc": true
                        },
                        {
                            "aa": 30,
                            "bb": "S3",
                            "cc": "true"
                        }
                    ]
                };
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bc.addColumnValue('aa', '', 'output');
                bc.addColumnValue('bb', '', 'output');
                bc.outputOption.index = 1
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(bm.columns.aa.value).toBe(20);
                expect(bm.columns.bb.value).toBe('S2');
            });
            it("- 확인 : GET, array enrity 2", async () => {
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
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(1);
                expect(bm.columns.count).toBe(3);
            });

            
            it("- 실패 : GET, 단일 row 존재하지 않음", async () => {
                const body = {
                    "rows": {}
                };
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );
                
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(0);
                expect(bm.columns.count).toBe(0);
                expect(result[0]).toMatch(/EL06165/);
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
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bc.addColumnValue('adm_id', '', 'output');
                bc.addColumnValue('admName', '', 'output');
                bc.outputOption.index = 2
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(result[0]).toMatch(/EL06166/);
                expect(bm.columns.adm_id.value).toBe('');
                expect(bm.columns.admName.value).toBe('');
            });
            it("- 실패 : GET, 스카마 구조가 없음", async () => {
                const body = "ERROR"
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(result[0]).toMatch(/EL06163/);
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
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bc.addColumnValue('adm_id', '', 'output');
                bc.addColumnValue('admName', '', 'output');
                bc.outputOption.index = ['ERR']
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns.count).toBe(2);
                expect(result[0]).toMatch(/EL06164/);
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
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bc.newOutput();
                bc.addColumnValue('adm_id', '', 'output1');
                bc.addColumnValue('admName', '', 'output2');
                bc.outputOption.index = [0, 1]
                bm.url = 'http://localhost/api/user'
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
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new BindModel();
                var bc = new BindCommand(bm, 3);
                bc.newOutput();
                bc.addColumnValue('adm_id', '', 'output1');
                bc.addColumnValue('admName', '', 'output2');
                bc.outputOption.index = [1, 2]
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output1.columns.count).toBe(1);
                expect(bc.output2.columns.count).toBe(1);
                expect(result[0]).toMatch(/EL06166/);
                expect(bc.output1.columns.adm_id.value).toBe('20');
                expect(bc.output2.columns.admName.value).toBe('');
                expect(bm.columns.count).toBe(2);
                expect(bm.columns.adm_id.value).toBe('20');
                expect(bm.columns.admName.value).toBe('');
            });
            it("- 오류 ", async () => {
                const body = {}
                server.use(
                    http.get('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.cbEnd = ()=>{
                    throw new Error('강제오류')
                }
                bm.url = 'http://localhost/api/user'
                await bc.execute()
                 
                expect(result[0]).toMatch(/강제오류/);
            });
            it("- 에러 로그 ", () => {
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.cbBegin = ()=> {throw new Error('begin오류')};
                bm.url = 'http://localhost/api/user'
                bc.execute()
                
                expect(result[0]).toMatch(/begin오류/);
                expect(()=>bc.url = {}).toThrow('string')
            });
        });
        describe("BindCommand.execute(): 실행 (post) ", () => {
            beforeEach(() => {
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.post('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );

            });
            it("- 확인 ", async () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.config.method = 'POST'
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
            });
            it("- 에러 로그 ", async () => {
                const errorMessage = 'Network Error';
                // axios.mockImplementationOnce(() =>
                //     Promise.reject(new Error(errorMessage))
                // );
                server.use(
                    http.post('http://localhost/api/user', () => {
                        throw new Error(errorMessage)
                        // return HttpResponse.json(body);
                        // return HttpResponse.networkError(errorMessage);
                    })
                );

                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.config.method = 'POST'
                bm.url = 'http://localhost/api/user'
                await bc.execute()
                
                // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                expect(()=>bc.url = {}).toThrow('string')
                expect(result[0]).toMatch(/AxiosError:/);
            });
        });
        describe("BindCommand.execute(): 실행 (put) ", () => {
            beforeEach(() => {
                
            });
            it("- 확인 ", async () => {
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.put('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );
                
                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.config.method = 'PUT'
                bm.url = 'http://localhost/api/user'
                await bc.execute()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
            });
            
            // REVIEW: real.test 로 이동
            
            // POINT: jest.mock 없는 곳에서 테스트 해야함
            it.skip("- 오류 ", async () => {
                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.url = 'http://XX'
                await bc.execute()

                expect(bc.output.columns.count).toBe(3);
                expect(bm.columns.count).toBe(3);
            });

            it("- 에러 로그 ", async () => {
                const body = {
                    "rows": {
                        "aa": 10,
                        "bb": "S1",
                        "cc": false
                    }
                };
                server.use(
                    http.put('http://localhost/api/user', () => {
                        return HttpResponse.json(body);
                    })
                );
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 

                var bm = new BindModel();
                var bc = new BindCommand(bm, 1);
                bc.config.method = 'PUT'
                bc.cbResult = ()=>{throw new Error('오류')}
                bm.url = 'http://localhost/api/user'
                await bc.execute()
                
                expect(result[0]).toMatch(/오류/);
                // expect(logSpy).toHaveBeenCalledTimes(1);
                // expect(logSpy.mock.calls[0][0]).toMatch(/오류/) // REVIEW: 객체를 디버깅해서 구조 파악 가능!
                // expect(()=>bc.url = {}).toThrow('string')
                // logSpy.mockRestore();
                // expect(()=>bc.url = '').toThrow('string')
            });
        });

        describe("MetaObject <- BaseBind <- BaseBindCommand : 상속 ", () => {
            describe("BaseBindCommand.outputOption: 출력 옵션 ", () => {
                beforeEach(() => {
                    const body = {
                        "rows": {
                            "aa": 10,
                            "bb": "S1",
                            "cc": false
                        }
                    };
                    server.use(
                        http.get('http://localhost/api/user', () => {
                            return HttpResponse.json(body);
                        })
                    );
    
                });
                it("- outputOption = 0 ", async () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);
                    bc.addColumnValue('aa', 20);
                    bm.url = 'http://localhost/api/user'
                    await bc.execute()

                    expect(bc.output.columns.count).toBe(1);
                    expect(bm.columns.count).toBe(1);
                    expect(bm.columns.aa.value).toBe(20);
                });
                it("- outputOption = 1 ", async () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm, 1);
                    bc.addColumnValue('aa', 20);
                    bm.url = 'http://localhost/api/user'
                    await bc.execute()

                    expect(bc.output.columns.count).toBe(3);
                    expect(bm.columns.count).toBe(3);
                    expect(bm.columns.aa.value).toBe(20);
                });
                it("- outputOption = 2 ", async () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm, 2);
                    bc.addColumnValue('aa', 20);
                    bm.url = 'http://localhost/api/user'
                    await bc.execute()

                    expect(bc.output.columns.count).toBe(1);
                    expect(bm.columns.count).toBe(1);
                    expect(bm.columns.aa.value).toBe(20);
                    expect(bc.output.rows[0].aa).toBe(10);
                });
                it("- outputOption = 3 ", async () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm, 3);
                    bc.addColumnValue('aa', 100);
                    bm.url = 'http://localhost/api/user'
                    await bc.execute()

                    expect(bc.output.columns.count).toBe(1);
                    expect(bm.columns.count).toBe(1);
                    expect(bm.columns.aa.value).toBe(10);
                    expect(bc.output.rows[0].aa).toBe(10);
                });
                it("- outputOption = 4 초과 ", async () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm, 4);
                    bc.addColumnValue('aa', 20);
                    bm.url = 'http://localhost/api/user'
                    await bc.execute()

                    expect(bc.output.columns.count).toBe(1);
                    expect(bm.columns.count).toBe(1);
                    expect(bm.columns.aa.value).toBe(20);
                });
                // it("- 예외 ", () => {
                //     var bm = new SubBaseBindModel();
                //     var bc = new SubBaseBindCommand(bm);
    
                //     expect(()=> bc.outputOption = true  ).toThrow('outputOption')
                // });
            });
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);
                    
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
                    // BaseBindCommand
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
                    // BindCommand
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
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);

                    expect(bc._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);

                    expect(bc._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);

                    expect(bc._type === BindCommand).toBe(true)
                });
            });
            describe("MetaObject.addColumn() : 컬럼 추가 ", () => {
                it("- addColumn() 확인 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].addColumn('aa');

                    expect(bm.command['cmd1'].valid.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].bind.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].output.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].misc.columns['aa']).toBeDefined()
                    expect(bm.columns['aa']).toBeDefined()
                    expect(bm.first.columns['aa']).toBeDefined()
                    expect(bm._tables['first'].columns['aa']).toBeDefined()
                    expect(bm._tables[0].columns['aa']).toBeDefined()
                });
                it("- addColumn() views 지정 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].addColumn('aa', 'bind');

                    expect(bm.command['cmd1'].valid.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].bind.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].output.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].misc.columns['aa']).not.toBeDefined()
                    expect(bm.columns['aa']).toBeDefined()
                    expect(bm.first.columns['aa']).toBeDefined()
                    expect(bm._tables['first'].columns['aa']).toBeDefined()
                    expect(bm._tables[0].columns['aa']).toBeDefined()
                });
                it("- addColumn() views = $all ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].addColumn('aa', '$all');

                    expect(bm.command['cmd1'].valid.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].bind.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].output.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].misc.columns['aa']).toBeDefined()
                    expect(bm.columns['aa']).toBeDefined()
                    expect(bm.first.columns['aa']).toBeDefined()
                    expect(bm._tables['first'].columns['aa']).toBeDefined()
                    expect(bm._tables[0].columns['aa']).toBeDefined()
                });
                it("- addColumn() views = $all, 추가 테이블 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].newOutput('out2')
                    bm.command['cmd1'].addColumn('aa', '$all');

                    expect(bm.command['cmd1'].valid.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].bind.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].output.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].misc.columns['aa']).toBeDefined()
                    expect(bm.command['cmd1'].out2.columns['aa']).toBeDefined()
                    expect(bm.columns['aa']).toBeDefined()
                    expect(bm.first.columns['aa']).toBeDefined()
                    expect(bm._tables['first'].columns['aa']).toBeDefined()
                    expect(bm._tables[0].columns['aa']).toBeDefined()
                });
                it("- addColumn() views = $all, 추가 테이블 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].newOutput('out2')
                    bm.command['cmd1'].addColumn('aa', 'out2');

                    expect(bm.command['cmd1'].valid.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].bind.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].output.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].misc.columns['aa']).not.toBeDefined()
                    expect(bm.command['cmd1'].out2.columns['aa']).toBeDefined()
                    expect(bm.columns['aa']).toBeDefined()
                    expect(bm.first.columns['aa']).toBeDefined()
                    expect(bm._tables['first'].columns['aa']).toBeDefined()
                    expect(bm._tables[0].columns['aa']).toBeDefined()
                });
            });
            describe("BindCommand.setColumn() ", () => {
                it("- setColumn() : 확인 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');

                    bm.columns.addValue('aa', 'AA')
                    bm.columns.add('bb')        // null
                    bm.columns.addValue('cc')   // null
                    bm.columns.addValue('dd', 'DD')
                    bm.command['cmd1'].setColumn('aa', 'valid')
                    bm.command['cmd1'].setColumn(['bb'], ['bind'])
                    bm.command['cmd1'].setColumn(['bb', 'cc'], ['output'])
                    bm.command['cmd1'].setColumn(['dd'])
    
                    expect(bm.columns.count).toBe(4)
                    expect(bm.command['cmd1'].valid.columns['aa'].value).toBe('AA');
                    expect(bm.command['cmd1'].valid.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].valid.columns.count).toBe(2);
                    expect(bm.command['cmd1'].bind.columns['bb']).toBeDefined();
                    expect(bm.command['cmd1'].bind.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].bind.columns.count).toBe(2);
                    expect(bm.command['cmd1'].output.columns['bb']).toBeDefined();
                    expect(bm.command['cmd1'].output.columns['cc']).toBeDefined();
                    expect(bm.command['cmd1'].output.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].output.columns.count).toBe(3);
                });
                it("- setColumn() : second table 매핑 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');

                    bm.addTable('second')
                    bm.first.columns.addValue('aa', 'AA')
                    bm.first.columns.add('bb')        // null
                    bm.second.columns.addValue('cc')   // null
                    bm.second.columns.addValue('dd', 'DD')
                    bm.command['cmd1'].setColumn('aa', 'valid')
                    bm.command['cmd1'].setColumn(['bb'], ['bind'])
                    bm.command['cmd1'].setColumn(['bb', 'second.cc'], ['output'])
                    bm.command['cmd1'].setColumn(['second.dd'])
    
                    expect(bm.columns.count).toBe(2)
                    expect(bm.second.columns.count).toBe(2)
                    expect(bm.command['cmd1'].valid.columns['aa'].value).toBe('AA');
                    expect(bm.command['cmd1'].valid.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].valid.columns.count).toBe(2);
                    expect(bm.command['cmd1'].bind.columns['bb']).toBeDefined();
                    expect(bm.command['cmd1'].bind.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].bind.columns.count).toBe(2);
                    expect(bm.command['cmd1'].output.columns['bb']).toBeDefined();
                    expect(bm.command['cmd1'].output.columns['cc']).toBeDefined();
                    expect(bm.command['cmd1'].output.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].output.columns.count).toBe(3);
                });
                it("- setColumn() : second table 매핑 2 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');

                    bm.addTable('second')
                    bm.first.columns.addValue('aa', 'AA')
                    bm.first.columns.add('bb')        // null
                    bm.second.columns.addValue('cc')   // null
                    bm.second.columns.addValue('dd', 'DD')
                    bm.command['cmd1'].setColumn('aa', 'valid')
                    bm.command['cmd1'].setColumn(['bb'], ['bind'])
                    bm.command['cmd1'].setColumn(['first.bb', 'cc'], ['output'], 'second')
                    bm.command['cmd1'].setColumn(['dd'], [], bm.second)
    
                    expect(bm.columns.count).toBe(2)
                    expect(bm.second.columns.count).toBe(2)
                    expect(bm.command['cmd1'].valid.columns['aa'].value).toBe('AA');
                    expect(bm.command['cmd1'].valid.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].valid.columns.count).toBe(2);
                    expect(bm.command['cmd1'].bind.columns['bb'].value).toBe('');
                    expect(bm.command['cmd1'].bind.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].bind.columns.count).toBe(2);
                    expect(bm.command['cmd1'].output.columns['bb'].value).toBe('');
                    expect(bm.command['cmd1'].output.columns['cc']).toBeDefined();
                    expect(bm.command['cmd1'].output.columns['dd'].value).toBe('DD');
                    expect(bm.command['cmd1'].output.columns.count).toBe(3);
                });
                it("- setColumn() : 예외 ", () => {
                    var bm = new BindModel();
                    bm.addCommand('cmd1');

                    bm.columns.addValue('aa', 'AA')
                    
                    expect(()=>bm.command['cmd1'].setColumn(10)).toThrow('EL061323')
                    expect(()=>bm.command['cmd1'].setColumn([10])).toThrow('EL061323')
                    expect(()=>bm.command['cmd1'].setColumn('bb', [], 'second')).toThrow('EL061325')
                    expect(()=>bm.command['cmd1'].setColumn('bb', [])).toThrow('EL061326')
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc1 = new BindCommand(bm);
                    var bc2 = new BindCommand(bm);
                    var bc3 = new BindCommand(bm);
                    bc3.outOpt = 2

                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc3)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);

                    expect(bc.getTypes()).toEqual([BindCommand, BaseBindCommand, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);

                    expect(bc.instanceOf('BindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBind')).toBe(true)
                    expect(bc.instanceOf('MetaObject')).toBe(true)
                    expect(bc.instanceOf('Object')).toBe(true)
                    expect(bc.instanceOf('MetaTable')).toBe(false)
                    expect(bc.instanceOf(BindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBind)).toBe(true)
                    expect(bc.instanceOf(MetaObject)).toBe(true)
                    expect(bc.instanceOf(Object)).toBe(true)
                    expect(bc.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);
                    var obj  = bc.getObject()

                    expect(obj._type).toBe("Meta.Bind.BindCommand")
                    expect(typeof obj._guid).toBe('string')
                    expect(obj._guid.length > 0).toBe(true)
                });
                it("- output 추가 ", () => {
                    var bm = new BindModel();
                    var bc = new BindCommand(bm);
                    bc.newOutput();
                    bc.newOutput('etc');
                    var obj  = bc.getObject()

                    expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
                    expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new BindModel()
                    bm.addCommand('read')
                    var bc1 = bm.cmd.read;
                    bc1.newOutput();
                    var obj  = bm.getObject()
                    var b2 = new BindModel()
                    b2.setObject(obj);

                    expect(bm.equal(b2)).toBe(true)
                });
                it("- 독립 테이블 사용 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new BindCommand();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new BindCommand();
                    bc2.setObject(obj);

                    expect(bc1.equal(bc2)).toBe(true)
                    expect(bc1._baseTable.equal(bc2._baseTable)).toBe(true)
                });
                // command 만 분리해서 가져오는건 의미가 없음
                // it.skip("- command setObject() ", () => {
                //     var bm = new SubBaseBindModel()
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
