/**
 * ES6 + CJS
 */
//==============================================================
// gobal defined
const BindModelAjax     = require('../src/bind-model-ajax');

// const sync_request            = require('sync-request');
let bm;

//==============================================================
// test
describe('동기화 request.get 모킹 테스트', () => {
    beforeAll(() => {
        // jest.restoreAllMocks();
        const request                 = require('request');
        // jest.mock('request');
        // request.get.mockResolvedValue({MOK:true});
        // request.get
        request.get = jest.fn( (ajaxSetup, cb) => {
            // console.log('ee');
            const response = {
                statusCode: 200
            };
            const body = `
            {
                "entity": {
                    "return": 0,
                    "rows_total": 2,     
                    "rows": {
                            "row_count": 1,
                            "sto_id": "S00001",
                            "acc_idx": 3,
                            "adm_id": "logicfeel",
                            "passwd": "1212",
                            "del_yn": "N",
                            "create_dt": "2020-01-06 오후 5:42:01",
                            "admName": "관리자명.",
                            "use_yn": "N",
                            "row_total": 2
                    }
                }
            }
            `;
            cb(null, response, body);
        }); 
        
        bm = new BindModelAjax();
        
        bm.addCommand('create');
        bm.create.outputOption = 1
        bm.create.addItem('i1', 'V1');
        // bm.create.cbResult = (result)=>{ return result.entity }
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
    });
    it('- 실행 테스트', () => {
        bm.create.execute();

        // bm.command.create.execute(); 예시

        console.log('d');
        
        // expect(() => ).toThrow(/대상 없음/);
    });
});

describe.skip('비동기화 request.get 모킹 테스트', () => {
    beforeAll(() => {
        jest.restoreAllMocks();
        const request                 = require('request');
        // jest.mock('request');
        // request.get.mockResolvedValue({MOK:true});
        // request.get
        const response = {
            statusCode: 200
        };
        const body = `
        {
            "entity": {
                "return": 0,
                "rows_total": 2,     
                "rows": {
                        "row_count": 1,
                        "sto_id": "S00001",
                        "acc_idx": 3,
                        "adm_id": "logicfeel",
                        "passwd": "1212",
                        "del_yn": "N",
                        "create_dt": "2020-01-06 오후 5:42:01",
                        "admName": "관리자명.",
                        "use_yn": "N",
                        "row_total": 2
                }
            }
        }
        `;
        
        // mock 
        request.get = jest.fn( (ajaxSetup, cb) => {
            return new Promise((resolve, reject) => {
                // const userID = parseInt(url.substr('/users/'.length), 10);
                // process.nextTick(() => resolve(cb(null, response, body))

                //   users[userID]
                //     ? resolve(users[userID])
                //     : reject({
                //         error: `User with ${userID} not found.`,
                //       }),
                // );
                resolve(body);
                cb(null, response, body);
            });
        });
        
        bm = new BindModelAjax();
        bm.addCommand('create');
        bm.create.outputOption = 1
        bm.create.addItem('i1', 'V1');
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        // bm.create.execute();
    });

    it('- 실행 테스트 2', done => {

        bm.create.onExecuted = () => {
            // 작동은 되지만 구식 방법이고, 경고가 나온다. 
            // expect(bm.columns.count).toBe(11);
            expect(bm.columns.count).toBe(11)
            done();
        };

        bm.create.execute();


    });

    it.skip('- 실행 테스트 5', () => {

        // bm.create.onExecuted = () => {
        //     // 작동은 되지만 구식 방법이고, 경고가 나온다. 
        //     // expect(bm.columns.count).toBe(11);
        //     // expect(bm.create).toThrow();
        //     done();
        // };

        // bm.cbError = (a, b, c) => {

        //     // throw new Error(' start [dir] request fail...');
        // }

        // try {
        //     bm.create.execute()

        //     // somethingThatThrowsWithArgs(1);
        //     // fail("Did not throw");
        // } catch (e) {
        //     expect(e.message).toEqual("Something");
        //     expect(e.statusCode).toEqual(500);
        // }

        // bm.create.execute();
        expect(() => bm.create.execute()).toThrow(error => {
            expect(e.message).toEqual("Something");
            expect(e.statusCode).toEqual(500);
        });

    });

    it.skip('- 실행 테스트 4 : OK', done => {

        // bm.create.onExecuted = () => {
        //     // 작동은 되지만 구식 방법이고, 경고가 나온다. 
        //     // expect(bm.columns.count).toBe(11);
        //     // expect(bm.create).toThrow();
        //     done();
        // };

        bm.cbError = (a, b, c) => {
            expect(a).toMatch('connect ECONNREFUSED')
            done()
        }

        bm.create.execute();
        // expect(() => bm.create.execute()).toThrow();

    });


    it.skip('- 실행 테스트 3', () => {

        // expect(() => autoTask = AutoTask.create(null)).toThrow();

        bm.create.execute()

        // expect(() => bm.create.execute()).toThrow();


    });

    it.skip('- 실행 테스트', done => {

        
        console.log('d');
        // expect.assertions(1);
        
        // const fff = (a, b) => {
        //     // console.log('eew');
        //     var bb = a;
            
        // }
        bm.create.onExecuted = () => {
            // 작동은 되지만 구식 방법이고, 경고가 나온다. 
            expect(bm.columns.count).toBe(11);
            done()
        };

        
        bm.create.execute();
        
        // await bm.create.__execSuccess();
        // await fff();
        // await bm.create.execute();
        // return expect(bm.columns.count).resolves.toBe(11);
        // await expect(bm.columns.count).resolves.toBe(11);

        // return expect(bm.columns.count).toBe(11);
        // await expect(bm.columns.count).toBe(11);
        


    });
});