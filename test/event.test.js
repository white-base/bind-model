/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
const BindModelAjax     = require('../src/bind-model-ajax').BindModelAjax;
const HTMLColumn        = require('../src/html-column').HTMLColumn;
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
describe("[event & callback]", () => {
    beforeEach(() => {
        jest.resetModules();
        // MetaRegistry.init();
    });
    describe("callback", () => {
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
            
        });
        describe("MetaModel: ", () => {
            it("- cbFail, cbError", () => {
                var bm = new BindModelAjax();
                bm.result = []; // 리턴 확인 역활
                bm.addCommand('read', 1);
                bm.command.read.addColumnValue('aa', '')
                bm.columns['aa'].isNotNull;

                bm.cbFail = (model, result, column)=> bm.result.push('cbFail')
                bm.cbError = (model, , msg, status)=> result.push('cbError')
                bm.cbBaseValid = (model, view)=> result.push('cbBaseValid')
                bm.cbBaseBind = (model, bin))=> result.push('cbBaseBind')
                bm.cbBaseResult = (model, result)=> result.push('cbBaseResult')
                bm.cbBaseOutput = (model, result)=> result.push('cbBaseOutput')
                bm.cbBaseEnd = (model)=> result.push('cbBaseEnd')
                bm.cmd.read.cbValid = (result, column)=> result.push('cbValid')
                bm.cmd.read.cbBind = (result, column)=> result.push('cbBind')
                bm.cmd.read.cbResult = (result, column)=> result.push('cbResult')
                bm.cmd.read.cbOutput = (result, column)=> result.push('cbOutput')
                bm.cmd.read.cbEnd = (result, column)=> result.push('cbEnd')

                bm.command.read.execute();

            });
        });
    });
    describe("event", () => {
        describe("MetaObject._valueTypes: <value 타입 설정>", () => {
            it("- 설정 및 조회 ", () => {
                expect(true).toBe(true)
            });
        });
    });
});


/**
 * - 제약 조건에 따른 결과 도 다름
 * - isNullPass, isNotNull, constraints 에 따른 조건 검사
 */
