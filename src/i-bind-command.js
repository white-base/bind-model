/**** i-bind-command.js | _L.Interface.IBindCommand ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('./message-wrap').Message;    // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
    }                                                                           // strip:
    var $Message                    = _global._L.Message;           // modify:
    var $ExtendError                = _global._L.ExtendError;       // modify:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));

    //==============================================================
    // 3. module implementation   
    var IBindCommand  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBindCommand
         * @interface
         */
        function IBindCommand() {

            /**
             * 유효성 뷰
             * @member {MetaView} _L.Interface.IBindCommand#valid
             */
            this.valid = {};

            /**
             * 바인드 뷰
             * @member {MetaView} _L.Interface.IBindCommand#bind
             */
            this.bind = {};

            /**
             * 출력 뷰
             * @member {MetaView} _L.Interface.IBindCommand#output
             */
            this.output = {};

            /**
             * 출력 옵션
             * @member {object} _L.Interface.IBindCommand#outputOption
             */
            this.outputOption = {option: Number, index: [[ [Number], Number ]]};
        }
    
        IBindCommand._NS = 'Interface';    // namespace
        IBindCommand._KIND = 'interface';

        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IBindCommand.prototype.execute  = function() {
            throw new ExtendError(/EL02331/, null, ['IBindCommand']);
        };

        return IBindCommand;
        
    }());

    //==============================================================
    // 4. module export
    if (isNode) exports.IBindCommand    = IBindCommand;        // strip:

    // create namespace
    _global._L.Interface                = _global._L.Interface || {};    

    _global._L.IBindCommand = IBindCommand;
    _global._L.Interface.IBindCommand = IBindCommand;

}(typeof window !== 'undefined' ? window : global));