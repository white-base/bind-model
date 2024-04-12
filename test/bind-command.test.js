/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';

const { MetaRegistry }          = require('logic-entity');
const { BindModel }             = require('../src/bind-model');
const { BindCommand }             = require('../src/bind-command');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;
var SubBindModel;

//==============================================================
// test
describe("[target: base-column.js]", () => {
    describe("BaseColumn :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBindModel = class SubBindModel extends BindModel {
                constructor() {
                    super();
                }
                addColumn(p_name, p_option, p_bEntity) {    // 테스트용 임시
                    var bindCommand = new BindCommand(this, p_option, p_bEntity);
                    this.addCommand.add(p_name, bindCommand);
                }
            }
        });

        describe("MetaObject._valueTypes: <value 타입 설정>", () => {
            it("- 설정 및 조회 ", () => {
            });
        });
    });
});
