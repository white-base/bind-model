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

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
var SubBindModel;

//==============================================================
// test
describe("[target: bind-model.js]", () => {
    describe("BindModel :: 추상 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBindModel = class SubBindModel extends BindModel {
                constructor() {
                    super();
                }
            }
        });

        describe("BindModel.BindModel(): 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BindModel()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1).toBe('object')
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
                var b1 = new SubBindModel();
                expect(b1._tables.instanceOf(MetaTableCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var c1 = new MetaTableCollection();
                c1.add('aa','');
                b1._tables = c1;

                expect(b1._tables.instanceOf(MetaTableCollection)).toBe(true)
                expect(b1._tables.exist('aa')).toBe(true)
                expect(()=> b1._tables = {}).toThrow()
            });

        });
        describe("BindModel._baseTable: 기본 메타테이블", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                // POINT:
                // expect(b1._baseTable).toBe(null)
            });
        });
        describe("BindModel._columnType: 기본 컬럼 타입", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(b1._columnType).toBe(MetaColumn)                
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                b1._columnType = HTMLColumn;

                expect(b1._columnType).toBe(HTMLColumn)
                expect(()=> b1._columnType = {}).toThrow()
            });
        });
        describe("BindModel.items", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(b1.items.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                b1.items = c1;

                expect(b1.items.instanceOf(PropertyCollection)).toBe(true)
                expect(b1.items.exist('aa')).toBe(true)
                expect(()=> b1.items = {}).toThrow()
            });
        });
        describe("BindModel.fn", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(b1.fn.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                b1.fn = c1;

                expect(b1.fn.instanceOf(PropertyCollection)).toBe(true)
                expect(b1.fn.exist('aa')).toBe(true)
                expect(()=> b1.fn = {}).toThrow()
            });
        });
        describe("BindModel.command (cmd)", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(b1.command.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 확인 (cmd)", () => {
                var b1 = new SubBindModel();
                expect(b1.cmd.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                b1.command = c1;

                expect(b1.command.instanceOf(PropertyCollection)).toBe(true)
                expect(b1.command.exist('aa')).toBe(true)
                expect(()=> b1.command = {}).toThrow()
            });
            it("- 변경 (cmd)", () => {
                var b1 = new SubBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                b1.cmd = c1;

                expect(b1.cmd.instanceOf(PropertyCollection)).toBe(true)
                expect(b1.cmd.exist('aa')).toBe(true)
                expect(()=> b1.cmd = {}).toThrow()
            });
        });
        describe("BindModel.columns", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                // POINT:
                // expect(b1.columns).toBe(null)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                expect(()=> b1.columns = {}).toThrow('getter')
            });
        });
        describe("BindModel.cbFail", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbFail === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbFail = f1

                expect(b1.cbFail).toBe(f1)
                expect(()=> b1.cbFail = {}).toThrow()
            });
        });
        describe("BindModel.cbError", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbError === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbError = f1

                expect(b1.cbError).toBe(f1)
                expect(()=> b1.cbError = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseValid", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbBaseValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbBaseValid = f1

                expect(b1.cbBaseValid).toBe(f1)
                expect(()=> b1.cbBaseValid = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseBind", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbBaseBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbBaseBind = f1

                expect(b1.cbBaseBind).toBe(f1)
                expect(()=> b1.cbBaseBind = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseResult", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbBaseResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbBaseResult = f1

                expect(b1.cbBaseResult).toBe(f1)
                expect(()=> b1.cbBaseResult = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseOutput", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbBaseOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbBaseOutput = f1

                expect(b1.cbBaseOutput).toBe(f1)
                expect(()=> b1.cbBaseOutput = {}).toThrow()
            });
        });
        describe("BindModel.cbBaseEnd", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.cbBaseEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.cbBaseEnd = f1

                expect(b1.cbBaseEnd).toBe(f1)
                expect(()=> b1.cbBaseEnd = {}).toThrow()
            });
        });
        describe("BindModel.preRegister", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.preRegister === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.preRegister = f1

                expect(b1.preRegister).toBe(f1)
                expect(()=> b1.preRegister = {}).toThrow()
            });
        });
        describe("BindModel.preCheck", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.preCheck === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.preCheck = f1

                expect(b1.preCheck).toBe(f1)
                expect(()=> b1.preCheck = {}).toThrow()
            });
        });
        describe("BindModel.preReady", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(typeof b1.preReady === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                var f1 = (a)=>{}
                b1.preReady = f1

                expect(b1.preReady).toBe(f1)
                expect(()=> b1.preReady = {}).toThrow()
            });;
        });
        describe("BindModel['first] : _table[0] 기본 메타테이블 ", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                expect(b1.first instanceof MetaTable).toBe(true)
                expect(b1.first).toBe(b1._tables[0])
                expect(b1.first).toBe(b1._tables['first'])
            });
            it("- 변경 ", () => {
                var b1 = new SubBindModel();
                b1.addTable('second');
                b1._baseTable = b1.second;
                expect(b1._baseTable._name).toBe('second')
                expect(()=> b1._baseTable = {}).toThrow()
            });;
        });
        
        describe("BindModel._readItem() ", () => {
            it("- 첫째 테이블(기본)에 전체 읽기 ", () => {
                var b1 = new SubBindModel();
                b1.items.add('aa', '')
                b1.items.add('bb', 10)
                b1.items.add('cc', true)
                b1._readItem([]);

                expect(b1._tables[0].columns['aa'].value).toBe('')
                expect(b1._tables[0].columns['bb'].value).toBe(10)
                expect(b1._tables[0].columns['cc'].value).toBe(true)
                expect(b1._tables[0].columns.count).toBe(3)
            });
            it("- 첫째 테이블(기본)에 부분 읽기 ", () => {
                var b1 = new SubBindModel();
                b1.items.add('aa', '')
                b1.items.add('bb', 10)
                b1.items.add('cc', true)
                b1._readItem(['bb', 'cc']);

                expect(b1._tables[0].columns['bb'].value).toBe(10)
                expect(b1._tables[0].columns['cc'].value).toBe(true)
                expect(b1._tables[0].columns.count).toBe(2)
            });
            it("- 둘째 테이블에 전체 읽기 ", () => {
                var b1 = new SubBindModel();
                b1.addTable('second')
                b1.items.add('aa', '')
                b1.items.add('bb', 10)
                b1.items.add('cc', true)
                b1._readItem([], 'second');

                expect(b1._tables['second'].columns['aa'].value).toBe('')
                expect(b1._tables['second'].columns['bb'].value).toBe(10)
                expect(b1._tables[1].columns['cc'].value).toBe(true)
                expect(b1._tables[1].columns.count).toBe(3)
            });
            it("- 둘째 테이블에 일부 읽기 ", () => {
                var b1 = new SubBindModel();
                b1.addTable('second')
                b1.items.add('aa', '')
                b1.items.add('bb', 10)
                b1.items.add('cc', true)
                b1._readItem(['bb', 'cc'], 'second');

                expect(b1._tables['second'].columns['bb'].value).toBe(10)
                expect(b1._tables['second'].columns['cc'].value).toBe(true)
                expect(b1._tables[1].columns.count).toBe(2)
            });

            it("- 첫째/둘째 테이블에 분할 읽기 ", () => {
                var b1 = new SubBindModel();
                b1.addTable('second')
                b1.items.add('aa', '')
                b1.items.add('second.bb', 10)
                b1.items.add('second.cc', true)
                b1._readItem([]);

                expect(b1._tables['first'].columns['aa'].value).toBe('')
                expect(b1._tables['second'].columns['bb'].value).toBe(10)
                expect(b1._tables['second'].columns['cc'].value).toBe(true)
                expect(b1._tables[0].columns.count).toBe(1)                
                expect(b1._tables[1].columns.count).toBe(2)                
            });
            it("- 예외 ", () => {
                var b1 = new SubBindModel();
                b1.items.add('aa', '')
                b1.items.add('bb', 10)
                b1.items.add('cc', true)

                expect(()=>b1._readItem()).toThrow('p_items')
                expect(()=>b1._readItem(10)).toThrow('p_items')
                expect(()=>b1._readItem([], 10)).toThrow('MetaTable 이 아닙니다.')
                expect(()=>b1._readItem([], 'ss')).toThrow('대상이름의')
            });

        });
        describe("BindModel.init() ", () => {
            it("- 확인 ", () => {
                var b1 = new SubBindModel();
                b1.init();
                // TODO:
            });
        });
        describe("BindModel.addTable() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        describe("BindModel.addColumn() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        describe("BindModel.addColumnValue() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        describe("BindModel.setMapping() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        describe("BindModel.addCommand() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        describe("BindModel.setService() ", () => {
            it("- 확인 ", () => {
                // TODO:
            });
        });
        
        describe("MetaObject <- BaseBind : 상속 ", () => {
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
                    // TODO: 반영필요
                    // expect(b1._baseTable).toBe(null)
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
