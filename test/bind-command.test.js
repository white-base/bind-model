/**
 * ES6 + CJS + JEST
 */
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
                addCommand(p_name, p_option, p_bEntity) {    // 테스트용 임시
                    var bindCommand = new SubBindCommand(this, p_option, p_bEntity);
                    this.command.add(p_name, bindCommand);
                    return bindCommand;
                }
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
                bm.addCommand('read')

                expect(bm.cmd['read']._outputs instanceof MetaViewCollection).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read']._outputs = {}).toThrow('getter')
            });
        });
        describe("BindCommand._model: 바인드모델 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(bm.cmd['read']._model === bm).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read']._model = {}).toThrow('getter')
            });
        });
        describe("BindCommand.valid: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.valid.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bm.cmd['read'].valid instanceof MetaView                 ).toBe(T)
                expect(bm.cmd['read'].valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                   ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBindModel();
                var v1 = new MetaView('v1')
                bm.addCommand('read')
                bm.cmd['read'].valid = v1;
                bm.cmd.read.valid.columns.add('aa')

                expect(bm.cmd['read'].valid instanceof MetaView                 ).toBe(T)
                expect(bm.cmd['read'].valid.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                   ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read'].valid = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.bind: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.bind.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bm.cmd['read'].bind instanceof MetaView                 ).toBe(T)
                expect(bm.cmd['read'].bind.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                   ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBindModel();
                var v1 = new MetaView('v1')
                bm.addCommand('read')
                bm.cmd['read'].bind = v1;
                bm.cmd.read.bind.columns.add('aa')

                expect(bm.cmd['read'].bind instanceof MetaView                 ).toBe(T)
                expect(bm.cmd['read'].bind.columns['aa'] instanceof MetaColumn ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                   ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read'].bind = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.output: 메타뷰 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.output.columns.add('aa') // 상위로 기본으로 추가됨

                expect(bm.cmd['read'].output instanceof MetaView                    ).toBe(T)
                expect(bm.cmd['read'].output1 instanceof MetaView                   ).toBe(T)
                expect(bm.cmd['read'].output === bm.cmd['read'].output1             ).toBe(T)
                expect(bm.cmd['read'].output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                       ).toBe(T)
                expect(bm.columns.count).toBe(1)
            });
            it("- 추가 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.output.columns.add('aa') // 상위로 기본으로 추가됨
                bm.cmd.read.newOutput('good')
                bm.cmd.read.good.columns.add('bb')

                expect(bm.cmd['read'].output instanceof MetaView                    ).toBe(T)
                expect(bm.cmd['read'].output1 instanceof MetaView                   ).toBe(T)
                expect(bm.cmd['read'].output === bm.cmd['read'].output1             ).toBe(T)
                expect(bm.cmd['read'].good instanceof MetaView                      ).toBe(T)
                expect(bm.cmd['read'].output2 instanceof MetaView                   ).toBe(T)
                expect(bm.cmd['read'].output2 === bm.cmd['read'].good               ).toBe(T)
                expect(bm.cmd['read'].output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.cmd['read'].output2 instanceof MetaView                   ).toBe(T)
                expect(bm.cmd['read'].output2.columns['bb'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                       ).toBe(T)
                expect(bm.columns['bb'] instanceof MetaColumn                       ).toBe(T)
                expect(bm.columns.count).toBe(2)
            });
            it("- 변경 후 추가 ", () => {
                var bm = new SubBindModel();
                var v1 = new MetaView('v1')
                bm.addCommand('read')
                bm.cmd['read'].output = v1;
                bm.cmd.read.output.columns.add('aa')

                expect(bm.cmd['read'].output instanceof MetaView                    ).toBe(T)
                expect(bm.cmd['read'].output1 instanceof MetaView                   ).toBe(T)
                expect(bm.cmd['read'].output === bm.cmd['read'].output1             ).toBe(T)
                expect(bm.cmd['read'].output.columns['aa'] instanceof MetaColumn    ).toBe(T)
                expect(bm.cmd['read'].output1.columns['aa'] instanceof MetaColumn   ).toBe(T)
                expect(bm.columns['aa'] instanceof MetaColumn                       ).toBe(false)
                expect(bm.columns.count).toBe(0)    // view가 독립적으로 사용됨
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read'].output = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.outputOption: 출력 옵션 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(bm.cmd['read'].outputOption === bm.cmd['read'].outOpt).toBe(true)

                expect(bm.cmd['read'].outputOption      ).toEqual({option:0, index:0})
            });
            it("- 변경 1 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd['read'].outOpt = 2

                expect(bm.cmd['read'].outputOption      ).toEqual({option:2, index:0})
            });
            it("- 변경 2 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd['read'].outputOption = {option:3}

                expect(bm.cmd['read'].outputOption      ).toEqual({option:3, index:0})
            });
            it("- 변경 3 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd['read'].outOpt = {option:3, index:3, etc: 2}

                expect(bm.cmd['read'].outputOption      ).toEqual({option:3, index:3})
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=> bm.cmd['read'].outputOption = true  ).toThrow('outputOption')
            });
        });
        describe("BindCommand.cbBegin", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(typeof bm.cmd.read.cbBegin === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbBegin = f1

                expect(bm.cmd.read.cbBegin).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbBegin = {}).toThrow() 
            });
        });
        describe("BindCommand.cbValid", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(typeof bm.cmd.read.cbValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbValid = f1

                expect(bm.cmd.read.cbValid).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbValid = {}).toThrow() 
            });
        });
        describe("BindCommand.cbBind", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(typeof bm.cmd.read.cbBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbBind = f1

                expect(bm.cmd.read.cbBind).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbBind = {}).toThrow() 
            });
        });
        describe("BindCommand.cbResult", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(typeof bm.cmd.read.cbResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbResult = f1

                expect(bm.cmd.read.cbResult).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbResult = {}).toThrow() 
            });
        });
        describe("BindCommand.cbOutput", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(typeof bm.cmd.read.cbOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbOutput = f1

                expect(bm.cmd.read.cbOutput).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbOutput = {}).toThrow() 
            });
        });
        describe("BindCommand.cbEnd", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(typeof bm.cmd.read.cbEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                var f1 = (a)=>{}
                bm.cmd.read.cbEnd = f1

                expect(bm.cmd.read.cbEnd).toBe(f1)
                // 예외
                expect(()=> bm.cmd.read.cbEnd = {}).toThrow() 
            });
        });
        describe("BindCommand.execute() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')

                expect(()=>bm.cmd.read.execute()).toThrow('Abstract')
            });
        });
        describe("BindCommand.addColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumn(new HTMLColumn('aa', null, 'AA'));
                bm.cmd.read.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bm.cmd.read.addColumn(new HTMLColumn('cc'));

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.valid.columns['cc'].value).toBe('');
                expect(bm.cmd.read.valid.columns.count).toBe(3);
                expect(bm.cmd.read.bind.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(3);
                expect(bm.cmd.read.output.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.output.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(3);
            });
            it("- view 매핑 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bm.cmd.read.addColumn(new HTMLColumn('bb'), 'bind');
                bm.cmd.read.addColumn(new HTMLColumn('cc'), ['bind', 'output']);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- second table view 매핑 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addCommand('read')
                bm.cmd.read.addColumn(new HTMLColumn('aa', null, 'AA'), ['valid']);
                bm.cmd.read.addColumn(new HTMLColumn('bb'), 'bind', 'second');
                bm.cmd.read.addColumn(new HTMLColumn('cc'), ['bind', 'output'], bm.second);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm.second.columns['bb'].value).toBe('');
                expect(bm.second.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(2);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(()=>bm.cmd.read.addColumn('aa')).toThrow('MetaColumn')
                expect(()=>bm.cmd.read.addColumn(new MetaColumn('aa'), {})).toThrow('Array')
                expect(()=>bm.cmd.read.addColumn(new MetaColumn('aa'), [], [], 'second')).toThrow('테이블이')
                expect(()=>bm.cmd.read.addColumn(new MetaColumn('aa'), [10])).toThrow('String')
                expect(()=>bm.cmd.read.addColumn(new MetaColumn('bb'), 'read')).toThrow('p_views')
            });
        });
        describe("BindCommand.addColumnValue() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA')
                bm.cmd.read.addColumnValue('bb', 'BB')
                bm.cmd.read.addColumnValue('cc', '')

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.valid.columns['cc'].value).toBe('');
                expect(bm.cmd.read.valid.columns.count).toBe(3);
                expect(bm.cmd.read.bind.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(3);
                expect(bm.cmd.read.output.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.output.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(3);

            });
            it("- view 매핑 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA', ['valid'])
                bm.cmd.read.addColumnValue('bb', 'BB', 'bind')
                bm.cmd.read.addColumnValue('cc', '', ['bind', 'output'])

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- second table view 매핑 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA', ['valid']);
                bm.cmd.read.addColumnValue('bb', '', 'bind', 'second');
                bm.cmd.read.addColumnValue('cc', '', ['bind', 'output'], bm.second);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm.second.columns['bb'].value).toBe('');
                expect(bm.second.columns['cc'].value).toBe('');
                expect(bm._baseTable.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(2);
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe('');
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['cc'].value).toBe('');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                
                expect(()=>bm.cmd.read.addColumnValue(10)).toThrow('string')
                expect(()=>bm.cmd.read.addColumnValue('aa', '', [], 'second')).toThrow('테이블이')
                expect(()=>bm.cmd.read.addColumnValue('aa', '', [], {})).toThrow('테이블이')
            });
        });

        describe("BindCommand.setColumn() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.columns.addValue('aa', 'AA')
                bm.columns.add('bb')        // null
                bm.columns.addValue('cc')   // null
                bm.columns.addValue('dd', 'DD')
                bm.cmd.read.setColumn('aa', 'valid')
                bm.cmd.read.setColumn(['bb'], ['bind'])
                bm.cmd.read.setColumn(['bb', 'cc'], ['output'])
                bm.cmd.read.setColumn(['dd'])

                expect(bm.columns.count).toBe(4)
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.valid.columns.count).toBe(2);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.bind.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.output.columns['cc'].value).toBe(null);
                expect(bm.cmd.read.output.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.output.columns.count).toBe(3);
            });
            it("- second table 매핑 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addCommand('read')
                bm.first.columns.addValue('aa', 'AA')
                bm.first.columns.add('bb')        // null
                bm.second.columns.addValue('cc')   // null
                bm.second.columns.addValue('dd', 'DD')
                bm.cmd.read.setColumn('aa', 'valid')
                bm.cmd.read.setColumn(['bb'], ['bind'])
                bm.cmd.read.setColumn(['bb', 'second.cc'], ['output'])
                bm.cmd.read.setColumn(['second.dd'])

                expect(bm.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.valid.columns.count).toBe(2);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.bind.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.output.columns['cc'].value).toBe(null);
                expect(bm.cmd.read.output.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.output.columns.count).toBe(3);
            });
            it("- second table 매핑 2 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addCommand('read')
                bm.first.columns.addValue('aa', 'AA')
                bm.first.columns.add('bb')        // null
                bm.second.columns.addValue('cc')   // null
                bm.second.columns.addValue('dd', 'DD')
                bm.cmd.read.setColumn('aa', 'valid')
                bm.cmd.read.setColumn(['bb'], ['bind'])
                bm.cmd.read.setColumn(['first.bb', 'cc'], ['output'], 'second')
                bm.cmd.read.setColumn(['dd'], [], bm.second)

                expect(bm.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bm.cmd.read.valid.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.valid.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.valid.columns.count).toBe(2);
                expect(bm.cmd.read.bind.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.bind.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.bind.columns.count).toBe(2);
                expect(bm.cmd.read.output.columns['bb'].value).toBe(null);
                expect(bm.cmd.read.output.columns['cc'].value).toBe(null);
                expect(bm.cmd.read.output.columns['dd'].value).toBe('DD');
                expect(bm.cmd.read.output.columns.count).toBe(3);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.columns.addValue('aa', 'AA')
                
                expect(()=>bm.cmd.read.setColumn(10)).toThrow('string')
                expect(()=>bm.cmd.read.setColumn([10])).toThrow('itemName')
                expect(()=>bm.cmd.read.setColumn('bb', [], 'second')).toThrow('테이블이')
                expect(()=>bm.cmd.read.setColumn('bb', [])).toThrow('컬럼이')
            });
        });
        describe("BindCommand.release() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA')
                bm.cmd.read.addColumnValue('bb', 'BB')
                bm.cmd.read.addColumnValue('cc', 'CC')
                bm.cmd.read.release('aa', 'valid')
                bm.cmd.read.release(['bb'], ['bind', 'output'])
                bm.cmd.read.release('cc')

                expect(bm.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.bind.columns.count).toBe(1);
                expect(bm.cmd.read.output.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- 확인 2", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA')
                bm.cmd.read.addColumnValue('bb', 'BB')
                bm.cmd.read.addColumnValue('cc', 'CC')
                bm.cmd.read.release(['aa', 'bb'], ['valid', 'bind'])

                expect(bm.columns.count).toBe(3);
                expect(bm.cmd.read.valid.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.bind.columns.count).toBe(1);
                expect(bm.cmd.read.output.columns['aa'].value).toBe('AA');
                expect(bm.cmd.read.output.columns['bb'].value).toBe('BB');
                expect(bm.cmd.read.output.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.output.columns.count).toBe(3);
            });
            it("- 확인 3", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA', []);
                bm.cmd.read.addColumnValue('bb', 'BB', [], 'second');
                bm.cmd.read.addColumnValue('cc', 'CC', [], bm.second);
                bm.cmd.read.release(['aa', 'bb'])

                expect(bm.columns.count).toBe(1);
                expect(bm.second.columns.count).toBe(2);
                expect(bm.cmd.read.valid.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.bind.columns.count).toBe(1);
                expect(bm.cmd.read.output.columns['cc'].value).toBe('CC');
                expect(bm.cmd.read.output.columns.count).toBe(1);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.addColumnValue('aa', 'AA')
                bm.cmd.read.addColumnValue('bb', 'BB')
                bm.cmd.read.addColumnValue('cc', 'CC')
                
                expect(()=>bm.cmd.read.release()).toThrow('Array | string')
                expect(()=>bm.cmd.read.release('aa', {})).toThrow('p_views')
                expect(()=>bm.cmd.read.release('bb', [10])).toThrow('String')
                expect(()=>bm.cmd.read.release('bb', ['etc'])).toThrow('없습니다')
            });
        });
        describe("BindCommand.newOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.newOutput();
                bm.cmd.read.newOutput('etc');

                expect(bm.cmd.read.output1 instanceof MetaView).toBe(true)
                expect(bm.cmd.read.output2 instanceof MetaView).toBe(true)
                expect(bm.cmd.read.output3 instanceof MetaView).toBe(true)
                expect(bm.cmd.read.output === bm.cmd.read.output1).toBe(true)
                expect(bm.cmd.read.output2 === bm.cmd.read.output2).toBe(true)
                expect(bm.cmd.read.output3 === bm.cmd.read.etc).toBe(true)
                expect(bm.cmd.read._outputs.count).toBe(3)
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.newOutput('etc');
                
                expect(()=>bm.cmd.read.newOutput(10)).toThrow('string')
                expect(()=>bm.cmd.read.newOutput('etc')).toThrow('총돌')
                expect(()=>bm.cmd.read.newOutput('output')).toThrow('총돌')
                expect(()=>bm.cmd.read.etc = {}).toThrow('MetaView')
            });
        });
        describe("BindCommand.removeOutput() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.newOutput();
                bm.cmd.read.newOutput('etc');
                bm.cmd.read.removeOutput('etc');

                expect(bm.cmd.read.output1 instanceof MetaView).toBe(true)
                expect(bm.cmd.read.output2 instanceof MetaView).toBe(true)
                expect(bm.cmd.read.output === bm.cmd.read.output1).toBe(true)
                expect(bm.cmd.read.output2 === bm.cmd.read.output2).toBe(true)
                expect(bm.cmd.read._outputs.count).toBe(2)
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.cmd.read.newOutput('etc');
                
                expect(()=>bm.cmd.read.removeOutput(10)).toThrow('string')
                expect(()=>bm.cmd.read.removeOutput('output')).toThrow('기본')
                expect(()=>bm.cmd.read.removeOutput('output1')).toThrow('기본')
                expect(()=>bm.cmd.read.removeOutput('out')).toThrow('존재하지')
            });
        });

        describe("MetaObject <- BaseBind : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;
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
                    expect(bc.$KEYWORD.indexOf('output1')> -1).toBe(true)
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
                    bm.addCommand('read')
                    var bc = bm.cmd.read;

                    expect(bc._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;

                    expect(bc._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;

                    expect(bc._type === SubBindCommand).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    bm.addCommand('view')
                    bm.addCommand('list')
                    var bc1 = bm.cmd.read;
                    var bc2 = bm.cmd.view;
                    var bc3 = bm.cmd.list;
                    bc3.outOpt = 2

                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc2)).toBe(T)
                    expect(bc1.equal(bc3)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;

                    expect(bc.getTypes()).toEqual([SubBindCommand, BindCommand, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;

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
                    bm.addCommand('read')
                    var bc = bm.cmd.read;
                    var obj  = bc.getObject()

                    expect(obj._type).toBe("Meta.Bind.SubBindCommand")
                    expect(typeof obj._guid).toBe('string')
                    expect(obj._guid.length > 0).toBe(true)
                });
                it("- output 추가 ", () => {
                    var bm = new SubBindModel();
                    bm.addCommand('read')
                    var bc = bm.cmd.read;
                    bc.newOutput();
                    bc.newOutput('etc');
                    var obj  = bc.getObject()

                    expect(obj.$newOutput[0]).toEqual({cmdName: 'output', viewName: 'output1'})
                    expect(obj.$newOutput[1]).toEqual({cmdName: 'etc', viewName: 'output3'})
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel()
                    bm.addCommand('read')
                    var bc1 = bm.cmd.read;
                    bc1.newOutput();
                    var obj  = bm.getObject()
                    var b2 = new SubBindModel()
                    b2.setObject(obj);

                    expect(bm.equal(b2)).toBe(true)
                });
                // command 만 분리해서 가져오는건 의미가 없음
                it.skip("- command setObject() ", () => {
                    var bm = new SubBindModel()
                    bm.addCommand('read')
                    var bc1 = bm.cmd.read;
                    bc1.newOutput();
                    var obj  = bc1.getObject()
                    bm.addCommand('list')
                    var bc2 = bm.cmd.list;
                    bc2.setObject(obj);

                    expect(bm.equal(b2)).toBe(true)
                });
            });
        });
    });
});
