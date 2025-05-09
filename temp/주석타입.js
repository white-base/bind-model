import BindModel from "logic-bind-model/ko"

const bm = new BindModel();

bm.addSelector('aa', '#u_id')

// bm.addSel()

bm.cmd['cmd1'].exec('ALL', '/test/abc')

console.log(0);
