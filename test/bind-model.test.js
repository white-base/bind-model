/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');
// const { BaseBind }                 = require('../src/base-bind');

const { MetaObject }            = require('logic-entity');
const { BaseBind }              = require('../src/base-bind');
const { IBindModel }            = require('../src/i-bind-model');
const { IModelCallback }        = require('../src/i-model-callback');
const { BindModel }             = require('../src/bind-model');
const { MetaRegistry }          = require('logic-entity');
const { MetaTable }             = require('logic-entity');
const { MetaTableCollection }   = require('logic-entity');
const { MetaColumn }            = require('logic-entity');
const { HTMLColumn }            = require('../src/html-column');
const { PropertyCollection }    = require('logic-entity');
const { BindCommand }             = require('../src/bind-command');
const { MetaTableColumnCollection } = require('logic-entity');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
var SubBindModel, SubBindCommand;

//==============================================================
// test
describe("[target: bind-model.js]", () => {
    describe("BindModel :: 추상 클래스", () => {
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

        describe("BindModel.BindModel(): 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BindModel()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm).toBe('object')
            });
        });
        describe(" BindModel static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindModel._UNION).toEqual([IBindModel, IModelCallback])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindModel._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindModel._PARAMS).toEqual([])
            });
            it("- _KIND : 인터페이스 타입 ", () => {
                expect(BindModel._KIND).toEqual('abstract')
            });
        });
        describe("BindModel._tables: 메타테이블 컬렉션", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm._tables.instanceOf(MetaTableCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var c1 = new MetaTableCollection();
                c1.add('aa','');
                bm._tables = c1;

                expect(bm._tables.instanceOf(MetaTableCollection)).toBe(true)
                expect(bm._tables.exist('aa')).toBe(true)
                expect(()=> bm._tables = {}).toThrow()
            });
        });
        describe("BindModel._baseTable: 기본 메타테이블", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm._baseTable instanceof MetaTable).toBe(true)
            });
        });
        describe("BindModel._columnType: 기본 컬럼 타입", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm._columnType).toBe(MetaColumn)                
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm._columnType = HTMLColumn;

                expect(bm._columnType).toBe(HTMLColumn)
                expect(()=> bm._columnType = {}).toThrow()
            });
        });
        describe("BindModel.items", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm.items.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.items = c1;

                expect(bm.items.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.items.exist('aa')).toBe(true)
                expect(()=> bm.items = {}).toThrow()
            });
        });
        describe("BindModel.fn", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm.fn.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.fn = c1;

                expect(bm.fn.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.fn.exist('aa')).toBe(true)
                expect(()=> bm.fn = {}).toThrow()
            });
        });
        describe("BindModel.command (cmd)", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm.command.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 확인 (cmd)", () => {
                var bm = new SubBindModel();
                expect(bm.cmd.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.command = c1;

                expect(bm.command.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.command.exist('aa')).toBe(true)
                expect(()=> bm.command = {}).toThrow()
            });
            it("- 변경 (cmd)", () => {
                var bm = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.cmd = c1;

                expect(bm.cmd.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.cmd.exist('aa')).toBe(true)
                expect(()=> bm.cmd = {}).toThrow()
            });
        });
        describe("BindModel.columns", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm.columns instanceof MetaTableColumnCollection).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                expect(()=> bm.columns = {}).toThrow('getter')
            });
        });
        describe("BindModel.cbFail", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbFail === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbFail = f1

                expect(bm.cbFail).toBe(f1)
                expect(()=> bm.cbFail = {}).toThrow()
            });
        });
        describe("BindModel.cbError", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbError === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbError = f1

                expect(bm.cbError).toBe(f1)
                expect(()=> bm.cbError = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseValid", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbBaseValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbBaseValid = f1

                expect(bm.cbBaseValid).toBe(f1)
                expect(()=> bm.cbBaseValid = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseBind", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbBaseBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbBaseBind = f1

                expect(bm.cbBaseBind).toBe(f1)
                expect(()=> bm.cbBaseBind = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseResult", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbBaseResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbBaseResult = f1

                expect(bm.cbBaseResult).toBe(f1)
                expect(()=> bm.cbBaseResult = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseOutput", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbBaseOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbBaseOutput = f1

                expect(bm.cbBaseOutput).toBe(f1)
                expect(()=> bm.cbBaseOutput = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseEnd", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.cbBaseEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.cbBaseEnd = f1

                expect(bm.cbBaseEnd).toBe(f1)
                expect(()=> bm.cbBaseEnd = {}).toThrow()
            });
        });
        describe("BindModel.preRegister", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.preRegister === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.preRegister = f1

                expect(bm.preRegister).toBe(f1)
                expect(()=> bm.preRegister = {}).toThrow()
            });
        });
        describe("BindModel.preCheck", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.preCheck === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.preCheck = f1

                expect(bm.preCheck).toBe(f1)
                expect(()=> bm.preCheck = {}).toThrow()
            });
        });
        describe("BindModel.preReady", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(typeof bm.preReady === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                var f1 = (a)=>{}
                bm.preReady = f1

                expect(bm.preReady).toBe(f1)
                expect(()=> bm.preReady = {}).toThrow()
            });;
        });
        describe("BindModel['first] : _table[0] 기본 메타테이블 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(bm.first instanceof MetaTable).toBe(true)
                expect(bm.first).toBe(bm._tables[0])
                expect(bm.first).toBe(bm._tables['first'])
            });
            it("- 변경 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second');
                bm._baseTable = bm.second;
                expect(bm._baseTable._name).toBe('second')
                expect(()=> bm._baseTable = {}).toThrow()
            });;
        });
        
        describe("BindModel._readItem() ", () => {
            it("- 첫째 테이블(기본)에 전체 읽기 ", () => {
                var bm = new SubBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem([]);

                expect(bm._tables[0].columns['aa'].value).toBe('')
                expect(bm._tables[0].columns['bb'].value).toBe(10)
                expect(bm._tables[0].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns.count).toBe(3)
            });
            it("- 첫째 테이블(기본)에 부분 읽기 ", () => {
                var bm = new SubBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem(['bb', 'cc']);

                expect(bm._tables[0].columns['bb'].value).toBe(10)
                expect(bm._tables[0].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns.count).toBe(2)
            });
            it("- 둘째 테이블에 전체 읽기 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem([], 'second');

                expect(bm._tables['second'].columns['aa'].value).toBe('')
                expect(bm._tables['second'].columns['bb'].value).toBe(10)
                expect(bm._tables[1].columns['cc'].value).toBe(true)
                expect(bm._tables[1].columns.count).toBe(3)
            });
            it("- 둘째 테이블에 일부 읽기 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem(['bb', 'cc'], 'second');

                expect(bm._tables['second'].columns['bb'].value).toBe(10)
                expect(bm._tables['second'].columns['cc'].value).toBe(true)
                expect(bm._tables[1].columns.count).toBe(2)
            });

            it("- 첫째/둘째 테이블에 분할 읽기 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.items.add('aa', '')
                bm.items.add('second.bb', 10)
                bm.items.add('second.cc', true)
                bm._readItem([]);

                expect(bm._tables['first'].columns['aa'].value).toBe('')
                expect(bm._tables['second'].columns['bb'].value).toBe(10)
                expect(bm._tables['second'].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns.count).toBe(1)                
                expect(bm._tables[1].columns.count).toBe(2)                
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)

                expect(()=>bm._readItem()).toThrow('p_items')
                expect(()=>bm._readItem(10)).toThrow('p_items')
                expect(()=>bm._readItem([], 10)).toThrow('MetaTable 이 아닙니다.')
                expect(()=>bm._readItem([], 'ss')).toThrow('대상이름의')
            });

        });
        describe("BindModel.init() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.result = []
                bm.preRegister = ()=>{bm.result.push('preRegister')}
                bm.preCheck = ()=>{bm.result.push('preCheck'); return true; }
                bm.preReady = ()=>{bm.result.push('preReady')}
                bm.init();

                expect(bm.result[0]).toBe('preRegister')
                expect(bm.result[1]).toBe('preCheck')
                expect(bm.result[2]).toBe('preReady')
                expect(bm.result.length).toBe(3)
            });
            it("- check 실패시  ", () => {
                var bm = new SubBindModel();
                bm.result = []
                bm.preRegister = ()=>{bm.result.push('preRegister')}
                bm.preCheck = ()=>{bm.result.push('preCheck'); return false; }
                bm.preReady = ()=>{bm.result.push('preReady')}
                bm.init();

                expect(bm.result[0]).toBe('preRegister')
                expect(bm.result[1]).toBe('preCheck')
                expect(bm.result.length).toBe(2)
            });
        });
        describe("BindModel.addTable() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var t1 = bm.addTable('second')

                expect(bm['second'] === t1).toBe(true)
                expect(bm['second']).toBeDefined()
                expect(bm._tables['second']).toBeDefined()
                expect(bm._tables[1]).toBeDefined()
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')

                expect(()=>bm.addTable(10)).toThrow('string')
                expect(()=>bm.addTable('first')).toThrow('word')
                expect(()=>bm.addTable('items')).toThrow('word')
                expect(()=>bm.addTable('second')).toThrow('중복')
            });
        });
        describe("BindModel.addColumn() ", () => {
            it("- 확인  ", () => {
                var bm = new SubBindModel();
                bm.addColumn(new HTMLColumn('aa', null, 'AA'));
                bm.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bm.addColumn(new HTMLColumn('cc'));

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 확인 : command 생성 ", () => {
                var bm = new SubBindModel();
                bm.addCommand('read')
                bm.addColumn(new HTMLColumn('aa', null, 'AA'), 'read', 'valid');
                bm.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'), 'read', ['bind', 'output']);
                bm.addColumn(new HTMLColumn('cc'), [], []);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns.count).toBe(3);
                expect(bm.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exist('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exist('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exist('bb')).toBe(true)
                expect(bm.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(2)

            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                
                expect(()=>bm.addColumn('aa')).toThrow('MetaColumn')
                expect(()=>bm.addColumn(new MetaColumn('aa'), {})).toThrow('Array')
                expect(()=>bm.addColumn(new MetaColumn('aa'), [], [], 'second')).toThrow('테이블이')
                expect(()=>bm.addColumn(new MetaColumn('aa'), [10])).toThrow('String')
                expect(()=>bm.addColumn(new MetaColumn('aa'), 'read')).toThrow('p_cmds')
            });
        });
        describe("BindModel.addColumnValue() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                bm.addTable('second')
                bm.addColumnValue('aa', 'AA');
                bm.addColumnValue('second.bb', 'BB');
                bm.addColumnValue('cc', 'CC', [], [], 'second');
                bm.addColumnValue('dd', 'DD', [], [], bm.second);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._tables['second'].columns['bb'].value).toBe('BB');
                expect(bm._tables['second'].columns['cc'].value).toBe('CC');
                expect(bm._tables['second'].columns['dd'].value).toBe('DD');
                expect(bm._baseTable.columns.count).toBe(1);
                expect(bm._tables['second'].columns.count).toBe(3);
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                
                expect(()=>bm.addColumnValue(10)).toThrow('string')
                expect(()=>bm.addColumnValue('aa', 'AA', [], [], 'second')).toThrow('테이블이')
            });
        });
        describe("BindModel.setMapping() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel()
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { Array: ['valid'] },
                    bb: { array: ['bind'] },
                    cc: { ALL: ['output'] },
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 확인 : command 추가", () => {
                var bm = new SubBindModel()
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { Array: ['valid'] },
                    bb: { array: ['bind'] },
                    cc: { ALL: [] },
                })

                expect(bm.items.count).toBe(4);
                // command 확인
                expect(bm.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exist('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exist('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)
            });
            it("- 두번째 테이블에 추가 ", () => {
                var bm = new SubBindModel()
                bm.addTable('second')
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { Array: ['valid'] },
                    bb: { array: ['bind'] },
                    'second.cc': { ALL: [] },
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(1);
                // command 확인
                expect(bm.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exist('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exist('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)                

            });
            it("- 두번째 테이블에 추가 : command 추가", () => {
                var bm = new SubBindModel()
                bm.addTable('second')
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { Array: ['valid'] },
                    bb: { array: ['bind'] },
                    'second.cc': { ALL: [] },
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(1);
                // command 확인
                expect(bm.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exist('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exist('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)  
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                
                expect(()=>bm.setMapping(10)).toThrow('object')
                expect(()=>bm.setMapping({aa: {Array: []}}, 10)).toThrow('테이블이')
                expect(()=>bm.setMapping({cc: {Array: []}})).toThrow('매핑할려는')
            });
        });
        describe("BindModel.addCommand() ", () => {
            beforeEach(() => {
                SubBindModel = class SubBindModel extends BindModel {
                    constructor() {
                        super();
                    }
                }
            });
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                expect(()=>bm.addCommand()).toThrow('addCommand')
            });
        });
        describe("BindModel.setService() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBindModel();
                var svc = {
                    tables: ['second', 'three'],
                    command : {'read': {}},
                    items: {
                        aa: '',
                        bb: 10,
                        cc: {},
                        dd: null
                    },
                    fn: {
                        fn1: (aa)=>{ return 'fn1'}
                    },
                    mapping: {
                        aa: {all: []},
                        'second.bb': {all: []},
                        'three.cc': {all: []},
                    },
                    preRegister: ()=> 'preRegister',
                    preCheck: ()=> 'preCheck',
                    preReady: ()=> 'preReady',
                    cbFail: ()=> 'cbFail',
                    cbError: ()=> 'cbError',
                    cbBaseValid: ()=> 'cbBaseValid',
                    cbBaseBind: ()=> 'cbBaseBind',
                    cbBaseResult: ()=> 'cbBaseResult',
                    cbBaseOutput: ()=> 'cbBaseOutput',
                    cbBaseEnd: ()=> 'cbBaseEnd',
                    onExecute: ()=> 'onExecute',
                    onExecuted: ()=> 'onExecuted',
                }   
                bm.setService(svc)

                expect(bm._tables.count).toBe(3)
                expect(bm.columns.count).toBe(1)
                expect(bm._tables['second'].columns.count).toBe(1)
                expect(bm._tables['three'].columns.count).toBe(1)
                expect(bm.fn.count).toBe(1)
                expect(bm.fn['fn1']()).toBe('fn1')
                expect(bm.preRegister()).toBe('preRegister')
                expect(bm.preCheck()).toBe('preCheck')
                expect(bm.preReady()).toBe('preReady')
                expect(bm.cbFail()).toBe('cbFail')
                expect(bm.cbError()).toBe('cbError')
                expect(bm.cbBaseValid()).toBe('cbBaseValid')
                expect(bm.cbBaseBind()).toBe('cbBaseBind')
                expect(bm.cbBaseResult()).toBe('cbBaseResult')
                expect(bm.cbBaseOutput()).toBe('cbBaseOutput')
                expect(bm.cbBaseEnd()).toBe('cbBaseEnd')
                expect(bm.$event._list.length).toBe(2)
            });
            it("- 예외 ", () => {
                var bm = new SubBindModel();

                expect(()=>bm.setService({tables: 10})      ).toThrow('tables')
                expect(()=>bm.setService({command: 10})     ).toThrow('command')
                expect(()=>bm.setService({items: 10})     ).toThrow('items')
                expect(()=>bm.setService({fn: 10})     ).toThrow('fn')
                expect(()=>bm.setService({mapping: 10})     ).toThrow('mapping')
                expect(()=>bm.setService({preRegister: {} })     ).toThrow('preRegister')
                expect(()=>bm.setService({preCheck: {} })     ).toThrow('preCheck')
                expect(()=>bm.setService({preReady: {} })     ).toThrow('preReady')
                expect(()=>bm.setService({cbFail: {}})     ).toThrow('cbFail')
                expect(()=>bm.setService({cbError: {} })     ).toThrow('cbError')
                expect(()=>bm.setService({cbBaseValid: {} })     ).toThrow('cbBaseValid')
                expect(()=>bm.setService({cbBaseBind: {} })     ).toThrow('cbBaseBind')
                expect(()=>bm.setService({cbBaseResult: {} })     ).toThrow('cbBaseResult')
                expect(()=>bm.setService({cbBaseOutput: {} })     ).toThrow('cbBaseOutput')
                expect(()=>bm.setService({cbBaseEnd: {} })     ).toThrow('cbBaseEnd')
                // expect(()=>bm.setService({onExecute: {} })     ).toThrow('onExecute')
                // expect(()=>bm.setService({onExecuted: {} })     ).toThrow('onExecuted')
            });
        });
        
        describe("MetaObject <- BaseBind : 상속 ", () => {
            describe("BaseBind.$KEYWORD: 키워드", () => {
                it("- 조회 ", () => {
                    var bm = new SubBindModel();
                    // MetaObject
                    expect(bm.$KEYWORD.indexOf('equal')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('instanceOf')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('getTypes')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_guid')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_type')> -1).toBe(true)
                    // BaseBind
                    expect(bm.$KEYWORD.indexOf('$event')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('$KEYWORD')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('onExecute')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('onExecuted')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_onExecute')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_onExecuted')> -1).toBe(true)
                    // BindModel
                    expect(bm.$KEYWORD.indexOf('_tables')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_columnType')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('items')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('fn')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('command')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cmd')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('columns')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbFail')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbError')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseResult')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseValid')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseBind')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseOutput')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('cbBaseEnd')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('init')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preRegister')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preCheck')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('preReady')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addColumn')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addColumnValue')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('_readItem')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('setMapping')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addTable')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('addCommand')> -1).toBe(true)
                    expect(bm.$KEYWORD.indexOf('setService')> -1).toBe(true)
                    // ETC
                    expect(bm.$KEYWORD.indexOf('ETC')> -1).toBe(false)
                });
            });
            describe("BaseBind._baseTable: 기본 엔티티", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    expect(bm._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    expect(bm._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    expect(bm._type === SubBindModel).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var b2 = new SubBindModel();
                    var b3 = new SubBindModel();
                    var t1 = new MetaTable('t1');
                    b3.cbBaseBind = ()=>true;
    
                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.equal(b3)).toBe(false)
                    expect(bm.equal(t1)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    expect(bm.getTypes()).toEqual([SubBindModel, BindModel, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
    
                    expect(bm.instanceOf('SubBindModel')).toBe(true)
                    expect(bm.instanceOf('BindModel')).toBe(true)
                    expect(bm.instanceOf('BaseBind')).toBe(true)
                    expect(bm.instanceOf('MetaObject')).toBe(true)
                    expect(bm.instanceOf('Object')).toBe(true)
                    expect(bm.instanceOf('MetaTable')).toBe(false)
                    expect(bm.instanceOf(SubBindModel)).toBe(true)
                    expect(bm.instanceOf(BindModel)).toBe(true)
                    expect(bm.instanceOf(BaseBind)).toBe(true)
                    expect(bm.instanceOf(MetaObject)).toBe(true)
                    expect(bm.instanceOf(Object)).toBe(true)
                    expect(bm.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel();
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.SubBindModel")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new SubBindModel();
                    bm._baseTable = t1
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.SubBindModel")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('undefined')
                    expect(obj1._guid.length > 0).toBe(true)
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBindModel()
                    bm.columns.addValue('aa', 'AA')
                    // bm._baseTable = t1;
                    var obj1  = bm.getObject()
                    var b2 = new SubBindModel();
                    b2.setObject(obj1);

                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.columns.aa.value).toBe('AA')
                    expect(b2.columns.aa.value).toBe('AA')
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new SubBindModel()
                    bm._baseTable = t1;
                    bm.columns.addValue('aa', 'AA')
                    var obj1  = bm.getObject()
                    var b2 = new SubBindModel();
                    b2.setObject(obj1);

                    expect(bm.equal(b2)).toBe(true)
                    // bm
                    expect(bm.columns.aa.value).toBe('AA')
                    expect(bm._baseTable === t1).toBe(true)
                    expect(bm.first.columns.count).toBe(0)
                    // b2
                    expect(b2.columns.aa.value).toBe('AA')
                    expect(b2._baseTable.equal(t1)).toBe(true)
                    expect(b2.first.columns.count).toBe(0)
                    // expect(b2.columns.aa.value).toBe('AA')
                });
            });
        });
    });
});
