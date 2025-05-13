// import {MetaObject} from 'logic-bind-model'
// import {BindModel} from 'logic-bind-model/ko'

import { MetaTable } from "logic-bind-model/ko"
console.log('MetaTable', MetaTable);


// import {Util} from 'logic-entity'
import {Util} from 'logic-bind-model/ko'
import {BindModel, Util} from 'logic-bind-model/ko'

Util.validSelector()


var bm = new BindModel();
bm.addColumnValue('c1',  10)
bm.preRegister
bm.command

bm.cols.count

bm.addTable('t1')

bm['t1'].clone()
bm[0].clone()
// bm[0]


// bm.addCommand('cmd2',

// bm.cmd.cmd1.
bm.command['cmd1']._guid
bm.command['cmd1'].newOutput('abc')
bm.command['cmd1']['abc'].clone()
bm.command['cmd1'].output.clone()
// bm.command['cmd1'].outputOption = 'aaa';
bm.columns['c1'].clone()
bm.cols['c1'].clone()
bm.cols.c1.addConstraint(() => {
    return true
});
// bm.addCommand('cmd2',


Util.implements()
// Util.validSelector()
// var i1 = new MetaObject('a')
// var i2 = new BindModel('a')

// i1.getObject()
// i2.getObject()