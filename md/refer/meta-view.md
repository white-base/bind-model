---
lang: en
title: "MetaView Class"
layout: single
permalink: /docs/api-meta-view/
date: 2024-08-14T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

# the main structure

## Property Relationships

MetaView operates the same as MetaTable.  
The difference is that if *_baseEntity* is specified, if *add(name)* column is added, the 'column' registers a reference, 
'MetaColumn' is registered in 'column' of baseEntity.
*Add(name, collection?)* If you specify 'collection' when adding a column, the reference is registered in 'columns',
'MetaColumn' is registered in the specified 'collecton'.

Class diagram
![image-center](/assets/images/view-rel-diagram-2024-08-16-002546.png){: .align-center}

## an inheritance relationship

Class diagram
![image-center](/assets/images/view-diagram-2024-08-16-004628.png){: .align-center}

# a key element

## Properties

| Item | Description |
| ----------- | ------------------------------------ |
| viewName | This is the name of the meta view
| Columns | Collection of columns in the view
| rows | Data (low) collection of entities
| _baseEntity | Default entity
| _metaSet | Metaset to which the entity belongs. |
| _name | Name of the element, which acts as a unique identifier for the MetaElement
| _guid | Unique identifier of the object (GUID). Uniquely identifies the object. |
| _type | The generator function of the object. The function used when the object was created. |
|             |                                      |



## Method

| Item | Description |
| -------------------------------- | ---------------------------------------------------- |
| clone() | Create and return a deep copy of the current meta view |
| copy(filter, args) | Copy the destination column
| transformSchema() | Converts a given serialization object to a schema object
| Clear() | Initializes all data in the entity
| reset() | Initializes the entity's columns and data
| NewRow() | Returns a new row that matches the column structure
| getValue() | Returns the value of the column as a MetaRow type object |
| setValue(row) | Set the MetaRow value to the value of the column
| merge (target, optoin, matchType) | merge the given entity with the current entity |
| select(filter, args) | query the row according to the given callback function |
| load(obj, path) | Gets the given object into the current entity. Initializes the existing data and loads the new data
| output (vOpt, stringify, space) | Outputs the current entity as a serialized string
| read(obj, option) | Reads the given object as an entity. Follow JSON schema rules. |
| readSchema (obj, createRow) | Reads the given schema object as the current entity
| readData(obj) | Reads only rows that exist on a given object |
| write(vOpt) | Returns the current entity by converting it to an object of schema type |
| writeSchema(vOpt) | Returns the schema of the current entity by converting it to an object of schema type |
| writeData(vOpt) | Returns data from the current entity by converting it into schema-type objects.

# Detailed description

## Key Properties

### viewName

> This is the name of the meta view.

```ts
type viewName = string;
```

### columns

> Collection of columns in the view.

```ts
type columns = MetaTableColumnCollection;
```

### rows

> Data (low) collection of tables.

```ts
type rows = MetaRowCollection;
```

### \_baseEntity

> Default entity.

```ts
type _baseEntity = BaseEntity;
```

### \_metaSet

> This is the meta set to which the table belongs.

```ts
type _metaSet = MetaSet;
```

### \_guid

> Unique identifier of the object (GUID). Uniquely identifies the object.

```ts
type _guid: string;
```

### \_type

> The generator function of the object, which was used when the object was created.

```ts
type _type: Function;
```


## Key Methods

### clone()

> Create and return a deep copy of the current object.

```ts
type clone() => MetaTable;
```
- return : This is a replica of the current object.

### copy()

> Copy the target column.

```ts
type copy = (
	filter: (row, idx, entity) => boolean | string[], arguments<string>, 
	cols?: string[] | arguments<string>
) => MetaView;
```
- filter :   
	- Function type is the callback function that selects the column.
	-  Type string[] is the name of the column to copy.
-   cols : The name of the column to copy, valid only if the filter is a Function type.

Example: Using filter, cols
```js
var table = new MetaTable('t1');

// ... Add columns, aa, bb, cc, e, and rows
var temp = table.copy(
	(row, idx, entity) => { return (idx % 2) > 0; },
	['aa', 'bb']
);
```
- Temp is copied only if the row indexes of the columns 'aa' and 'bbb' are odd.

Example: Using cols only
```js
var table = new MetaTable('t1');

// ... Add columns, aa, bb, cc, e, and rows 

var temp = table.copy(
	['aa', 'bb']
);
```
- Temp copies the entire row of columns 'aa' and 'bbb'.

### transformSchema()

> Converts a given serialization object to a schema object.

```ts
type transformSchema = (oGuid: object) => object; // static
```
- oGuid : object obtained by getObject().

### clear()

> Initializes all data in the entity.

```ts
type clear = () => void;
```

### reset()

> Initializes the entity's columns and data.

```ts
type reset = () => void;
```

### newRow()

> Create and return a new row that matches the column structure.

```ts
type newRow = () => MetaRow;
```
- return : This is the MetaRow object created.
### getValue()

