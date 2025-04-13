/// <reference path="T.d.ts" />

export type { ExtendError }                 from 'logic-entity/ko';
export type { Type }                        from 'logic-entity/ko';
export type { Util }                        from 'logic-entity/ko';
export type { EventEmitter }                from 'logic-entity/ko';
export type { IObject }                     from 'logic-entity/ko';
export type { IMarshal }                    from 'logic-entity/ko';
export type { ICollection }                 from 'logic-entity/ko';
export type { IPropertyCollection }         from 'logic-entity/ko';
export type { IElement }                    from 'logic-entity/ko';
export type { IList }                       from 'logic-entity/ko';
export type { IListControl }                from 'logic-entity/ko';
export type { ISerialize }                  from 'logic-entity/ko';
export type { IArrayCollection }            from 'logic-entity/ko';
export type { NamespaceManager }            from 'logic-entity/ko';
export type { MetaRegistry }                from 'logic-entity/ko';
export type { MetaObject }                  from 'logic-entity/ko';
export type { MetaElement }                 from 'logic-entity/ko';
export type { BaseCollection }              from 'logic-entity/ko';
export type { ArrayCollection }             from 'logic-entity/ko';
export type { PropertyCollection }          from 'logic-entity/ko';
export type { Message }                     from 'logic-entity/ko';
export type { BaseColumn }                  from 'logic-entity/ko';
export type { BaseEntity }                  from 'logic-entity/ko';
export type { BaseColumnCollection }        from 'logic-entity/ko';
export type { TransactionCollection }       from 'logic-entity/ko';
export type { IExportControl }              from 'logic-entity/ko';
export type { IGroupControl }               from 'logic-entity/ko';
export type { IImportControl }              from 'logic-entity/ko';
export type { ISchemaControl }              from 'logic-entity/ko';
export type { ITransaction }                from 'logic-entity/ko';
export type { MetaColumn }                  from 'logic-entity/ko';
export type { MetaRow }                     from 'logic-entity/ko';
export type { MetaRowCollection }           from 'logic-entity/ko';
export type { MetaSet }                     from 'logic-entity/ko';
export type { MetaTable }                   from 'logic-entity/ko';
export type { MetaTableCollection }         from 'logic-entity/ko';
export type { MetaView }                    from 'logic-entity/ko';
export type { MetaViewCollection }          from 'logic-entity/ko';
export type { MetaTableColumnCollection }   from 'logic-entity/ko';
export type { MetaViewColumnCollection }    from 'logic-entity/ko';
export type { ObjectColumn }                from 'logic-entity/ko';
export type { TransactionQueue }            from 'logic-entity/ko';

// local modules
import './util.d.ts';

export type { BaseBind }                    from './base-bind.d.ts';
export type { BindCommand }                 from './bind-command.d.ts';
export type { BaseBindCommand }             from './base-bind-command.d.ts';
export type { BaseBindModel }               from './base-bind-model.d.ts';
export type { HTMLColumn }                  from './html-column.d.ts';
export type { IModelCallback }              from './i-model-callback.d.ts';
export type { ICommandCallback }            from './i-command-callback.d.ts';
export type { IBindCommand }                from './i-bind-command.d.ts';
export type { IBaseBindModel }              from './i-bind-model.d.ts';
export type { IBind }                       from './i-bind.d.ts';
export type { IServiceAjax }                from './i-service-ajax.d.ts';
export type { IService }                    from './i-service.d.ts';

import type { BindModel }                   from './bind-model.d.ts';
export type { BindModel };
export default BindModel;