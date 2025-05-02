//==============================================================
// gobal defined
// import { PropertyCollection, ArrayCollection } from '../index.js';

// import { PropertyCollection } from '../src/collection-property.js';
// import { ArrayCollection } from '../src/collection-array.js';
// import { PropertyCollection } from 'logic-core/ko';
import { ArrayCollection } from 'logic-entity/ko';
import { MetaTable, BindModel } from 'logic-bind-model/ko';
import { MetaView } from 'logic-bind-model';
import { jest } from '@jest/globals';

//==============================================================
/**
 * 'logic-core'
 * 'dist/logic-core.esm.js'
 */
describe("index", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        // globalThis.isESM = true
    });
    describe("logic-core 모듈", () => {
        it("- 기본", async () => {
            // const p = new PropertyCollection();
            const a = new ArrayCollection();
            const b = new MetaTable('t1')
            const c = new MetaView('v1')
            // const b = new ArrayCollection();
            a.add('a', 'aa');
            
            b.cols.add('aa');
            b.cols['aa'].caption;
            b.cols[0].$value;
            b.columns.aa.alias;
            
            c.columns.add('aa');
            c.columns['aa']._name;

            // expect(typeof PropertyCollection === 'function').toBe(true);
            expect(typeof ArrayCollection === 'function').toBe(true);
        });
        it("- 기본 : BindModel", async () => {
            const bm = new BindModel();
            bm.addColumn('aa');
            bm.addCommand('cmd1', 'VIEW')
            bm.cmd.cmd1.addColumn('bb')
            bm.cmd.cmd1._type;
            bm.cbBaseBegin
            // bm.cbFail = (a=1, b)=>true

            expect(bm.cols.count).toBe(2);
        });
    });
});