Returns the value of the > column as a MetaRow type object.

```ts
type getValue = () => MetaRow;
```
- return : MetaRow object with the value of the column set.

### setValue()

> Set the MetaRow value to the value in the column.

```ts
type setValue = (row: MetaRow) => void;
```
- row : MetaRow object to be set.

### merge()

> Merges the given entity with the current entity.

```ts
type merge = (target: BaseEntity, option: number, matchType?: boolean) => void;
```
- target : The target entity to merge.
- option : Merge option.
- matchType : Whether or not a row validation exists. (Default: false)

### select()

> Look up the row according to the given callback function.

```ts
type select = (
	filter: (row, idx, entity) => boolean | string[], | arguments<string>,
	cols?: string[] | arguments<string>
) => MetaView;
```
- filter :   
	- Function type is the callback function that selects the column.
	-  Type string[] is the name of the column to copy.
-   cols : The name of the column to copy, valid only if the filter is a Function type.

Example: Using filter, cols
```js
var table = new MetaTable('t1');

// ... Add columns, aa, bb, cc, e, and rows 

var temp = table.copy(
	(row, idx, entity) => { return (idx % 2) > 0; },
	['aa', 'bb']
);
```
- The temp view is copied only if the row indexes of the columns 'aa', 'bbb' are odd.

Example: Using cols only
```js
var table = new MetaTable('t1');

// ... Add columns, aa, bb, cc, e, and rows 

var temp = table.copy(
	['aa', 'bb']
);
```
- The temp view copies the entire row of columns 'aa' and 'bbb'.

### load()

> Imports the given object to the current entity, initializes the existing data and loads the new data.

```ts
type load = (obj: object | string, parse?: Function) => void;
```
- obj : The object to be called.
- pas : parser function. (Optional)

### output()

> Outputs the current entity as a serialized string.

```ts
type output = (vOpt: number, stringify?: Function, space?: string) => string;
```
- vOpt : Optional (0, 1, 2)
- stringify : This is a user-defined parser function. (Optional)
- space : A blank string to be used in the output. (Optional)

### read()

> Reads the given object as an entity. Follow JSON schema rules.

```ts
type read = (obj: object, option: number) => void;
```
- obj : object to be read.
- option : Read option (default: 3)

```js
var schema1 = { 
	table: { 
		columns: {}, 
		rows: {} 
	}
};

var schema1 = { 
	columns: {...}, 
	rows: {} 
};
```

### readSchema()

> Reads the given schema object as the current entity.

```ts
type readSchema = (obj: object, createRow?: boolean) => void;
```
- obj : Schema object to be read.
- createRow : If true, add the column by row[0] (default: false)

### readData()

> Reads only rows that exist on a given object.

```ts
type readData = (obj: object) => void;
```
- obj : The object to be read.

### write()

> Returns the current entity after converting it to an object of schema type.

```ts
type write = (vOpt?: number) => object;
```
- vOpt : Optional (default: 0)
- return : Object of schema type.

### writeSchema()

> Returns the schema of the current entity by converting it to an object of schema type.

```ts
type writeData = (vOpt?: number): object;
```
- vOpt : Optional (default: 0)
- return : Object of schema type.

### writeData()

> Returns the data of the current entity by converting it into an object of schema type.

```ts
type writeData = (vOpt?: number) => object;
```
- vOpt : Optional (default: 0)
- return : Object of schema type.

### getObject()

> Obtain the current object as a guide type object.
> (Circular references are replaced by $ref values.)

```ts
type getObject = (vOpt?: number, owned?: object | Array<object>) => object;
```
- vOpt : Import option; default is 0.
	- opt=0: Reference structure (_guid:Yes, $ref:Yes)
	* opt=1: Redundant structure (_guid:Yes, $ref:Yes)
	* opt=2 : Non-tidal structure (_guid: No, $ref: No)
- aged : The parent objects that currently own the object. The default is an empty object.
- return —Returns serialized objects.

```js
a.getObject(2) == b.getObject(2)
```

### setObject()

> Set the Guid type object to the current object.
> (The object will be reset.)

```ts
type setObject = (oGuid: object, origin?: object) => void;
```
- oGuid : Object of the guid type to serialize.
- origin : This is the original object that sets the current object. The default is oGuid.

### equal()

> Compare the current object with the specified object.

```ts
type equal (target: object) => boolean;
```
- return —Returns whether the two objects are identical.

### getTypes()

> Returns the creators of the current object and all the creators of the prototype chain to the array.

```ts
type getTypes = () => Array<Function>;
```
- return : Returns the array of generator functions.

```js
const types = obj.getTypes();
console.log(types); // [Function: MetaObject]
```

### instanceOf()

> Verify that the current object is an instance of the specified type (including _UNION)

```ts
type instanceOf = (target: object | string) => boolean;
```
- target : The type of object to be checked (object or string).
- return —Returns whether this is an instance of the specified type.


