// ES6, cjs, jest
//==============================================================
// gobal defined
// 'use strict';
// const Util                      = require('logic-core');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
// const { MetaRegistry }          = require('logic-core');
// const { BaseBind }                 = require('../src/base-bind');

// const { MetaObject }            = require('logic-entity');
// const { BaseBind }              = require('../src/base-bind');
// const { IBindModel }            = require('../src/i-bind-model');
// const { IModelCallback }        = require('../src/i-model-callback');
// const { BaseBindModel }             = require('../src/base-bind-model');
// const { MetaRegistry }          = require('logic-entity');
// const { MetaTable }             = require('logic-entity');
// const { MetaTableCollection }   = require('logic-entity');
// const { MetaColumn }            = require('logic-entity');
// const { HTMLColumn }            = require('../src/html-column');
// const { PropertyCollection }    = require('logic-entity');
// const { BaseBindCommand }             = require('../src/base-bind-command');
// const { MetaTableColumnCollection } = require('logic-entity');
import { jest } from '@jest/globals';

import { MetaObject } from 'logic-entity';
import { BaseBind } from '../src/base-bind';
import { IBindModel } from '../src/i-bind-model';
import { IModelCallback } from '../src/i-model-callback';
import { BaseBindModel } from '../src/base-bind-model';
import { MetaRegistry } from 'logic-entity';
import { MetaTable } from 'logic-entity';
import { MetaTableCollection } from 'logic-entity';
import { MetaColumn } from 'logic-entity';
import { HTMLColumn } from '../src/html-column';
import { PropertyCollection } from 'logic-entity';
import { BaseBindCommand } from '../src/base-bind-command';
import { MetaTableColumnCollection } from 'logic-entity';
import { Message } from '../src/message-wrap';

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
var SubBaseBindModel, SubBaseBindCommand;
var T = true;

