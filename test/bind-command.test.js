// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

const { MetaRegistry }          = require('logic-entity');
const { BindModel }             = require('../src/bind-model');
const { BindCommand }           = require('../src/bind-command');
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
var SubBindModel, SubBindCommand;
var T = true;

//==============================================================
// test
describe("[target: bind-command.js]", () => {
    describe("BindCommand :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBindCommand = class SubBindCommand extends BindCommand {
                constructor(p_bindModel, p_bEntity) {
                    super(p_bindModel, p_bEntity);
                }
            }
            SubBindCommand._PARAMS = ['_model', '_baseTable'];  // 테스트 시 필요
            SubBindModel = class SubBindModel extends BindModel {
                constructor() {
                    super();
                }
                // addCommand(p_name, p_option, p_bEntity) {    // 테스트용 임시
                //     var bindCommand = new SubBindCommand(this, p_option, p_bEntity);
                //     this.command.add(p_name, bindCommand);
                //     return bindCommand;
                // }
            }
        });

        describe("BindCommand.BindCommand(): 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BindCommand()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                expect(typeof bc).toBe('object')
            });
        });
        describe(" BindCommand static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindCommand._UNION).toEqual([IBindCommand, ICommandCallback])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindCommand._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindCommand._PARAMS).toEqual(['_model', '_baseTable'])
            });
            it("- _KIND : 인터페이스 타입 ", () => {
                expect(BindCommand._KIND).toEqual('abstract')
            });
        });
        describe("BindCommand._outputs: 출력 메타뷰 컬렉션 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(bc._outputs instanceof MetaViewCollection).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc._outputs = {}).toThrow('getter')
            });
        });
        describe("BindCommand._model: 바인드모델 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(bc._model === bm).toBe(true)
                expect(bc._model === bc.$model).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc._model = {}).toThrow('getter')
            });
        });
        describe("BindCommand.valid: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.valid.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.valid instanceof MetaView                 ).toBe(T)
                expect(bc.valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.valid = v1;
                bc.valid.columns.add('aa')

                expect(bc.valid instanceof MetaView                 ).toBe(T)
                expect(bc.valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc.valid = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.bind: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.bind.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.bind instanceof MetaView                  ).toBe(T)
                expect(bc.bind.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var v1 = new MetaView('v1')
                bc.bind = v1;
                bc.bind.columns.add('aa')

                expect(bc.bind instanceof MetaView                  ).toBe(T)
                expect(bc.bind.columns['aa'] instanceof MetaColumn  ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc.bind = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.output: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.output.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bc.output instanceof MetaView                    ).toBe(T)
                expect(bc.output1 instanceof MetaView                   ).toBe(T)
                expect(bc.output === bc.output1                         ).toBe(T)
                expect(bc.output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn           ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 추가 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc.output = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.outputOption: 출력 옵션 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(bc.outputOption === bc.outOpt).toBe(true)

                expect(bc.outputOption      ).toEqual({option:0, index:0})
            });
            it("- 변경 1 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.outOpt = 2

                expect(bc.outputOption      ).toEqual({option:2, index:0})
            });
            it("- 변경 2 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.outputOption = {option:3}

                expect(bc.outputOption      ).toEqual({option:3, index:0})
            });
            it("- 변경 3 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.outOpt = {option:3, index:3, etc: 2}

                expect(bc.outputOption      ).toEqual({option:3, index:3})
            });
            it("- 변경 4 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.outOpt = {index:3}

                expect(bc.outputOption      ).toEqual({option:0, index:3})
            });
            
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(()=> bc.outputOption = true  ).toThrow('outputOption')
            });
        });
        describe("BindCommand.cbBegin", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(typeof bc.cbBegin === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbBegin = f1

                expect(bc.cbBegin).toBe(f1)
                // 예외
                expect(()=> bc.cbBegin = {}).toThrow() 
            });
        });
        describe("BindCommand.cbValid", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);

                expect(typeof bc.cbValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbValid = f1

                expect(bc.cbValid).toBe(f1)
                // 예외
                expect(()=> bc.cbValid = {}).toThrow() 
            });
        });
        describe("BindCommand.cbBind", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                expect(typeof bc.cbBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbBind = f1

                expect(bc.cbBind).toBe(f1)
                // 예외
                expect(()=> bc.cbBind = {}).toThrow() 
            });
        });
        describe("BindCommand.cbResult", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                expect(typeof bc.cbResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbResult = f1

                expect(bc.cbResult).toBe(f1)
                // 예외
                expect(()=> bc.cbResult = {}).toThrow() 
            });
        });
        describe("BindCommand.cbOutput", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                expect(typeof bc.cbOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbOutput = f1

                expect(bc.cbOutput).toBe(f1)
                // 예외
                expect(()=> bc.cbOutput = {}).toThrow() 
            });
        });
        describe("BindCommand.cbEnd", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                expect(typeof bc.cbEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                var f1 = (a)=>{}
                bc.cbEnd = f1

                expect(bc.cbEnd).toBe(f1)
                // 예외
                expect(()=> bc.cbEnd = {}).toThrow() 
            });
        });
        describe("BindCommand.execute() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);  

                expect(()=>bc.execute()).toThrow('Abstract')
                expect(()=>bc.exec()).toThrow('Abstract') 
            });
        });
        describe("BindCommand.addColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.addColumn(new HTMLColumn('aa', null, 'AA'));
                bc.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bc.addColumn(new HTMLColumn('cc'));

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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bc.addColumn(new HTMLColumn('bb'), 'bind');
                bc.addColumn(new HTMLColumn('cc'), ['bind', 'output']);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['bb'].value).toBe('');
                expect(bc.bind.columns['cc'].value).toBe('');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['cc'].value).toBe('');
                expect(bc.output.columns.count).toBe(1);
            });
            it("- second table view 매핑 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bm.addTable('second')
                bc.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bc.addColumn(new HTMLColumn('bb'), 'bind', 'second');
                bc.addColumn(new HTMLColumn('cc'), ['bind', 'output'], bm.second);
                bc.addColumn('dd', ['bind', 'output'], bm.second);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm.second.columns['bb'].value).toBe('');
                expect(bm.second.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(3);
                expect(bc.valid.columns['aa'].value).toBe('AA');
                expect(bc.valid.columns.count).toBe(1);
                expect(bc.bind.columns['bb'].value).toBe('');
                expect(bc.bind.columns['cc'].value).toBe('');
                expect(bc.bind.columns.count).toBe(3);
                expect(bc.output.columns['cc'].value).toBe('');
                expect(bc.output.columns.count).toBe(2);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                // expect(()=>bc.addColumn('aa')).toThrow('MetaColumn')
                expect(()=>bc.addColumn(new MetaColumn('aa'), {})).toThrow('Array')
                expect(()=>bc.addColumn(new MetaColumn('aa'), [], [], 'second')).toThrow('테이블이')
                expect(()=>bc.addColumn(new MetaColumn('aa'), [10])).toThrow('String')
                expect(()=>bc.addColumn(new MetaColumn('bb'), 'read')).toThrow('p_views')
            });
        });
        describe("BindCommand.addColumnValue() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                
                expect(()=>bc.addColumnValue(10)).toThrow('string')
                expect(()=>bc.addColumnValue('aa', '', [], 'second')).toThrow('테이블이')
                expect(()=>bc.addColumnValue('aa', '', [], {})).toThrow('테이블이')
                expect(()=>bc.addColumnValue('aa.')).toThrow('다릅니다')

            });
        });

        describe("BindCommand.setColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                expect(bc.bind.columns['bb'].value).toBe(null);
                expect(bc.bind.columns['dd'].value).toBe('DD');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['bb'].value).toBe(null);
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- second table 매핑 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                expect(bc.bind.columns['bb'].value).toBe(null);
                expect(bc.bind.columns['dd'].value).toBe('DD');
                expect(bc.bind.columns.count).toBe(2);
                expect(bc.output.columns['bb'].value).toBe(null);
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- second table 매핑 2 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                expect(bc.output.columns['cc'].value).toBe(null);
                expect(bc.output.columns['dd'].value).toBe('DD');
                expect(bc.output.columns.count).toBe(3);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bm.columns.addValue('aa', 'AA')
                
                expect(()=>bc.setColumn(10)).toThrow('string')
                expect(()=>bc.setColumn([10])).toThrow('itemName')
                expect(()=>bc.setColumn('bb', [], 'second')).toThrow('테이블이')
                expect(()=>bc.setColumn('bb', [])).toThrow('컬럼이')
            });
        });
        describe("BindCommand.release() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.addColumnValue('aa', 'AA')
                bc.addColumnValue('bb', 'BB')
                bc.addColumnValue('cc', 'CC')
                
                expect(()=>bc.release()).toThrow('Array | string')
                expect(()=>bc.release('aa', {})).toThrow('p_views')
                expect(()=>bc.release('bb', [10])).toThrow('String')
                expect(()=>bc.release('bb', ['etc'])).toThrow('없습니다')
            });
        });
        describe("BindCommand.newOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.newOutput('etc');
                
                expect(()=>bc.newOutput(10)).toThrow('string')
                expect(()=>bc.newOutput('etc')).toThrow('총돌')
                expect(()=>bc.newOutput('output')).toThrow('총돌')
                expect(()=>bc.etc = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.removeOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
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
                var bm = new SubBindModel();
                var bc = new SubBindCommand(bm);
                bc.newOutput('etc');
                
                expect(()=>bc.removeOutput(10)).toThrow('string')
                expect(()=>bc.removeOutput('output')).toThrow('기본')
                expect(()=>bc.removeOutput('output1')).toThrow('기본')
                expect(()=>bc.removeOutput('out')).toThrow('존재하지')
            });
        });

        describe("MetaObject <- BaseBind : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);
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
                    // ETC
                    expect(bc.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);

                    expect(bc._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);

                    expect(bc._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);

                    expect(bc._type === SubBindCommand).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc1 = new SubBindCommand(bm);
                    var bc2 = new SubBindCommand(bm);
                    var bc3 = new SubBindCommand(bm);
                    bc3.outOpt = 2

                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc3)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);

                    expect(bc.getTypes()).toEqual([SubBindCommand, BindCommand, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);

                    expect(bc.instanceOf('SubBindCommand')).toBe(true)
                    expect(bc.instanceOf('BindCommand')).toBe(true)
                    expect(bc.instanceOf('BaseBind')).toBe(true)
                    expect(bc.instanceOf('MetaObject')).toBe(true)
                    expect(bc.instanceOf('Object')).toBe(true)
                    expect(bc.instanceOf('MetaTable')).toBe(false)
                    expect(bc.instanceOf(SubBindCommand)).toBe(true)
                    expect(bc.instanceOf(BindCommand)).toBe(true)
                    expect(bc.instanceOf(BaseBind)).toBe(true)
                    expect(bc.instanceOf(MetaObject)).toBe(true)
                    expect(bc.instanceOf(Object)).toBe(true)
                    expect(bc.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);
                    var obj  = bc.getObject()

                    expect(obj._type).toBe("Meta.Bind.SubBindCommand")
                    expect(typeof obj._guid).toBe('string')
                    expect(obj._guid.length > 0).toBe(true)
                });
                it("- output 추가 ", () => {
                    var bm = new SubBindModel();
                    var bc = new SubBindCommand(bm);
                    bc.newOutput();
                    bc.newOutput('etc');
                    var obj  = bc.getObject()

                    expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
                    expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm1 = new SubBindModel()
                    var bc1 = new SubBindCommand(bm1);
                    bm1.cmd.add('read', bc1)
                    bc1.newOutput();
                    bc1.cbBegin = (aa)=>true
                    bc1.cbValid = (aa)=>true
                    bc1.cbBind = (aa)=>true
                    bc1.cbResult = (aa)=>true
                    bc1.cbOutput = (aa)=>true
                    bc1.cbEnd = (aa)=>true

                    var obj  = bm1.getObject()
                    var bm2 = new SubBindModel()
                    bm2.setObject(obj);

                    expect(bm1.equal(bm2)).toBe(true)
                });
                it("- 독립 테이블 사용 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new SubBindCommand();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new SubBindCommand();
                    bc2.setObject(obj);

                    expect(bc1.equal(bc2)).toBe(true)
                    expect(bc1._baseTable.equal(bc2._baseTable)).toBe(true)
                });
                it("- 예외 ", () => {
                    var mt = new MetaTable('t1')
                    var bc1 = new SubBindCommand();
                    bc1._baseTable = mt;
                    var obj  = bc1.getObject()
                    var bc2 = new SubBindCommand();
                    obj._baseTable = '' // 강제 실패

                    expect(()=> bc2.setObject(obj)).toThrow('_baseTable')

                });
                it("- 예외 2", () => {
                    var bm1 = new SubBindModel()
                    var bc1 = new SubBindCommand(bm1);
                    bc1.newOutput();
                    var obj  = bc1.getObject()
                    var bc2 = new SubBindCommand(bm1);

                    expect(()=> bc2.setObject(obj)).toThrow('_model')
                });
                it("- 예외 3 ", () => {
                    class BindModelOnwer extends MetaObject {
                        t1 = new MetaTable('t1');
                        bm = new SubBindCommand();
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
                    var bmo = new BindModelOnwer();
                    var obj  = bmo.getObject()
                    var bm2 = new BindModelOnwer();
                    obj.bm._baseTable.$ref = 'ERR'

                    expect(()=> bm2.setObject(obj)).toThrow('ref')
                });
                // command 만 분리해서 가져오는건 의미가 없음
                // it.skip("- command setObject() ", () => {
                //     var bm = new SubBindModel()
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
