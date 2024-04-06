/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
const {BindModelAjax}                      = require('../src/bind-model-ajax');
const {HTMLColumn}                      = require('../src/html-column');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
const { MetaRegistry }            = require('logic-entity');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("생성 방법", () => {
    describe("new BindModelAjax()", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });

        describe("1. 아이템 추가 후 매핑", () => {
            it("- A ", () => {
                var bm1 = new BindModelAjax()
                bm1.addCommand('read', 3)
                bm1.items.add('aa', '')
                bm1.items.add('bb', '')
                bm1.items.add('cc', '')
                bm1.items.add('dd', '')
                bm1.setMapping({
                    aa: { read: ['valid'] },
                    bb: { read: ['bind'] },
                    cc: { read: ['output'] },
                    dd: { read: [] },
                })
                
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
        describe("2. 컬럼 추가 시 커멘드 등록", () => {
            it("- A ", () => {
                var bm1 = new BindModelAjax()
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '', 'read', 'valid')
                bm1.addColumnValue('bb', '', ['read'], 'bind')
                bm1.addColumnValue('cc', '', [], 'output')
                bm1.addColumnValue('dd', '', [])
                
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
        describe("3. 테이블에 컬럼 추가 후 커멘드 설정", () => {
            it("- A ", () => {
                var bm1 = new BindModelAjax()
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '')
                bm1.columns.addValue('bb', '')
                bm1.columns.add('cc', '')
                bm1._baseTable.columns.addValue('dd', '')
                bm1.command.read.setColumn('aa', 'valid')
                bm1.command.read.setColumn('bb', ['bind'])
                bm1.command.read.setColumn('cc', ['output'])
                bm1.command.read.setColumn('dd')

                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
        describe("4. 커맨드에 컬럼 객체 직접 추가 :  단일 설정에 적합함", () => {
            it("- A ", () => {
                var bm1 = new BindModelAjax()
                bm1.addCommand('read', 3)
                bm1.command.read.addColumnValue('aa', '', 'valid')
                bm1.command.read.addColumnValue('bb', '', ['bind'])
                bm1.command.read.addColumn(new HTMLColumn('cc'), ['output'])
                bm1.command.read.addColumn(new HTMLColumn('dd'))

                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
    });
});