//==============================================================
// test
describe("[target: base-bind-model.js]", () => {
    describe("BaseBindModel :: 추상 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBaseBindCommand = class SubBaseBindCommand extends BaseBindCommand {
                constructor(p_BaseBindModel, p_bEntity) {
                    super(p_BaseBindModel, p_bEntity);
                }
            }
            SubBaseBindModel = class SubBaseBindModel extends BaseBindModel {
                constructor() {
                    super();
                }
                addCommand(p_name, p_option, p_bEntity) {    // 테스트용 임시
                    var bindCommand = new SubBaseBindCommand(this, p_option, p_bEntity);
                    this.command.add(p_name, bindCommand);
                    return bindCommand;
                }
            }
        });

        describe("BaseBindModel.BaseBindModel(): 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BaseBindModel()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm).toBe('object')
            });
        });
        describe(" BaseBindModel static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BaseBindModel._UNION).toEqual([IBindModel, IModelCallback])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BaseBindModel._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BaseBindModel._PARAMS).toEqual([])
            });
            it("- _KIND : 인터페이스 타입 ", () => {
                expect(BaseBindModel._KIND).toEqual('abstract')
            });
        });
        describe("BaseBindModel._tables: 메타테이블 컬렉션", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm._tables.instanceOf(MetaTableCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var c1 = new MetaTableCollection();
                c1.add('aa','');
                bm._tables = c1;

                expect(bm._tables.instanceOf(MetaTableCollection)).toBe(true)
                expect(bm._tables.exists('aa')).toBe(true)
                expect(()=> bm._tables = {}).toThrow()
            });
        });
        describe("BaseBindModel._baseTable: 기본 메타테이블", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm._baseTable instanceof MetaTable).toBe(true)
            });
        });
        describe("BaseBindModel._columnType: 기본 컬럼 타입", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm._columnType).toBe(MetaColumn)                
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                bm._columnType = HTMLColumn;

                expect(bm._columnType).toBe(HTMLColumn)
                expect(()=> bm._columnType = {}).toThrow()
            });
        });
        describe("BaseBindModel.items", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm.items.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.items = c1;

                expect(bm.items.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.items.exists('aa')).toBe(true)
                expect(()=> bm.items = {}).toThrow()
            });
        });
        describe("BaseBindModel.fn", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm.fn.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.fn = c1;

                expect(bm.fn.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.fn.exists('aa')).toBe(true)
                expect(()=> bm.fn = {}).toThrow()
            });
        });
        describe("BaseBindModel.command (cmd)", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm.command.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 확인 (cmd)", () => {
                var bm = new SubBaseBindModel();
                expect(bm.cmd.instanceOf(PropertyCollection)).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.command = c1;

                expect(bm.command.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.command.exists('aa')).toBe(true)
                expect(()=> bm.command = {}).toThrow()
            });
            it("- 변경 (cmd)", () => {
                var bm = new SubBaseBindModel();
                var c1 = new PropertyCollection();
                c1.add('aa','');
                bm.cmd = c1;

                expect(bm.cmd.instanceOf(PropertyCollection)).toBe(true)
                expect(bm.cmd.exists('aa')).toBe(true)
                expect(()=> bm.cmd = {}).toThrow()
            });
        });
        describe("BaseBindModel.columns", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm.columns instanceof MetaTableColumnCollection).toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                expect(()=> bm.columns = {}).toThrow('getter')
            });
        });
        describe("BaseBindModel.cbFail", () => {
            it("- 확인 ", () => {
                var result = [];
                console.warn = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new SubBaseBindModel();
                bm.cbFail.call(this)

                expect(typeof bm.cbFail === 'function').toBe(true)
                expect(result[0]).toMatch(/Err/);
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbFail = f1

                expect(bm.cbFail).toBe(f1)
                expect(()=> bm.cbFail = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbError", () => {
            it("- 확인 ", () => {
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                });
                var bm = new SubBaseBindModel();
                bm.cbError.call(this)
                
                expect(typeof bm.cbError === 'function').toBe(true)
                expect(result[0]).toMatch(/error/);
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbError = f1

                expect(bm.cbError).toBe(f1)
                expect(()=> bm.cbError = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseBegin", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseBegin === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseBegin = f1

                expect(bm.cbBaseBegin).toBe(f1)
                expect(()=> bm.cbBaseBegin = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseValid", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseValid === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseValid = f1

                expect(bm.cbBaseValid).toBe(f1)
                expect(()=> bm.cbBaseValid = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseBind", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseBind === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseBind = f1

                expect(bm.cbBaseBind).toBe(f1)
                expect(()=> bm.cbBaseBind = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseResult", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseResult === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseResult = f1

                expect(bm.cbBaseResult).toBe(f1)
                expect(()=> bm.cbBaseResult = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseOutput", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseOutput === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseOutput = f1

                expect(bm.cbBaseOutput).toBe(f1)
                expect(()=> bm.cbBaseOutput = {}).toThrow()
            });
        });
        describe("BaseBindModel.cbBaseEnd", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.cbBaseEnd === 'undefined').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.cbBaseEnd = f1

                expect(bm.cbBaseEnd).toBe(f1)
                expect(()=> bm.cbBaseEnd = {}).toThrow()
            });
        });
        describe("BaseBindModel.preRegister", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.preRegister === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.preRegister = f1

                expect(bm.preRegister).toBe(f1)
                expect(()=> bm.preRegister = {}).toThrow()
            });
        });
        describe("BaseBindModel.preCheck", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.preCheck === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.preCheck = f1

                expect(bm.preCheck).toBe(f1)
                expect(()=> bm.preCheck = {}).toThrow()
            });
        });
        describe("BaseBindModel.preReady", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(typeof bm.preReady === 'function').toBe(true)
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                var f1 = (a)=>{}
                bm.preReady = f1

                expect(bm.preReady).toBe(f1)
                expect(()=> bm.preReady = {}).toThrow()
            });;
        });
        describe("BaseBindModel['first] : _table[0] 기본 메타테이블 ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(bm.first instanceof MetaTable).toBe(true)
                expect(bm.first).toBe(bm._tables[0])
                expect(bm.first).toBe(bm._tables['first'])
            });
            it("- 변경 ", () => {
                var bm = new SubBaseBindModel();
                bm.addTable('second');
                bm._baseTable = bm.second;
                expect(bm._baseTable._name).toBe('second')
                expect(()=> bm._baseTable = {}).toThrow()
            });;
        });
        // describe("BaseBindModel.$isAllCommandName() : 전체 컬럼 여부 ", () => {
        //     it("- 확인 ", () => {
        //         var bm = new SubBaseBindModel();
        //         expect(bm.first instanceof MetaTable).toBe(true)
        //         expect(bm.first).toBe(bm._tables[0])
        //         expect(bm.first).toBe(bm._tables['first'])
        //     });
        //     it("- 변경 ", () => {
        //         var bm = new SubBaseBindModel();
        //         bm.addTable('second');
        //         bm._baseTable = bm.second;
        //         expect(bm._baseTable._name).toBe('second')
        //         expect(()=> bm._baseTable = {}).toThrow()
        //     });;
        // });
        
        describe("BaseBindModel._readItem() ", () => {
            it("- 첫째 테이블(기본)에 전체 읽기 ", () => {
                var bm = new SubBaseBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem([]);

                expect(bm._tables[0].cols['aa'].val).toBe('')
                expect(bm._tables[0].columns['bb'].value).toBe(10)
                expect(bm._tables[0].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns.count).toBe(3)
            });
            it("- 첫째 테이블(기본)에 전체 읽기, __ 아이템 제외, 객체형 아이템 ", () => {
                var bm = new SubBaseBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm.items.add('dd', {required: true })
                bm.items.add('__dd', true)
                bm._readItem([]);

                expect(bm._tables[0].columns['aa'].value).toBe('')
                expect(bm._tables[0].columns['bb'].value).toBe(10)
                expect(bm._tables[0].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns['dd'].required).toBe(true)
                expect(bm._tables[0].columns.count).toBe(4)
            });

            it("- 첫째 테이블(기본)에 부분 읽기 ", () => {
                var bm = new SubBaseBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm._readItem(['bb', 'cc']);

                expect(bm._tables[0].columns['bb'].value).toBe(10)
                expect(bm._tables[0].columns['cc'].value).toBe(true)
                expect(bm._tables[0].columns.count).toBe(2)
            });
            it("- 둘째 테이블에 전체 읽기 ", () => {
                var bm = new SubBaseBindModel();
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
                var bm = new SubBaseBindModel();
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
                var bm = new SubBaseBindModel();
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
                var bm = new SubBaseBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', 10)
                bm.items.add('cc', true)
                bm.items.add('dd', null)

                expect(()=>bm._readItem('dd')).toThrow('EL061221')
                expect(()=>bm._readItem()).toThrow('EL061218')
                expect(()=>bm._readItem(10)).toThrow('EL061218')
                expect(()=>bm._readItem([], 10)).toThrow('EL061220')
                expect(()=>bm._readItem([], 'ss')).toThrow('EL061219')
            });

        });
        describe("BaseBindModel.init() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
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
                var bm = new SubBaseBindModel();
                bm.result = []
                bm.preRegister = ()=>{bm.result.push('preRegister')}
                bm.preCheck = ()=>{bm.result.push('preCheck'); return false; }
                bm.preReady = ()=>{bm.result.push('preReady')}
                bm.init();

                expect(bm.result[0]).toBe('preRegister')
                expect(bm.result[1]).toBe('preCheck')
                expect(bm.result.length).toBe(2)
            });
            it("- 예외  ", () => {
                var result = [];
                console.error = jest.fn( (msg) => {
                    result.push(msg);
                }); 
                var bm = new SubBaseBindModel();
                bm.result = []
                bm.preRegister = ()=>{bm.result.push('preRegister')}
                bm.preCheck = ()=>{bm.result.push('preCheck'); throw new Error('강제오류') }
                bm.preReady = ()=>{bm.result.push('preReady')}
                bm.init();

                expect(bm.result[0]).toBe('preRegister')
                expect(bm.result[1]).toBe('preCheck')
                expect(bm.result.length).toBe(2)
                expect(result[0]).toMatch(/강제오류/);
            });
        });
        describe("BaseBindModel.addTable() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var t1 = bm.addTable('second')

                expect(bm['second'] === t1).toBe(true)
                expect(bm['second']).toBeDefined()
                expect(bm._tables['second']).toBeDefined()
                expect(bm._tables[1]).toBeDefined()
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                bm.addTable('second')

                expect(()=>bm.addTable(10)).toThrow('string')
                expect(()=>bm.addTable('first')).toThrow('EL061225')
                expect(()=>bm.addTable('items')).toThrow('EL061225')
                expect(()=>bm.addTable('second')).toThrow('duplicated')
            });
        });
        describe("BaseBindModel.addColumn() ", () => {
            it("- 확인  ", () => {
                var bm = new SubBaseBindModel();
                bm.addColumn(new HTMLColumn('aa', null, 'AA'));
                bm.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bm.addColumn(new HTMLColumn('cc'));

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 확인 EXAM: ", () => {
                var bm = new SubBaseBindModel();
                bm.columns.onAdd = function(idx, elem, _this) {
                    console.log(`before : idx = ${idx}, elem = ${elem._name}`);
                };
                bm.columns.onAdded = function(idx, elem, _this) {
                    console.log(`after : idx = ${idx}, elem = ${elem._name}`);
                };

                bm.addColumn(new HTMLColumn('aa', null, 'AA'));
                // bm.addColumn('aa');
                bm.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'));
                bm.addColumn(new HTMLColumn('cc'));

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 확인 : command 생성 ", () => {
                var bm = new SubBaseBindModel();
                bm.addCommand('read')
                bm.addColumn(new HTMLColumn('aa', null, 'AA'), 'read', 'valid');
                bm.addColumn(new HTMLColumn('bb', bm._baseTable, 'BB'), 'read', ['bind', 'output']);
                bm.addColumn(new HTMLColumn('cc'), [], []);
                bm.addColumn('dd', [], []);

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._baseTable.columns['bb'].value).toBe('BB');
                expect(bm._baseTable.columns.count).toBe(4);
                expect(bm.command.read.valid.columns.exists('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exists('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(3)
                expect(bm.command.read.bind.columns.exists('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exists('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(3)
                expect(bm.command.read.output.columns.exists('bb')).toBe(true)
                expect(bm.command.read.output.columns.exists('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(3)

            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                
                expect(()=>bm.addColumn(10)).toThrow('EL061227')
                expect(()=>bm.addColumn(new MetaColumn('aa'), {})).toThrow('EL061228')
                expect(()=>bm.addColumn(new MetaColumn('aa'), [], [], 'second')).toThrow('table')
                expect(()=>bm.addColumn(new MetaColumn('aa'), [10])).toThrow('EL061230')
                expect(()=>bm.addColumn(new MetaColumn('aa'), 'read')).toThrow('EL061231')
            });
        });
        describe("BaseBindModel.addColumnValue() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                bm.addTable('second')
                bm.addColumnValue('aa', 'AA');
                bm.addColumnValue('second.bb', 'BB');
                bm.addColumnValue('cc', 'CC', [], [], 'second');
                bm.addColumnValue('dd', 'DD', [], [], bm.second);
                bm.addColumnValue('ee', {required: true});

                expect(bm._baseTable.columns['aa'].value).toBe('AA');
                expect(bm._tables['second'].columns['bb'].value).toBe('BB');
                expect(bm._tables['second'].columns['cc'].value).toBe('CC');
                expect(bm._tables['second'].columns['dd'].value).toBe('DD');
                expect(bm.columns['ee'].required).toBe(true);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(3);
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();

                expect(()=>bm.addColumnValue(10)).toThrow('string')
                // expect(()=>bm.addColumnValue('.aa')).toThrow('string')
                expect(()=>bm.addColumnValue('aa.')).toThrow('EL061217')
                expect(()=>bm.addColumnValue('aa', 'AA', [], [], 'second')).toThrow('table')
            });
        });
        describe("BaseBindModel.setMapping() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel()
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    cc: { $all: ['output'] },
                    dd: undefined
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 자동 컬럼 생성 ", () => {
                var bm = new SubBaseBindModel()
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    cc: { $all: ['output'] },
                    dd: undefined
                })

                expect(bm.items.count).toBe(0);
                expect(bm._baseTable.columns.count).toBe(3);
            });
            it("- 자동 커멘드, 테이블 생성 ", () => {
                var bm = new SubBaseBindModel()
                bm.setMapping({
                    aa: { read: ['valid'] },
                    bb: { update: ['bind'] },
                    'second.cc': { read: ['output'] },
                    dd: undefined
                })

                expect(bm.items.count).toBe(0);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['first'].columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(1);
                expect(bm.cmd.read.valid.cols.aa).toBeDefined()
                expect(bm.cmd.update.bind.cols.bb).toBeDefined()
                expect(bm.cmd.read.output.cols.cc).toBeDefined()
            });
            it("- 자동 전체 커멘드", () => {
                var bm = new SubBaseBindModel()
                bm.setMapping({
                    aa: { $all: ['valid'] },
                    bb: { update: ['bind'] },
                    cc: { read: ['$all'] },
                    dd: undefined
                })

                expect(bm.items.count).toBe(0);
                expect(bm._baseTable.columns.count).toBe(3);
                // aa
                expect(bm.cmd.read.valid.cols.aa).toBeDefined()
                expect(bm.cmd.update.valid.cols.aa).toBeDefined()
                // bb
                expect(bm.cmd.update.bind.cols.bb).toBeDefined()
                // cc
                expect(bm.cmd.read.valid.cols.cc).toBeDefined()
                expect(bm.cmd.read.bind.cols.cc).toBeDefined()
                expect(bm.cmd.read.output.cols.cc).toBeDefined()
                expect(bm.cmd.read.misc.cols.cc).toBeDefined()
            });
            it("- 컬럼으로 매핑", () => {
                var bm = new SubBaseBindModel()
                bm.addCommand('read')
                bm.columns.add('aa', '')
                bm.columns.add('bb', '')
                bm.columns.add('cc', '')
                bm.columns.add('dd', '')
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    cc: { $all: ['output'] },
                    dd: undefined,
                })

                expect(bm._baseTable.columns.count).toBe(4);
                expect(bm.cmd.read.valid.columns.count).toBe(1);
                expect(bm.cmd.read.bind.columns.count).toBe(1);
                expect(bm.cmd.read.output.columns.count).toBe(1);

            });
            it("- second 엔티티 설정 ", () => {
                var bm = new SubBaseBindModel()
                bm.addTable('second')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    cc: { $all: ['output'] },
                }, 'second')

                expect(bm.items.count).toBe(4);
                expect(bm.second.columns.count).toBe(3);
                expect(bm.first.columns.count).toBe(0);
            });
            it("- 확인 : command 추가", () => {
                var bm = new SubBaseBindModel()
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    cc: { $all: [] },
                })

                expect(bm.items.count).toBe(4);
                // command 확인
                expect(bm.command.read.valid.columns.exists('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exists('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exists('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exists('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exists('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)
            });
            it("- 두번째 테이블에 추가 ", () => {
                var bm = new SubBaseBindModel()
                bm.addTable('second')
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { $all: ['valid'] },
                    bb: { $all: ['bind'] },
                    'second.cc': { $all: [] },
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(1);
                // command 확인
                expect(bm.command.read.valid.columns.exists('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exists('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exists('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exists('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exists('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)                

            });
            it("- 두번째 테이블에 추가 : command 추가", () => {
                var bm = new SubBaseBindModel()
                bm.addTable('second')
                bm.addCommand('read')
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                bm.items.add('cc', '')
                bm.items.add('dd', '')
                bm.setMapping({
                    aa: { $ALL: ['valid'] },
                    bb: { $All: ['bind'] },
                    'second.cc': { $all: [] },
                })

                expect(bm.items.count).toBe(4);
                expect(bm._baseTable.columns.count).toBe(2);
                expect(bm._tables['second'].columns.count).toBe(1);
                // command 확인
                expect(bm.command.read.valid.columns.exists('aa')).toBe(true)
                expect(bm.command.read.valid.columns.exists('cc')).toBe(true)
                expect(bm.command.read.valid.columns.count).toBe(2)
                expect(bm.command.read.bind.columns.exists('bb')).toBe(true)
                expect(bm.command.read.bind.columns.exists('cc')).toBe(true)
                expect(bm.command.read.bind.columns.count).toBe(2)
                expect(bm.command.read.output.columns.exists('cc')).toBe(true)
                expect(bm.command.read.output.columns.count).toBe(1)  
            });
            it("- 두번째 테이블에 추가, 뷰 매핑 안함 EXAM: ", () => {
                var bm = new SubBaseBindModel()
                bm.addTable('second')
                bm.items.add('aa', 10)
                bm.items.add('bb', 20)
                bm.items.add('cc', 30)
                bm.setMapping({
                    'aa': {},
                    'first.bb': {},
                    'second.bb': {},
                    'second.cc': {},
                });

                expect(bm.items.count).toBe(3)
                expect(bm.first.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bm.first.columns['aa'].value).toBe(10)
                expect(bm.first.columns['bb'].value).toBe(20)
                expect(bm.second.columns['bb'].value).toBe(20)
                expect(bm.second.columns['cc'].value).toBe(30)
            });
            it("- EXAM: $all, $all ", () => {
                const bm = new SubBaseBindModel();

                bm.addTable('second');

                bm.addCommand('read1');
                bm.addCommand('read2');

                bm.setMapping({
                    aa: { $all: 'valid' },
                    bb: { $all: 'bind' },
                    'second.cc': { $all: '$all' }
                });

                expect(bm.first.columns.count).toBe(2)
                expect(bm.second.columns.count).toBe(1)
                
                expect(bm.cmd.read1.valid.columns.count).toBe(2)
                expect(bm.cmd.read1.valid.columns.count).toBe(2)

                expect(bm.first.columns['aa']).toBeDefined()
                expect(bm.first.columns['bb']).toBeDefined()
                expect(bm.second.columns['cc']).toBeDefined()
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();
                bm.items.add('aa', '')
                bm.items.add('bb', '')
                
                expect(()=>bm.setMapping(10)).toThrow('object')
                expect(()=>bm.setMapping({aa: {Array: []}}, 10)).toThrow('EL061235')
                // expect(()=>bm.setMapping({cc: {Array: []}})).toThrow('EL061236')
                expect(()=>bm.setMapping(null)).toThrow('object')
            });
        });
        describe("BaseBindModel.addCommand() ", () => {
            beforeEach(() => {
                SubBaseBindModel = class SubBaseBindModel extends BaseBindModel {
                    constructor() {
                        super();
                    }
                }
            });
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                expect(()=>bm.addCommand()).toThrow('inherited')
            });
        });
        describe("BaseBindModel.setService() ", () => {
            it("- 확인 ", () => {
                var bm = new SubBaseBindModel();
                var svc = {
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
                        aa: {$all: []},
                        bb: {$all: []},
                        cc: {$all: []},
                    },
                    preRegister: ()=> 'preRegister',
                    preCheck: ()=> 'preCheck',
                    preReady: ()=> 'preReady',
                    cbFail: ()=> 'cbFail',
                    cbError: ()=> 'cbError',
                    cbBaseBegin: ()=> 'cbBaseBegin',
                    cbBaseValid: ()=> 'cbBaseValid',
                    cbBaseBind: ()=> 'cbBaseBind',
                    cbBaseResult: ()=> 'cbBaseResult',
                    cbBaseOutput: ()=> 'cbBaseOutput',
                    cbBaseEnd: ()=> 'cbBaseEnd',
                    onExecute: ()=> 'onExecute',
                    onExecuted: ()=> 'onExecuted',
                }   
                bm.setService(svc)

                expect(bm._tables.count).toBe(1)
                expect(bm.columns.count).toBe(3)
                expect(bm.fn.count).toBe(1)
                expect(bm.fn['fn1']()).toBe('fn1')
                expect(bm.preRegister()).toBe('preRegister')
                expect(bm.preCheck()).toBe('preCheck')
                expect(bm.preReady()).toBe('preReady')
                expect(bm.cbFail()).toBe('cbFail')
                expect(bm.cbError()).toBe('cbError')
                expect(bm.cbBaseBegin()).toBe('cbBaseBegin')
                expect(bm.cbBaseValid()).toBe('cbBaseValid')
                expect(bm.cbBaseBind()).toBe('cbBaseBind')
                expect(bm.cbBaseResult()).toBe('cbBaseResult')
                expect(bm.cbBaseOutput()).toBe('cbBaseOutput')
                expect(bm.cbBaseEnd()).toBe('cbBaseEnd')
                expect(bm.$event._list.length).toBe(2)
            });
            it("- undefined command, items, fn, mapping ", () => {
                var bm = new SubBaseBindModel();
                var svc = {
                    command : {etc: undefined},
                    items: {
                        aa: 'AA',
                        bb: undefined,
                    },
                    mapping: {
                        aa: undefined,
                    },
                    fn: {
                        fn1: undefined
                    },
                }   
                bm.setService(svc)

                expect(bm.command.count).toBe(0)
                expect(bm.items.count).toBe(1)
                expect(bm.fn.count).toBe(0)
                expect(bm.columns.count).toBe(0)
            });
            it("- 확인 : second 테이블, ", () => {
                var bm = new SubBaseBindModel();
                var svc = {
                    tables: 'second',
                    command : {'read': {}},
                    items: {
                        aa: '',
                        bb: 10,
                        cc: {},
                        dd: null
                    },
                    mapping: {
                        aa: {$all: []},
                        'second.bb': {$all: []},
                        'second.cc': {$all: []},
                    },
                }   
                bm.setService(svc)

                expect(bm._tables.count).toBe(2)
                expect(bm.second.columns.count).toBe(2)
                expect(bm.command.count).toBe(1)
                expect(bm.columns.count).toBe(1)
                expect(bm._tables['second'].columns.count).toBe(2)
            });
            it("- 확인 : second, three 테이블", () => {
                var bm = new SubBaseBindModel();
                var svc = {
                    tables: ['second', 'three'],
                    command : {'read': {}},
                    items: {
                        aa: '',
                        bb: 10,
                        cc: {},
                        dd: null
                    },
                    mapping: {
                        aa: {$all: []},
                        'second.bb': {$all: []},
                        'three.cc': {$all: []},
                    },
                }   
                bm.setService(svc)

                expect(bm._tables.count).toBe(3)
                expect(bm.columns.count).toBe(1)
                expect(bm._tables['second'].columns.count).toBe(1)
                expect(bm._tables['three'].columns.count).toBe(1)
            });
            it("- command 설정", () => {
                var bm = new SubBaseBindModel();
                var svc = {
                    command : {
                        read: {
                            outputOption: 1,
                            config: {index: 2},
                            url: 'a',
                            views: ['newView'],
                            cbBegin: (aa)=>true,
                            cbValid: (aa)=>true,
                            cbBind: (aa)=>true,
                            cbResult: (aa)=>true,
                            cbOutput: (aa)=>true,
                            cbEnd: (aa)=>true,
                            onExecute: (aa)=>true,
                            onExecuted: (aa)=>true,
                        }
                    }
                }   
                bm.setService(svc)
                var r1 = bm.cmd.read;
                var r2 = svc.command.read;

                expect(r1.outputOption.option).toBe(r2.outputOption)
                expect(r1.config).toBe(r2.config)
                expect(r1.url).toBe(r2.url)
                expect(r1['newView']).toBeDefined()
                expect(r1.cbBegin === r2.cbBegin ).toBe(T)
                expect(r1.cbValid === r2.cbValid ).toBe(T)
                expect(r1.cbBind === r2.cbBind ).toBe(T)
                expect(r1.cbResult === r2.cbResult ).toBe(T)
                expect(r1.cbOutput === r2.cbOutput ).toBe(T)
                expect(r1.cbEnd === r2.cbEnd ).toBe(T)
                expect(r1.$event._list.length).toBe(2)
            });
            it("- 예외 ", () => {
                var bm = new SubBaseBindModel();

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
                expect(()=>bm.setService({cbBaseBegin: {} })     ).toThrow('cbBaseBegin')
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
                    var bm = new SubBaseBindModel();
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
                    // BaseBindModel
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
                    var bm = new SubBaseBindModel();
                    expect(bm._baseTable instanceof MetaTable).toBe(true)
                });
            });
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    expect(bm._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    expect(bm._type === SubBaseBindModel).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var b2 = new SubBaseBindModel();
                    var b3 = new SubBaseBindModel();
                    var t1 = new MetaTable('t1');
                    b3.cbBaseBind = ()=>true;
    
                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.equal(b3)).toBe(false)
                    expect(bm.equal(t1)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    expect(bm.getTypes()).toEqual([SubBaseBindModel, BaseBindModel, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.instanceOf() : 비교 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
    
                    expect(bm.instanceOf('SubBaseBindModel')).toBe(true)
                    expect(bm.instanceOf('BaseBindModel')).toBe(true)
                    expect(bm.instanceOf('BaseBind')).toBe(true)
                    expect(bm.instanceOf('MetaObject')).toBe(true)
                    expect(bm.instanceOf('Object')).toBe(true)
                    expect(bm.instanceOf('MetaTable')).toBe(false)
                    expect(bm.instanceOf(SubBaseBindModel)).toBe(true)
                    expect(bm.instanceOf(BaseBindModel)).toBe(true)
                    expect(bm.instanceOf(BaseBind)).toBe(true)
                    expect(bm.instanceOf(MetaObject)).toBe(true)
                    expect(bm.instanceOf(Object)).toBe(true)
                    expect(bm.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel();
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.SubBaseBindModel")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new SubBaseBindModel();
                    bm._baseTable = t1
                    var obj1  = bm.getObject()

                    expect(obj1._type).toBe("Meta.Bind.SubBaseBindModel")
                    expect(typeof obj1._guid).toBe('string')
                    expect(typeof obj1._baseTable.$ref).toBe('undefined')
                    expect(obj1._guid.length > 0).toBe(true)
                });
                it("- 소유자가 있는 경우 ", () => {
                    class BaseBindModelOnwer extends MetaObject {
                        bm = new SubBaseBindModel();
                        constructor(){super()}
                        getObject(p_vOpt, p_owned) {
                            var obj = MetaObject.prototype.getObject.call(this, p_vOpt, p_owned);
                            var vOpt = p_vOpt || 0;
                            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
                            obj['bm']      = this.bm.getObject(vOpt, owned);
                            return obj;
                        }
                    }
                    var bmo = new BaseBindModelOnwer();
                    var obj1  = bmo.getObject()

                    expect(obj1._type).toBe("Meta.BaseBindModelOnwer")
                    expect(typeof obj1._guid).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                    expect(obj1.bm._type).toBe("Meta.Bind.SubBaseBindModel")
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var bm = new SubBaseBindModel()
                    bm.columns.addValue('aa', 'AA')
                    // bm._baseTable = t1;
                    var obj1  = bm.getObject()
                    var b2 = new SubBaseBindModel();
                    b2.setObject(obj1);

                    expect(bm.equal(b2)).toBe(true)
                    expect(bm.columns.aa.value).toBe('AA')
                    expect(b2.columns.aa.value).toBe('AA')
                });
                it("- 소유자가 있는 경우 ", () => {
                    class BaseBindModelOnwer extends MetaObject {
                        bm = new SubBaseBindModel();
                        constructor(){super()}
                        getObject(p_vOpt, p_owned) {
                            var obj = MetaObject.prototype.getObject.call(this, p_vOpt, p_owned);
                            var vOpt = p_vOpt || 0;
                            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
                            obj['bm']      = this.bm.getObject(vOpt, owned);
                            return obj;
                        }
                        setObject(p_oGuid, p_origin) {
                            MetaObject.prototype.setObject.call(this, p_oGuid, p_origin);
                            var origin = p_origin ? p_origin : p_oGuid;
                            this.bm.setObject(p_oGuid['bm'], origin);
                        }
                    }
                    var bmo = new BaseBindModelOnwer();
                    bmo.bm._baseTable = new MetaTable('t1')
                    bmo.bm._columnType = HTMLColumn;
                    bmo.bm.fn.add('fn1', ()=>true)
                    bmo.bm.command.add('read', {})
                    bmo.bm.cbFail = (aa)=>true
                    bmo.bm.cbError = (aa)=>true
                    bmo.bm.cbBaseBegin = (aa)=>true
                    bmo.bm.cbBaseValid = (aa)=>true
                    bmo.bm.cbBaseBind = (aa)=>true
                    bmo.bm.cbBaseResult = (aa)=>true
                    bmo.bm.cbBaseOutput = (aa)=>true
                    bmo.bm.cbBaseEnd = (aa)=>true
                    bmo.bm.preRegister = (aa)=>true
                    bmo.bm.preCheck = (aa)=>true
                    bmo.bm.preReady = (aa)=>true
                    var obj  = bmo.getObject()
                    var bm2 = new BaseBindModelOnwer();
                    bm2.setObject(obj);

                    expect(bmo.equal(bm2)).toBe(true)
                });
                it("- 예외 ", () => {
                    var bm = new SubBaseBindModel()
                    bm.columns.addValue('aa', 'AA')
                    // bm._baseTable = t1;
                    var obj1  = bm.getObject()
                    var b2 = new SubBaseBindModel();
                    obj1._baseTable.$ref = null;     // 강제 오류

                    expect(()=> b2.setObject(obj1)).toThrow('_baseTable')
                });
                it("- _baseTable 외부 등록 ", () => {
                    var t1 = new MetaTable('t1')
                    var bm = new SubBaseBindModel()
                    bm._baseTable = t1;
                    bm.columns.addValue('aa', 'AA')
                    var obj1  = bm.getObject()
                    var b2 = new SubBaseBindModel();
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
                });
                it("- 예외 : _baseTable 강제삭제  ", () => {
                    var bm = new SubBaseBindModel()
                    var obj1  = bm.getObject()
                    var obj2  = bm.getObject()
                    var b2 = new SubBaseBindModel();
                    obj1['_baseTable']['$ref'] = 'ERR'  // 객체 강제 삭제
                    obj2['_baseTable']['$ref'] = ''     // 객체 강제 삭제

                    expect(()=> b2.setObject(obj1)).toThrow('$set')
                    expect(()=> b2.setObject(obj2)).toThrow('EL061223')
                });
            });
        });
    });
});
