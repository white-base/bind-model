/**
 * ES6 + CJS
 */
//==============================================================
// gobal defined
const BindModelAjax     = require('../src/bind-model-ajax').BindModelAjax;
const HTMLColumn        = require('../src/html-column').HTMLColumn;


// const sync_request            = require('sync-request');
// let bm;

//==============================================================
// test
describe('비동기 request.get 모킹 테스트', () => {
    beforeAll(() => {
        // jest.restoreAllMocks();
        // const request                 = require('request');
        // jest.mock('request');
        // request.get.mockResolvedValue({MOK:true});
        // request.get
        // request.get = jest.fn( (ajaxSetup, cb) => {
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
        //                     "admName": "관리자명.",
        //                     "use_yn": "N",
        //                     "row_total": 2
        //             }
        //         }
        //     }
        //     `;
        //     cb(null, response, body);
        // }); 
        
    });
    // POINT: 확인필요, node - web
    it.skip('- 실행 테스트 : 1. 아이템 추가 후 커맨드에 매핑 설정', async () => {
        expect.assertions(1);
        

        const cb = () => {
            // expect(bm.command.create.outputOption.option).toBe(1);
            // expect(bm.command.create.valid.columns.count).toBe(1);
            // expect(bm.command.create.bind.columns.count).toBe(1);
            // expect(bm.command.create.output.columns.count).toBe(11);
            // expect(bm.command.create.output.rows.count).toBe(1);
            // done(); // 비동기 실행 end
        }
        var bm = new BindModelAjax();
        bm.addCommand('create', 1);
        bm._baseTable.columns.addValue('i1', 'V1');
        bm.setMapping({i1: {Array: []}})
        // bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
        bm.baseUrl = 'http://127.0.0.1:8080/json/sample_row_single.json';       // 가져올 경로
        bm.cbBaseEnd = cb;
        await bm.command.create.execute();

        expect(bm.command.create.outputOption.option).toBe(1);
        expect(bm.command.create.valid.columns.count).toBe(1);
        expect(bm.command.create.bind.columns.count).toBe(1);
        expect(bm.command.create.output.columns.count).toBe(11);
        expect(bm.command.create.output.rows.count).toBe(1);


    });
    // it('- 실행 테스트 :  2. 컬럼 추가 및 커맨드에 동시 등록 (아이템 생략)', () => {
    //     bm = new BindModelAjax();
    //     bm.addCommand('create', 1);
    //     bm.addColumn(new HTMLColumn('i1', bm._baseTable, {defalut: 'V1'}), [], []);
    //     bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
    //     bm.command.create.execute();

    //     expect(bm.command.create.outputOption.option).toBe(1);
    //     expect(bm.command.create.valid.columns.count).toBe(1);
    //     expect(bm.command.create.bind.columns.count).toBe(1);
    //     expect(bm.command.create.output.columns.count).toBe(11);
    //     expect(bm.command.create.output.rows.count).toBe(1);
    // });
    // it('- 실행 테스트 :  3. 엔티티에 컬럼 추가 >> 컬럼 설정', () => {
    //     bm = new BindModelAjax();
    //     bm.addCommand('create', 1);
    //     bm._baseTable.columns.addValue('i1', 'V1');
    //     bm.cmd.create.setColumn('i1')
    //     bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
    //     bm.cmd.create.execute();

    //     expect(bm.cmd.create.outputOption.option).toBe(1);
    //     expect(bm.cmd.create.valid.columns.count).toBe(1);
    //     expect(bm.cmd.create.bind.columns.count).toBe(1);
    //     expect(bm.cmd.create.output.columns.count).toBe(11);
    //     expect(bm.cmd.create.output.rows.count).toBe(1);
    // });
    // it('- 실행 테스트 : 4. 커맨드에 컬럼 객체 직접 추가 : 단일 설정에 적합함', () => {
    //     bm = new BindModelAjax();
    //     bm.addCommand('create', 1);
    //     bm.cmd.create.addColumnValue('i1', 'V1');
    //     bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
    //     bm.cmd.create.execute();

    //     expect(bm._baseTable.columns.count).toBe(11);
    //     expect(bm.cmd.create.outputOption.option).toBe(1);
    //     expect(bm.cmd.create.valid.columns.count).toBe(1);
    //     expect(bm.cmd.create.bind.columns.count).toBe(1);
    //     expect(bm.cmd.create.output.columns.count).toBe(11);
    //     expect(bm.cmd.create.output.rows.count).toBe(1);
    // });
    // it('- 실행 테스트 : 5. 추가한 컬럼은 second 에 저장됨', () => {
    //     bm = new BindModelAjax();
    //     bm.addTable('second');
    //     bm.addCommand('create', 1, bm['second']);
    //     bm.cmd.create.addColumnValue('i1', 'V1');
    //     bm.baseUrl = 'http://localhost:8080/json/sample_row_single.json';       // 가져올 경로
    //     bm.cmd.create.execute();

    //     expect(bm._baseTable.columns.count).toBe(0);
    //     expect(bm.second.columns.count).toBe(11);
    //     expect(bm.cmd.create.outputOption.option).toBe(1);
    //     expect(bm.cmd.create.valid.columns.count).toBe(1);
    //     expect(bm.cmd.create.bind.columns.count).toBe(1);
    //     expect(bm.cmd.create.output.columns.count).toBe(11);
    //     expect(bm.cmd.create.output.rows.count).toBe(1);
    // });


    // it('- 실행 테스트 : 6. 서비스 객체를 통한 설정', () => {
    //     var svc = {
    //         baseUrl: 'http://localhost:8080/json/sample_row_single.json',
    //         items: {
    //             i1: 'V1'
    //         },
    //         command: {
    //             create: {
    //                 outputOption: 1,
    //             }
    //         },
    //         mapping: {
    //             i1: { create: []}
    //         }
    //     };
    //     bm = new BindModelAjax(svc);
    //     bm.cmd.create.execute();

    //     expect(bm.cmd.create.outputOption.option).toBe(1);
    //     expect(bm.cmd.create.valid.columns.count).toBe(1);
    //     expect(bm.cmd.create.bind.columns.count).toBe(1);
    //     expect(bm.cmd.create.output.columns.count).toBe(11);
    //     expect(bm.cmd.create.output.rows.count).toBe(1);
    // });
});

