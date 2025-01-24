// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

const { MetaRegistry }          = require('logic-entity');
const { BaseBindModel }             = require('../src/base-bind-model');
const { BaseBindCommand }           = require('../src/base-bind-command');
const { IBindCommand }          = require('../src/i-bind-command');
const { ICommandCallback }      = require('../src/i-command-callback');
const { MetaViewCollection }    = require('logic-entity');
const { MetaView } = require('logic-entity');
const { MetaColumn } = require('logic-entity');
const { HTMLColumn } = require('../src/html-column');
const { MetaTable } = require('logic-entity');
const { BaseBind } = require('logic-bind-model');
const { MetaObject } = require('logic-entity');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
var SubBaseBindModel, SubBaseBindCommand;
var T = true;

//==============================================================
// test
describe("[target: base-bind-command.js]", () => {
    describe("BaseBindCommand :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBaseBindCommand = class SubBaseBindCommand extends BaseBindCommand {
                constructor(p_BaseBindModel, p_bEntity) {
                    super(p_BaseBindModel, p_bEntity);
                }
            }
            SubBaseBindCommand._PARAMS = ['_model', '_baseTable'];  // 테스트 시 필요
            SubBaseBindModel = class SubBaseBindModel extends BaseBindModel {
                constructor() {
                    super();
                }
                // addCommand(p_name, p_option, p_bEntity) {    // 테스트용 임시
                //     var bindCommand = new SubBaseBindCommand(this, p_option, p_bEntity);
                //     this.command.add(p_name, bindCommand);
                //     return bindCommand;
                // }
            }
        });

        describe("BaseBindCommand.BaseBindCommand(): 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BaseBindCommand()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                expect(typeof bc).toBe('object')
            });
        });
        describe(" BaseBindCommand static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BaseBindCommand._UNION).toEqual([IBindCommand, ICommandCallback])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BaseBindCommand._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BaseBindCommand._PARAMS).toEqual(['_model', '_baseTable'])
            });
            it("- _KIND : 인터페이스 타입 ", () => {
                expect(BaseBindCommand._KIND).toEqual('abstract')
            });
        });
        describe("BaseBindCommand._outputs: 출력 메타뷰 컬렉션 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(bc._outputs instanceof MetaViewCollection).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc._outputs = {}).toThrow('getter')
            });
        });
        describe("BaseBindCommand._model: 바인드모델 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(bc._model === bm).toBe(true)
                expect(bc._model === bc.$model).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc._model = {}).toThrow('getter')
            });
        });
        describe("BaseBindCommand.valid: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.valid.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.valid instanceof MetaView                 ).toBe(T)
                expect(bc.valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.valid = v1;
                bc.valid.columns.add('aa')

                expect(bc.valid instanceof MetaView                 ).toBe(T)
                expect(bc.valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc.valid = {}).toThrow('MetaView')
            });
        });
        describe("BaseBindCommand.bind: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.bind.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.bind instanceof MetaView                  ).toBe(T)
                expect(bc.bind.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.bind = v1;
                bc.bind.columns.add('aa')

                expect(bc.bind instanceof MetaView                  ).toBe(T)
                expect(bc.bind.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc.bind = {}).toThrow('MetaView')
            });
        });
        describe("BaseBindCommand.misc: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.misc.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.misc instanceof MetaView                  ).toBe(T)
                expect(bc.misc.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.misc = v1;
                bc.misc.columns.add('aa')

                expect(bc.misc instanceof MetaView                  ).toBe(T)
                expect(bc.misc.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc.misc = {}).toThrow('MetaView')
            });
        });
        describe("BaseBindCommand.output: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.output.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.output instanceof MetaView                    ).toBe(T)
                expect(bc.output1 instanceof MetaView                   ).toBe(T)
                expect(bc.output === bc.output1                         ).toBe(T)
                expect(bc.output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn           ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 추가 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.output.columns.add('aa') // 상위로 기본으로 추가됨
                bc.newOutput('good')
                bc.good.columns.add('bb')

                expect(bc.output instanceof MetaView                    ).toBe(T)
                expect(bc.output1 instanceof MetaView                   ).toBe(T)
                expect(bc.output === bc.output1                         ).toBe(T)
                expect(bc.good instanceof MetaView                      ).toBe(T)
                expect(bc.output2 instanceof MetaView                   ).toBe(T)
                expect(bc.output2 === bc.good                           ).toBe(T)
                expect(bc.output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bc.output2 instanceof MetaView                   ).toBe(T)
                expect(bc.output2.columns['bb'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn           ).toBe(T)
                expect(bm.columns['bb'] instanceof MetaColumn           ).toBe(T)
                expect(bm.columns.count).toBe(2)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.output = v1;
                bc.output.columns.add('aa')

                expect(bc.output instanceof MetaView                    ).toBe(T)
                expect(bc.output1 instanceof MetaView                   ).toBe(T)
                expect(bc.output === bc.output1                         ).toBe(T)
                expect(bc.output.columns['aa'] instanceof MetaColumn    ).toBe(T)
                expect(bc.output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn           ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc.output = {}).toThrow('MetaView')
            });
        });
        describe("BaseBindCommand.outputOption: 출력 옵션 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(bc.outputOption === bc.outOpt).toBe(true)

                expect(bc.outputOption      ).toEqual({option:0, index:0})
            });
            it("- 변경 1 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.outOpt = 2

                expect(bc.outputOption      ).toEqual({option:2, index:0})
            });
            it("- 변경 2 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.outputOption = {option:3}

                expect(bc.outputOption      ).toEqual({option:3, index:0})
            });
            it("- 변경 3 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.outOpt = {option:3, index:3, etc: 2}

                expect(bc.outputOption      ).toEqual({option:3, index:3})
            });
            it("- 변경 4 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.outOpt = {index:3}

                expect(bc.outputOption      ).toEqual({option:0, index:3})
            });
            
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(()=> bc.outputOption = true  ).toThrow('outputOption')
            });
        });
        describe("BaseBindCommand.cbBegin", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(typeof bc.cbBegin === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbBegin = f1

                expect(bc.cbBegin).toBe(f1)
                // 예외
                expect(()=> bc.cbBegin = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.cbValid", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);

                expect(typeof bc.cbValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbValid = f1

                expect(bc.cbValid).toBe(f1)
                // 예외
                expect(()=> bc.cbValid = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.cbBind", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(typeof bc.cbBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbBind = f1

                expect(bc.cbBind).toBe(f1)
                // 예외
                expect(()=> bc.cbBind = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.cbResult", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(typeof bc.cbResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbResult = f1

                expect(bc.cbResult).toBe(f1)
                // 예외
                expect(()=> bc.cbResult = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.cbOutput", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(typeof bc.cbOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbOutput = f1

                expect(bc.cbOutput).toBe(f1)
                // 예외
                expect(()=> bc.cbOutput = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.cbEnd", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(typeof bc.cbEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbEnd = f1

                expect(bc.cbEnd).toBe(f1)
                // 예외
                expect(()=> bc.cbEnd = {}).toThrow() 
            });
        });
        describe("BaseBindCommand.execute() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);  

                expect(()=>bc.execute()).toThrow('EL061315')
                expect(()=>bc.exec()).toThrow('EL061315') 
            });
        });
        describe("BaseBindCommand.addColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumn(new HTMLColumn('aa', null, 'AA'));
                bc.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bc.addColumn(new HTMLColumn('cc'));

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe(null);
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['bb'].value).toBe('BB');
                expect(bc.valid.columns['cc'].value).toBe(null);
                expect(bc.valid.columns.count).toBe(3);
                expect(bc.bind.columns['aa'].value).toBe('AA');
                expect(bc.bind.columns['bb'].value).toBe('BB');
                expect(bc.bind.columns['cc'].value).toBe(null);
                expect(bc.bind.columns.count).toBe(3);
                expect(bc.output.columns['aa'].value).toBe('AA');
                expect(bc.output.columns['bb'].value).toBe('BB');
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns.count).toBe(3);
            });
            it("- 중복 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumn(new HTMLColumn('aa', null, 'AA'));

                expect(()=>bc.addColumn('aa')).toThrow('exists');
                expect(()=>bc.addColumn(new HTMLColumn('aa', bm._baseTable, 'BB'))).toThrow('exists');
            });
            it("- view 매핑 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bc.addColumn(new HTMLColumn('bb'), 'bind');
                bc.addColumn(new HTMLColumn('cc'), ['bind', 'output']);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe(null);
                expect(bm._baseTable.columns['cc'].value).toBe(null);
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['bb'].value).toBe(null);
                expect(bc.bind.columns['cc'].value).toBe(null);
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns.count).toBe(1);
            });
            it("- second table view 매핑 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.addTable('second')
                bc.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bc.addColumn(new HTMLColumn('bb'), 'bind', 'second');
                bc.addColumn(new HTMLColumn('cc'), ['bind', 'output'], bm.second);
                bc.addColumn('dd', ['bind', 'output'], bm.second);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm.second.columns['bb'].value).toBe(null);
                expect(bm.second.columns['cc'].value).toBe(null);
                expect(bm._baseTable.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['bb'].value).toBe(null);
                expect(bc.bind.columns['cc'].value).toBe(null);
                expect(bc.bind.columns.count).toBe(3);
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns.count).toBe(2);
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(()=>bc.addColumn(10)).toThrow('EL061316')
                expect(()=>bc.addColumn(new MetaColumn('aa'), {})).toThrow('EL061317')
                expect(()=>bc.addColumn(new MetaColumn('aa'), [], [], 'second')).toThrow('table')
                expect(()=>bc.addColumn(new MetaColumn('aa'), [10])).toThrow('EL061319')
                expect(()=>bc.addColumn(new MetaColumn('bb'), 'read')).toThrow('EL061320')
            });
        });
        describe("BaseBindCommand.addColumnValue() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA')
                bc.addColumnValue('bb', 'BB')
                bc.addColumnValue('cc', '')

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['bb'].value).toBe('BB');
                expect(bc.valid.columns['cc'].value).toBe('');
                expect(bc.valid.columns.count).toBe(3);
                expect(bc.bind.columns['aa'].value).toBe('AA');
                expect(bc.bind.columns['bb'].value).toBe('BB');
                expect(bc.bind.columns['cc'].value).toBe('');
                expect(bc.bind.columns.count).toBe(3);
                expect(bc.output.columns['aa'].value).toBe('AA');
                expect(bc.output.columns['bb'].value).toBe('BB');
                expect(bc.output.columns['cc'].value).toBe('');
                expect(bc.output.columns.count).toBe(3);

            });
            it("- view 매핑 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA', ['valid'])
                bc.addColumnValue('bb', 'BB', 'bind')
                bc.addColumnValue('cc', '', ['bind', 'output'])

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['bb'].value).toBe('BB');
                expect(bc.bind.columns['cc'].value).toBe('');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['cc'].value).toBe('');
                expect(bc.output.columns.count).toBe(1);
            });
            it("- second table view 매핑 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.addTable('second')
                bc.addColumnValue('aa', 'AA', ['valid']);
                bc.addColumnValue('bb', '', 'bind', 'second');
                bc.addColumnValue('cc', '', ['bind', 'output'], bm.second);
                bc.addColumnValue('dd', {required: true});

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm.second.columns['bb'].value).toBe('');
                expect(bm.second.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm.second.columns.count).toBe(2);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(2);
                expect(bc.bind.columns['bb'].value).toBe('');
                expect(bc.bind.columns['cc'].value).toBe('');
                expect(bc.bind.columns.count).toBe(3);
                expect(bc.output.columns['cc'].value).toBe('');
                expect(bc.output.columns.count).toBe(2);
                expect(bm.columns['dd'].required).toBe(true);

            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                
                expect(()=>bc.addColumnValue(10)).toThrow('string')
                expect(()=>bc.addColumnValue('aa', '', [], 'second')).toThrow('table')
                expect(()=>bc.addColumnValue('aa', '', [], {})).toThrow('table')
                expect(()=>bc.addColumnValue('aa.')).toThrow('EL061310')

            });
        });

        describe("BaseBindCommand.setColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.columns.addValue('aa', 'AA')
                bm.columns.add('bb')        // null
                bm.columns.addValue('cc')   // null
                bm.columns.addValue('dd', 'DD')
                bc.setColumn('aa', 'valid')
                bc.setColumn(['bb'], ['bind'])
                bc.setColumn(['bb', 'cc'], ['output'])
                bc.setColumn(['dd'])

                expect(bm.columns.count).toBe(4)
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['dd'].value).toBe('DD');
                expect(bc.valid.columns.count).toBe(2);
                expect(bc.bind.columns['bb']).toBeDefined();
                expect(bc.bind.columns['dd'].value).toBe('DD');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['bb']).toBeDefined();
                expect(bc.output.columns['cc']).toBeDefined();
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- second table 매핑 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.addTable('second')
                bm.first.columns.addValue('aa', 'AA')
                bm.first.columns.add('bb')        // null
                bm.second.columns.addValue('cc')   // null
                bm.second.columns.addValue('dd', 'DD')
                bc.setColumn('aa', 'valid')
                bc.setColumn(['bb'], ['bind'])
                bc.setColumn(['bb', 'second.cc'], ['output'])
                bc.setColumn(['second.dd'])

                expect(bm.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['dd'].value).toBe('DD');
                expect(bc.valid.columns.count).toBe(2);
                expect(bc.bind.columns['bb']).toBeDefined();
                expect(bc.bind.columns['dd'].value).toBe('DD');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['bb']).toBeDefined();
                expect(bc.output.columns['cc']).toBeDefined();
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- second table 매핑 2 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.addTable('second')
                bm.first.columns.addValue('aa', 'AA')
                bm.first.columns.add('bb')        // null
                bm.second.columns.addValue('cc')   // null
                bm.second.columns.addValue('dd', 'DD')
                bc.setColumn('aa', 'valid')
                bc.setColumn(['bb'], ['bind'])
                bc.setColumn(['first.bb', 'cc'], ['output'], 'second')
                bc.setColumn(['dd'], [], bm.second)

                expect(bm.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['dd'].value).toBe('DD');
                expect(bc.valid.columns.count).toBe(2);
                expect(bc.bind.columns['bb'].value).toBe(null);
                expect(bc.bind.columns['dd'].value).toBe('DD');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['bb'].value).toBe(null);
                expect(bc.output.columns['cc']).toBeDefined();
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.columns.addValue('aa', 'AA')
                
                expect(()=>bc.setColumn(10)).toThrow('EL061323')
                expect(()=>bc.setColumn([10])).toThrow('EL061323')
                expect(()=>bc.setColumn('bb', [], 'second')).toThrow('EL061325')
                expect(()=>bc.setColumn('bb', [])).toThrow('EL061326')
            });
        });
        describe("BaseBindCommand.release() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA')
                bc.addColumnValue('bb', 'BB')
                bc.addColumnValue('cc', 'CC')
                bc.release('aa', 'valid')
                bc.release(['bb'], ['bind', 'output'])
                bc.release('cc')

                expect(bm.columns.count).toBe(3);
                expect(bc.valid.columns['bb'].value).toBe('BB');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['aa'].value).toBe('AA');
                expect(bc.bind.columns.count).toBe(1);
                expect(bc.output.columns['aa'].value).toBe('AA');
                expect(bc.output.columns.count).toBe(1);
            });
            it("- 확인 2", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA')
                bc.addColumnValue('bb', 'BB')
                bc.addColumnValue('cc', 'CC')
                bc.release(['aa', 'bb'], ['valid', 'bind'])

                expect(bm.columns.count).toBe(3);
                expect(bc.valid.columns['cc'].value).toBe('CC');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['cc'].value).toBe('CC');
                expect(bc.bind.columns.count).toBe(1);
                expect(bc.output.columns['aa'].value).toBe('AA');
                expect(bc.output.columns['bb'].value).toBe('BB');
                expect(bc.output.columns['cc'].value).toBe('CC');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- 확인 3", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bm.addTable('second')
                bc.addColumnValue('aa', 'AA', []);
                bc.addColumnValue('bb', 'BB', [], 'second');
                bc.addColumnValue('cc', 'CC', [], bm.second);
                bc.release(['aa', 'bb'])

                expect(bm.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(2);
                expect(bc.valid.columns['cc'].value).toBe('CC');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['cc'].value).toBe('CC');
                expect(bc.bind.columns.count).toBe(1);
                expect(bc.output.columns['cc'].value).toBe('CC');
                expect(bc.output.columns.count).toBe(1);
            });
            it("- 확인 4", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA', 'valid');
                bc.addColumnValue('bb', 'BB', []);
                bc.addColumnValue('cc', 'CC');
                bc.release(['aa', 'bb'], 'bind')

                expect(bm.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns['bb'].value).toBe('BB');
                expect(bc.valid.columns['cc'].value).toBe('CC');
                expect(bc.valid.columns.count).toBe(3);
                expect(bc.bind.columns['cc'].value).toBe('CC');
                expect(bc.bind.columns.count).toBe(1);
                expect(bc.output.columns['cc'].value).toBe('CC');
                expect(bc.output.columns.count).toBe(2);
            });
            it("- 확인 5", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA');
                
                expect(bc.valid.columns['aa']).toBeDefined();
                expect(bc.bind.columns['aa']).toBeDefined();
                expect(bc.output.columns['aa']).toBeDefined();

                bc.release('aa')

                expect(bc.valid.columns['aa']).not.toBeDefined();
                expect(bc.bind.columns['aa']).not.toBeDefined();
                expect(bc.output.columns['aa']).not.toBeDefined();
            });
            it("- 확인 6", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA');
                
                expect(bc.valid.columns['aa']).toBeDefined();
                expect(bc.bind.columns['aa']).toBeDefined();
                expect(bc.output.columns['aa']).toBeDefined();

                bc.release('aa', '$all')

                expect(bc.valid.columns['aa']).not.toBeDefined();
                expect(bc.bind.columns['aa']).not.toBeDefined();
                expect(bc.output.columns['aa']).not.toBeDefined();
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.addColumnValue('aa', 'AA')
                bc.addColumnValue('bb', 'BB')
                bc.addColumnValue('cc', 'CC')
                
                expect(()=>bc.release()).toThrow('EL061327')
                expect(()=>bc.release('aa', {})).toThrow('EL061328')
                expect(()=>bc.release('bb', [10])).toThrow('EL061329')
                expect(()=>bc.release('bb', ['etc'])).toThrow('EL061330')
            });
        });
        describe("BaseBindCommand.newOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.newOutput();
                bc.newOutput('etc');

                expect(bc.output1 instanceof MetaView).toBe(true)
                expect(bc.output2 instanceof MetaView).toBe(true)
                expect(bc.output3 instanceof MetaView).toBe(true)
                expect(bc.output === bc.output1).toBe(true)
                expect(bc.output2 === bc.output2).toBe(true)
                expect(bc.output3 === bc.etc).toBe(true)
                expect(bc._outputs.count).toBe(3)
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.newOutput('etc');
                
                expect(()=>bc.newOutput(10)).toThrow('EL061331')
                expect(()=>bc.newOutput('etc')).toThrow('EL061332')
                expect(()=>bc.newOutput('output')).toThrow('EL061332')
                expect(()=>bc.etc = {}).toThrow('EL061311')
            });
        });
        describe("BaseBindCommand.removeOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.newOutput();
                bc.newOutput('etc');
                bc.removeOutput('etc');

                expect(bc.output1 instanceof MetaView).toBe(true)
                expect(bc.output2 instanceof MetaView).toBe(true)
                expect(bc.output === bc.output1).toBe(true)
                expect(bc.output2 === bc.output2).toBe(true)
                expect(bc._outputs.count).toBe(2)
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                var bc = new SubBaseBindCommand(bm);
                bc.newOutput('etc');
                
                expect(()=>bc.removeOutput(10)).toThrow('string')
                expect(()=>bc.removeOutput('output')).toThrow('EL061334')
                expect(()=>bc.removeOutput('output1')).toThrow('EL061334')
                expect(()=>bc.removeOutput('out')).toThrow('EL061335')
            });
        });

        describe("MetaObject <- BaseBind : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);
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
                    // ETC
                    expect(bc.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);

                    expect(bc._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);

                    expect(bc._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);

                    expect(bc._type === SubBaseBindCommand).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc1 = new SubBaseBindCommand(bm);
                    var bc2 = new SubBaseBindCommand(bm);
                    var bc3 = new SubBaseBindCommand(bm);
                    bc3.outOpt = 2

                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc3)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);

                    expect(bc.getTypes()).toEqual([SubBaseBindCommand, BaseBindCommand, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);

                    expect(bc.instanceOf('SubBaseBindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBind')).toBe(true)
                    expect(bc.instanceOf('MetaObject')).toBe(true)
                    expect(bc.instanceOf('Object')).toBe(true)
                    expect(bc.instanceOf('MetaTable')).toBe(false)
                    expect(bc.instanceOf(SubBaseBindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBind)).toBe(true)
                    expect(bc.instanceOf(MetaObject)).toBe(true)
                    expect(bc.instanceOf(Object)).toBe(true)
                    expect(bc.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);
                    var obj  = bc.getObject()

                    expect(obj._type).toBe("Meta.Bind.SubBaseBindCommand")
                    expect(typeof obj._guid).toBe('string')
                    expect(obj._guid.length > 0).toBe(true)
                });
                it("- output 추가 ", () => {
                    var bm = new SubBaseBindModel();
                    var bc = new SubBaseBindCommand(bm);
                    bc.newOutput();
                    bc.newOutput('etc');
                    var obj  = bc.getObject()

                    expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
                    expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm1 = new SubBaseBindModel()
                    var bc1 = new SubBaseBindCommand(bm1);
                    bm1.cmd.add('read', bc1)
                    bc1.newOutput();
                    bc1.cbBegin = (aa)=>true
                    bc1.cbValid = (aa)=>true
                    bc1.cbBind = (aa)=>true
                    bc1.cbResult = (aa)=>true
                    bc1.cbOutput = (aa)=>true
                    bc1.cbEnd = (aa)=>true

                    var obj  = bm1.getObject()
                    var bm2 = new SubBaseBindModel()
                    bm2.setObject(obj);

                    expect(bm1.equal(bm2)).toBe(true)
                });
                it("- 독립 테이블 사용 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new SubBaseBindCommand();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new SubBaseBindCommand();
                    bc2.setObject(obj);

                    expect(bc1.equal(bc2)).toBe(true)
                    expect(bc1._baseTable.equal(bc2._baseTable)).toBe(true)
                });
                it("- 예외 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new SubBaseBindCommand();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new SubBaseBindCommand();
                    obj._baseTable = '' // 강제 실패

                    expect(()=> bc2.setObject(obj)).toThrow('_baseTable')

                });
                it("- 예외 2", () => {
                    var bm1 = new SubBaseBindModel()
                    var bc1 = new SubBaseBindCommand(bm1);
                    bc1.newOutput();
                    var obj  = bc1.getObject()
                    var bc2 = new SubBaseBindCommand(bm1);

                    expect(()=> bc2.setObject(obj)).toThrow('_model')
                });
                it("- 예외 3 ", () => {
                    class BaseBindModelOnwer extends MetaObject {
                        t1 = new MetaTable('t1');
                        bm = new SubBaseBindCommand();
                        constructor(){
                            super()
                            this.bm._baseTable = this.t1;
                        }
                        getObject(p_vOpt, p_owned) {
                            var obj = MetaObject.prototype.getObject.call(this, p_vOpt, p_owned);
                            var vOpt = p_vOpt || 0;
                            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
                            obj['t1']      = this.t1.getObject(vOpt, owned);
                            obj['bm']      = this.bm.getObject(vOpt, owned);
                            return obj;
                        }
                        setObject(p_oGuid, p_origin) {
                            MetaObject.prototype.setObject.call(this, p_oGuid, p_origin);
                            var origin = p_origin ? p_origin : p_oGuid;
                            this.t1.setObject(p_oGuid['t1'], origin);
                            this.bm.setObject(p_oGuid['bm'], origin);
                        }
                    }
                    var bmo = new BaseBindModelOnwer();
                    var obj  = bmo.getObject()
                    var bm2 = new BaseBindModelOnwer();
                    obj.bm._baseTable.$ref = 'ERR'

                    expect(()=> bm2.setObject(obj)).toThrow('EL061312')
                });
                // command 만 분리해서 가져오는건 의미가 없음
                // it.skip("- command setObject() ", () => {
                //     var bm = new SubBaseBindModel()
                //     bm.addCommand('read')
                //     var bc1 = bc;
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
