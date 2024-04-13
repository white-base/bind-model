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

        /**
         * ㅇㅇㅇㅇ
         */



        describe.skip("MetaObject <- BaseBind : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var b1 = new SubBindModel();
                    // MetaObject
                    expect(b1.$KEYWORD.indexOf('equal')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('instanceOf')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('getTypes')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_guid')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_type')> -1).toBe(true)
                    // BaseBind
                    expect(b1.$KEYWORD.indexOf('$event')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('$KEYWORD')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('onExecute')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('onExecuted')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_onExecute')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_onExecuted')> -1).toBe(true)
                    // BindModel
                    expect(b1.$KEYWORD.indexOf('_tables')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_columnType')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('items')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('fn')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('command')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cmd')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('columns')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbFail')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbError')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbBaseResult')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbBaseValid')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbBaseBind')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbBaseOutput')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('cbBaseEnd')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('init')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('preRegister')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('preCheck')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('preReady')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('addColumn')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('addColumnValue')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('_readItem')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('setMapping')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('addTable')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('addCommand')> -1).toBe(true)
                    expect(b1.$KEYWORD.indexOf('setService')> -1).toBe(true)
                    // ETC
                    expect(b1.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    expect(b1._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    expect(b1._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    expect(b1._type === SubBindModel).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    var b2 = new SubBindModel();
                    var t1 = new MetaTable('t1');
    
                    expect(b1.equal(b2)).toBe(true)
                    expect(b1.equal(t1)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    expect(b1.getTypes()).toEqual([SubBindModel, BindModel, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
    
                    expect(b1.instanceOf('SubBindModel')).toBe(true)
                    expect(b1.instanceOf('BindModel')).toBe(true)
                    expect(b1.instanceOf('BaseBind')).toBe(true)
                    expect(b1.instanceOf('MetaObject')).toBe(true)
                    expect(b1.instanceOf('Object')).toBe(true)
                    expect(b1.instanceOf('MetaTable')).toBe(false)
                    expect(b1.instanceOf(SubBindModel)).toBe(true)
                    expect(b1.instanceOf(BindModel)).toBe(true)
                    expect(b1.instanceOf(BaseBind)).toBe(true)
                    expect(b1.instanceOf(MetaObject)).toBe(true)
                    expect(b1.instanceOf(Object)).toBe(true)
                    expect(b1.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel();
                    var obj1  = b1.getObject()

                    expect(obj1._type).toBe("Meta.Bind.SubBindModel")
                    expect(typeof obj1._guid).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBindModel()
                    var t1 = new MetaTable('b1');
                    b1._baseTable = t1;
                    var obj1  = b1.getObject()
                    var b2 = new SubBindModel();
                    b2.setObject(obj1);

                    expect(b1.equal(b2)).toBe(true)
                });
            });
        });
    });
});
