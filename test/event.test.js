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
const request                 = require('request');
//==============================================================
// test
describe("[event & callback]", () => {
    beforeEach(() => {
        jest.resetModules();
        // MetaRegistry.init();
    });
        
    describe("MetaModel: 성공 result ", () => {
        beforeEach(() => {
            // jest.restoreAllMocks();
            // const request                 = require('request');
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

        it("- 모든 콜백이 설정할 경우 (command cb 우선순위 높음)", () => {
            var bm = new BindModelAjax();
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            bm.result = [];
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=> {bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=>{ bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.cmd.read.cbBegin = ()=> {bm.result.push('cbBegin')}
            bm.cmd.read.cbValid = ()=> {bm.result.push('cbValid')}
            bm.cmd.read.cbBind = ()=> {bm.result.push('cbBind')}
            bm.cmd.read.cbResult = ()=> {bm.result.push('cbResult')}
            bm.cmd.read.cbOutput = ()=> {bm.result.push('cbOutput')}
            bm.cmd.read.cbEnd = ()=> {bm.result.push('cbEnd')}
            
            // cbOutput 은 제외됨
            bm.result = [];
            bm.cmd.read.execute();  
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBegin')
            expect(bm.result[3]).toBe('cbValid')
            expect(bm.result[4]).toBe('cbBind')
            expect(bm.result[5]).toBe('cbResult')
            expect(bm.result[6]).toBe('cbEnd')
            expect(bm.result[7]).toBe('read.onExecuted')
            expect(bm.result[8]).toBe('onExecuted')

            bm.result = []; 
            bm.cmd.read.outputOption = 1;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBegin')
            expect(bm.result[3]).toBe('cbValid')
            expect(bm.result[4]).toBe('cbBind')
            expect(bm.result[5]).toBe('cbResult')
            expect(bm.result[6]).toBe('cbOutput')
            expect(bm.result[7]).toBe('cbEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')

            bm.result = []; 
            bm.cmd.read.outputOption = 2;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBegin')
            expect(bm.result[3]).toBe('cbValid')
            expect(bm.result[4]).toBe('cbBind')
            expect(bm.result[5]).toBe('cbResult')
            expect(bm.result[6]).toBe('cbOutput')
            expect(bm.result[7]).toBe('cbEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')

            bm.result = []; 
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBegin')
            expect(bm.result[3]).toBe('cbValid')
            expect(bm.result[4]).toBe('cbBind')
            expect(bm.result[5]).toBe('cbResult')
            expect(bm.result[6]).toBe('cbOutput')
            expect(bm.result[7]).toBe('cbEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')
        });
        it("- base 콜백만 설정할 경우", () => {
            var bm = new BindModelAjax();
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            bm.result = [];
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=> {bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=>{ bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            
            // cbOutput 은 제외됨
            bm.cmd.read.execute();  
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseEnd')
            expect(bm.result[7]).toBe('read.onExecuted')
            expect(bm.result[8]).toBe('onExecuted')

            bm.result = [];
            bm.cmd.read.outputOption = 1;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseOutput')
            expect(bm.result[7]).toBe('cbBaseEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')

            bm.result = [];
            bm.cmd.read.outputOption = 2;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseOutput')
            expect(bm.result[7]).toBe('cbBaseEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')

            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();
            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseOutput')
            expect(bm.result[7]).toBe('cbBaseEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')
        });
        it("- 실패 할 경우", () => {
            var bm = new BindModelAjax();
            bm.result = []; // 리턴 확인 역활
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            bm.columns['aa'].isNotNull = true;  // 강제 실패 처리
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=>{bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=> {bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();

            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbFail')
            expect(bm.result[5]).toBe('cbBaseEnd')
            expect(bm.result[6]).toBe('read.onExecuted')
            expect(bm.result[7]).toBe('onExecuted')
        });

        it("- output 실패 할 경우", () => {
            var bm = new BindModelAjax();
            bm.result = []; // 리턴 확인 역활
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=>{bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=> {bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {
                bm.result.push('cbBaseOutput')
                throw new Error('output Error');
            }
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();

            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseOutput')
            expect(bm.result[7]).toBe('cbError')
            expect(bm.result[8]).toBe('cbBaseEnd')
            expect(bm.result[9]).toBe('read.onExecuted')
            expect(bm.result[10]).toBe('onExecuted')
        });
        // REVIEW: 오류를 못잡아냄.. 검토 필요
        it.skip("- end 실패 할 경우", () => {
            var bm = new BindModelAjax();
            bm.result = []; // 리턴 확인 역활
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=>{bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=> {bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {
                bm.result.push('cbBaseEnd')
                throw new Error('end Error');
            }
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();

            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbBaseOutput')
            expect(bm.result[7]).toBe('cbBaseEnd')
            expect(bm.result[8]).toBe('cbError')
            expect(bm.result[9]).toBe('read.onExecuted')
            expect(bm.result[10]).toBe('onExecuted')
        });
        
    });
    describe("MetaModel: result 자료 구조 실패", () => {
        beforeEach(() => {
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
                        "abcd": {
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
        it("- result 자료 구조 실패 할 경우", () => {
            var bm = new BindModelAjax();
            bm.result = []; // 리턴 확인 역활
            bm.addCommand('read', 0);
            bm.command.read.addColumnValue('aa', '')
            // bm.columns['aa'].isNotNull = true;  // 강제 실패 처리
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=>{bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=> {bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();

            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbBaseResult')
            expect(bm.result[6]).toBe('cbError')
            expect(bm.result[7]).toBe('cbBaseEnd')
            expect(bm.result[8]).toBe('read.onExecuted')
            expect(bm.result[9]).toBe('onExecuted')
        });
    });
    describe("MetaModel: 실패 result", () => {
        beforeEach(() => {
            request.get = jest.fn( (ajaxSetup, cb) => {
                const response = {
                    statusCode: 404
                };
                const body = `{ERR:-1}`;
                cb(null, response, body);
            }); 
        });
        it("- 오류 날 경우", () => {
            var bm = new BindModelAjax();
            bm.result = []; // 리턴 확인 역활
            bm.addCommand('read', 1);
            bm.command.read.addColumnValue('aa', '')
            bm.onExecute = ()=> {bm.result.push('onExecute')}
            bm.onExecuted = ()=> {bm.result.push('onExecuted')}
            bm.cbFail = ()=>{bm.result.push('cbFail')}
            bm.cbError = ()=> {bm.result.push('cbError')}
            bm.cbBaseBegin = ()=> {bm.result.push('cbBaseBegin')}
            bm.cbBaseValid = ()=> {bm.result.push('cbBaseValid')}
            bm.cbBaseBind = () => {bm.result.push('cbBaseBind')}
            bm.cbBaseResult = ()=> {bm.result.push('cbBaseResult')}
            bm.cbBaseOutput = ()=> {bm.result.push('cbBaseOutput')}
            bm.cbBaseEnd = ()=> {bm.result.push('cbBaseEnd')}
            bm.cmd.read.onExecute = ()=> {bm.result.push('read.onExecute')}
            bm.cmd.read.onExecuted = ()=> {bm.result.push('read.onExecuted')}
            bm.result = [];
            bm.cmd.read.outputOption = 3;
            bm.cmd.read.execute();

            expect(bm.result[0]).toBe('onExecute')
            expect(bm.result[1]).toBe('read.onExecute')
            expect(bm.result[2]).toBe('cbBaseBegin')
            expect(bm.result[3]).toBe('cbBaseValid')
            expect(bm.result[4]).toBe('cbBaseBind')
            expect(bm.result[5]).toBe('cbError')
            expect(bm.result[6]).toBe('cbBaseEnd')
            expect(bm.result[7]).toBe('read.onExecuted')
            expect(bm.result[8]).toBe('onExecuted')
        });
    });

});


/**
 * - 제약 조건에 따른 결과 도 다름
 * - isNullPass, isNotNull, constraints 에 따른 조건 검사
 */
