/**
 * ES6 + CJS
 */
//==============================================================
// gobal defined
const BindModelAjax     = require('../src/bind-model-ajax').BindModelAjax;
const HTMLColumn        = require('../src/html-column').HTMLColumn;


// const sync_request            = require('sync-request');
let bm;

//==============================================================
// test
// POINT: npx start 후 태스트 해야함
describe.skip('동기화 request.get 모킹 테스트', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.resetModules();

        // const request                 = require('request');
        // // jest.mock('request');
        // // request.get.mockResolvedValue({MOK:true});
        // // request.get
        // request.get = jest.fn( (config, cb) => {
        //     // console.log('ee');
        //     const response = {
        //         statusCode: 200
        //     };
        //     const body = `
        //     {
        //         "entity": {
        //             "return": 0,
        //             "rows_total": 2,     
        //             "rows": {
        //                     "row_count": 1,
        //                     "sto_id": "S00001",
        //                     "acc_idx": 3,
        //                     "adm_id": "logicfeel",
        //                     "passwd": "1212",
        //                     "del_yn": "N",
        //                     "create_dt": "2020-01-06 오후 5:42:01",
        //                     "admName": "aaaa.",
        //                     "use_yn": "N",
        //                     "row_total": 2
        //             }
        //         }
        //     }
        //     `;
        //     cb(null, response, body);
        // }); 
        
    });
    it('- 실행 테스트 : 1. 아이템 추가 후 커맨드에 매핑 설정', async () => {
        bm = new BindModelAjax();
        bm.addCommand('create', 1);
        bm._baseTable.columns.addValue('i1', 'V1');
        bm.setMapping({i1: {Array: []}})
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        await bm.command.create.execute();

        expect(bm.command.create.outputOption.option).toBe(1);
        expect(bm.command.create.valid.columns.count).toBe(1);
        expect(bm.command.create.bind.columns.count).toBe(1);
        expect(bm.command.create.output.columns.count).toBe(11);
        expect(bm.command.create.output.rows.count).toBe(1);
    });
    it('- 실행 테스트 :  2. 컬럼 추가 및 커맨드에 동시 등록 (아이템 생략)', async () => {
        bm = new BindModelAjax();
        bm.addCommand('create', 1);
        bm.addColumn(new HTMLColumn('i1', bm._baseTable, {defalut: 'V1'}), [], []);
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        await bm.command.create.execute();

        expect(bm.command.create.outputOption.option).toBe(1);
        expect(bm.command.create.valid.columns.count).toBe(1);
        expect(bm.command.create.bind.columns.count).toBe(1);
        expect(bm.command.create.output.columns.count).toBe(11);
        expect(bm.command.create.output.rows.count).toBe(1);
    });
    it('- 실행 테스트 :  3. 엔티티에 컬럼 추가 >> 컬럼 설정', async () => {
        bm = new BindModelAjax();
        bm.addCommand('create', 1);
        bm._baseTable.columns.addValue('i1', 'V1');
        bm.cmd.create.setColumn('i1')
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        await bm.cmd.create.execute();

        expect(bm.cmd.create.outputOption.option).toBe(1);
        expect(bm.cmd.create.valid.columns.count).toBe(1);
        expect(bm.cmd.create.bind.columns.count).toBe(1);
        expect(bm.cmd.create.output.columns.count).toBe(11);
        expect(bm.cmd.create.output.rows.count).toBe(1);
    });
    it('- 실행 테스트 : 4. 커맨드에 컬럼 객체 직접 추가 : 단일 설정에 적합함', async () => {
        bm = new BindModelAjax();
        bm.addCommand('create', 1);
        bm.cmd.create.addColumnValue('i1', 'V1');
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        await bm.cmd.create.execute();

        expect(bm._baseTable.columns.count).toBe(11);
        expect(bm.cmd.create.outputOption.option).toBe(1);
        expect(bm.cmd.create.valid.columns.count).toBe(1);
        expect(bm.cmd.create.bind.columns.count).toBe(1);
        expect(bm.cmd.create.output.columns.count).toBe(11);
        expect(bm.cmd.create.output.rows.count).toBe(1);
    });
    it('- 실행 테스트 : 5. 추가한 컬럼은 second 에 저장됨', async() => {
        bm = new BindModelAjax();
        bm.addTable('second');
        bm.addCommand('create', 1, bm['second']);
        bm.cmd.create.addColumnValue('i1', 'V1');
        bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
        await bm.cmd.create.execute();

        expect(bm._baseTable.columns.count).toBe(0);
        expect(bm.second.columns.count).toBe(11);
        expect(bm.cmd.create.outputOption.option).toBe(1);
        expect(bm.cmd.create.valid.columns.count).toBe(1);
        expect(bm.cmd.create.bind.columns.count).toBe(1);
        expect(bm.cmd.create.output.columns.count).toBe(11);
        expect(bm.cmd.create.output.rows.count).toBe(1);
    });


    it('- 실행 테스트 : 6. 서비스 객체를 통한 설정', async () => {
        var svc = {
            baseUrl: 'http://localhost:8080/json/sample_row_single.json',
            items: {
                i1: 'V1'
            },
            command: {
                create: {
                    outputOption: 1,
                }
            },
            mapping: {
                i1: { create: []}
            }
        };
        bm = new BindModelAjax(svc);
        await bm.cmd.create.execute();

        expect(bm.cmd.create.outputOption.option).toBe(1);
        expect(bm.cmd.create.valid.columns.count).toBe(1);
        expect(bm.cmd.create.bind.columns.count).toBe(1);
        expect(bm.cmd.create.output.columns.count).toBe(11);
        expect(bm.cmd.create.output.rows.count).toBe(1);
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
        request.get = jest.fn( (config, cb) => {
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
        bm.create.addColumnValue('i1', 'V1');
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