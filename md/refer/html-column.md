---
lang: en
title: "HTMLColum Class"
layout: single
permalink: /docs/api-html-column/
date: 2024-08-14T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
HTML Column is the key to binding
If you directly control the internal implementation method without using a special indicator, you can apply it to various conditions when you get used to it.
It is advantageous for debugging and application during development, and developer tools alone are sufficient.

We focused on recycling and minimizing duplication of code while maintaining a classic coding method.

# the main structure

## an inheritance relationship

Class diagram
![image-center](/assets/images/col-diagram-2024-08-16-002347.png){: .align-center}


# a key element

## Properties

| Item | Description |
| ----------- | ------------------------------------------------------------------- |
| DomType | Defines the item DOM type
| isReadOnly | Indicates whether read-only |
| isHide | Indicates whether it is hidden or not
| element | represents the DOM element |
| Selector | Defines a selector
| getFilter | Function to filter value |
| setFilter | Function to filter value |
| value | Sets or imports the value of the item
| Required | Sets whether the column value is required: 'true' if the value must exist, or 'false' if not
| Constraints | Set the constraints for the column. Constraints can be set in the form of objects or functions. |
| getter | getter function of column value |
| setter | setter function of column value |
| columnName | Indicates the name of the column. Same as '_name' |
| Alias | Sets or imports aliases for columns. Alias are used to transfer data and set low values
| default | Set the default value for the column |
| Caption | Provides a description of the column
| _valueTypes | Defines the value type for the column. This property is used to set the value type for the column. |
| _entity | Indicates the entity to which this column belongs. It is an object of type 'BaseEntity' |
| _guid | Unique identifier of the object (GUID). Uniquely identifies the object. |
| _type | The generator function of the object. The function used when the object was created. |
|             |                                                                     |


## Method

| Item | Description |
| ------------------------------------------ | --------------------------------------------------------------- |
| clone(entity) | Replicates the DOM of the current item |
| addConstraint (regex, msg, code, condition) | Add constraints
| Valid(value) | Checks that the value of the property is valid. Validates based on 'required' and 'constructions' |
| getObject(vOpt, up) | Gets the current object as a serialized object. The cyclic reference is replaced by the value '$ref' |
| setObject(oGuid, origin) | Sets serialized object to current object. <br>The object is initialized. |
| equal(target) | Compare the current object with the specified object. |
| getTypes() | Returns the constructors of the current object and all the constructors of the prototype chain to the array. |
| instanceOf(target) | Verify that the current object is an instance of the specified type (with _UNION) |
|                                            |                                                                 |



## Events

| Item | Location | Description |
| --------- | ---------- | ------------------------ |
| OnChanged | MetaColumn | An event that occurs when the column value changes
|           |            |                          |




# Detailed description

## Key Properties

### domType

> Define the item DOM type.

```ts
type domType = object;
```

### isReadOnly

> Indicates whether it is read-only.

```ts
type isReadOnly = boolean;
```

### isHide

> Indicates whether it is hidden or not.

```ts
type isHide = boolean;
```

### element

> Indicates the DOM element.

```ts
type element = HTMLElement;
```

### selector

> Define the selector.
> type
> - 'value' or 'value': Value property value of element
> - 'text': Text value of element
> - 'html': HTML value of element
> - 'css. quick name': property value of CSS (object)
> - 'prop. fast name': Attribute name value of element (based on initial state)
> - 'Attr. fast name': Attribute name value of element (current state)
> - 'none': No action, purpose of expression
> 예시: 'value', 'text', 'css.color', 'prop.disabled'

```ts
type selector = { key: string, type: string };
```

### getFilter

> This function filters the value.

```ts
type getFilter = (sVal: any) => any;
```
- sVal : This is the value obtained from selector when selector exists.
- return —Filtered value.

### setFilter

> This function filters the value.

```ts
type setFilter = (val: any) => any | undefined;
```
- val : The value to be applied as a filter.
- return : If there is a filtering result value, set the selector value.
	- Do not set selector values on undefined returns. 
### value

> Sets or imports the value of the item.

```ts
type value = string | number | boolean;
```

### required

> Sets whether column values are required.
> If the value must exist, it is 'true', otherwise it is 'false'.

```ts
type required = boolean;
```

### constraints

> Set the constraints for the column.
> Constraints can be set in the form of objects or functions.

```ts
type constraints = (object | Function)[];
```

### getter

> Getter function of column value.

```ts
type getter = () => string | number | boolean;
```
- return : The current value of the column.

### setter

> Setter function of column value.

```ts
type setter = (value: string | number | boolean) => void;
```
- value : This is the value to set.

### columnName

> Indicates the name of the column. Same as '_name'.

```ts
type columnName = string;
```

### alias

Set or import aliases for > columns, which are used to transfer data and set low values.
> Where to use (default = columnName)\
> - Bind-command-ajax.\_execBind(): When transferring data
> - BaseBind.setValue(row): When setting a low value to an entity
> - getValue(): Used for row


```ts
type alias = string;
```

### default

> Set the default value for the column.

```ts
type default = string | number | boolean;
```

### caption

> Provides a description of the column.

```ts
type caption = string;
```

### \_valueTypes

> Defines the value type for the column, which is used to set the value type for the column.

```ts
type _valueTypes = any;
```

### \_entity

> Indicates the entity to which this column belongs, an object of type 'BaseEntity'.

```ts
type _entity = BaseEntity;
```

### \_guid

> Unique identifier of the object (GUID). Uniquely identifies the object.

```ts
type _guid: string;
```
### \_type

> The generator function of the object, which was used when the object was created.

```ts
type _type = Function;
```


## Key Methods

### clone()

> Replicates the current column.

```ts
type clone = (entity: BaseEntity) => this;
```
- entity : The entity to be replicated.
- return : This is a replica of the current instance.

### addConstraint()

> Add constraints.

```ts
type addConstraint = (
	regex: RegExp, 
	msg: string, 
	code?: string, 
	condition?: boolean
) => void;
```
- regex : Regular expression to apply.
- msg —Message to display when regular expression fails.
- code : Code for failure of regular expression. (Optional)
- condition : A condition that determines whether a constraint is successful/failed. Default is 'false'.
### valid()

> Check that the value of the property is valid.
> Validates based on 'required' and 'constructions'.

```ts
type valid = (value: ValueType): object | undefined;
```
- value : The value to be inspected.
- return : Returns the object if invalid, and returns 'undefined' if valid.

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


## Key Events

### 

> An event that occurs when the column value changes.

```ts
type onChanged = (newVal: ValueType, oldVal: ValueType, _this: this) => void;
```
- newVal : New value.
- oldVal : This is the previous value.
- \_this : The object that caused the event.

```js
column.onChanged = function(newVal, oldVal, _this) {
	console.log('Value changed');
};
```



## Get the value of column

`우선순위` : 1. getter > 2. getFilter > 3. selector > 4. inner value > 5.default
Reply the selected value according to the priority of the property (getter, getFilter, selector) setting when obtaining the column value.
### getter internal structure

![image-center](/assets/images/col-get-diagram-2024-08-16-010300.png){: .align-center}


## setting value for column

`설정 순서` : 1. setter > 2. inner value > 3. setFilter > 4. selector
Set sequentially when setting the column value.

### setter internal structure
![image-center](/assets/images/col-set-diagram-2024-08-16-010359.png){: .align-center}

1. If setter exists, call the setter function.
2. Save the setter's return value to the inner value.
   If there is no return, save the input.
3. If setFilter is present, call the setFilter function.
4. If you have a selector, set the value according to the type. (Use jquery)
   type : `value`, `text`, `html`, `prop`, `attr`, `css` (jquey사용)
   (excluding type = 'none')
### frequency of use 

It analyzes the frequency of use when designing HTMLComun
- Minimize duplicate code
- It can be applied to various cases
- Intuitive code structure
It was designed with consideration.

The 'selector' is also a checkSelector() method used to determine the presence of an element for the html page.

| 빈도  | setter | setFilter | selector | getFilter | getter | 설명                                                                     |
| --- | ------ | --------- | -------- | --------- | ------ | ---------------------------------------------------------------------- |
| 89% || || 'Use' || - Direct DOM <br>- For single elements <br>- Tag p, text, select, css |
| 3% | 'Use' | | 'Use' | - When pointing to an external object <br>- Example> page_count |
| 3% | 'Use' | 'Use' | 'Use' | - When using DOM with external objects <br>- Example> page_size = page display line (select box) |
| 3% || 'Use' | 'none' | 'Use' | - When referring to a composite DOM object <br>- Selector is used for inspection only <br>- Example> radio |
| 1% | 'Use' | 'Use' | - Show <br>- Example> Amount (number + comma) when used in one direction |
| 1% | | | 'none' | 'use' | - <br>- Example> Code value conversion, list selection value |

<mark style="background: #FFF3A3A6;"> (shopping mall website, based on DB Table 36EA)</mark>
### Example Code
#### a. When using selector

Use to select the HTML element's property value as value.
The 'type' of the selector is html, text, value, prop.\*, attr.\*, and css.\*.
Selector can also be used for validation in addition to value lookup/setting.
Use the checkSelector() method of the BindModel object to validate the DOM.

```html
<div id="p-nm"><p style="color:red;">10</p></div>
<input id="p-title" type="text" value="AA" >
<input id="p-check" type="checkbox" checked />
<a href="#">google.com</a>
```

```js
var c1 = new HTMLColumn('c1');
var c2 = new HTMLColumn('c2');
var c3 = new HTMLColumn('c3');
var c4 = new HTMLColumn('c4');
var c5 = new HTMLColumn('c5');
var c6 = new HTMLColumn('c6');

c1.selector = { key: '#area-nm',  type: 'html' };
c2.selector = { key: '#area-nm',  type: 'text' };
c3.selector = { key: '#p-title',  type: 'value' };
c4.selector = { key: 'p-check',   type: 'prop.checked' };
c5.selector = { key: 'a',         type: 'attr.href' };
c6.selector = { key: 'p',         type: 'css.color' };

c1.value; // <p>10</p>
c2.value; // 10
c3.value; // "AA"
c4.value; // true
c5.value; // "google.com"
c6.value; // "red"
```

#### b. When using setter, getter

Use to use the external value as the value of the HTML Column. 
To use unidirectional external values read-only, specify only the getter function.

```js
var PAGE_SIZE = 10;
varc1 = new HTML Column ('c1'); // see external value

c1.getter = function(){ return PAGE_SIZE };
c1.setter = function(){ PAGE_SIZE = newVal };

c1.value; // 10
```
#### c. If the selector and setter/getter are used together

Use the external value as the value of the HTML Column, and specify when you need to express it in html.
Depending on where the original data is located, it can be configured in various ways.

```html
<select id="page-size">
    <option value="10">10EA</option>
    <option value="20">20EA</option>
    <option value="30">30EA</option>
</select>
```

```js
var PAGE_SIZE = 10;
var c1 = new HTMLColumn('c1');

c1.selector = { key: '#page-size',  type: 'value' };
c1.getter = function(){ return PAGE_SIZE };
c1.setter = function(newVal){ PAGE_SIZE = newVal };

c1.value; // 10
$("#page-size") .val("20"); // select change value
c2.value; // 20
PAGE_SIZE // 20
```

#### d. When using setFilter/getFilter

The difference from setter/getter is used when the html expression is different from the value used internally.
Mainly used to control multiple html elements.

```html
<input type="radio" name="gender" value="female" />
<input type="radio" name="gender" value="male" />
```

```js
var c1 = new HTMLColumn('c1');

c1.selector = { 
	key: 'input[name=gender][type=radio]',  type: 'value' 
};
c1.getFilter = function(){
	 return $('input[name=gender]:checked').val();
};
c1.setFilter = function(newVal){
	$('input[name=gender][value='+ newVal + ']').prop('checked', true);
};

c1.value; // ''
$("#gender").val("female"); // radio 값 변경
c2.value; // 'female'
```

## Set service objects

```js
var bm = new BindModel({
	// If using selector only
	area_page:     { selector: { key: '#area-page',   type: 'html' } },
	txt_sumCnt:    { selector: { key: '#sumCnt',      type: 'text' } },
	
	// If you used setter/getter
	page_count: { /* See page object outside */
		getter: ()=> page.page_count,
	    setter: (val)=> page.page_count = val;
	},
	
	// If selector & setter/getter is used
	page_size: {
	  selector: { key: 'select[name=m-page_size]',     type: 'value' },
	  getter: ()=>{ return page.page_size; },
	  setter: (val)=>{ page.page_size = val; }
	},
	
	// If you used selector['none'] & setFilter/getFilter
	active_yn: { 
		selector: { key: 'input[name=m-active_yn][type=radio]',  type: 'none' },
	    setFilter: (val)=>{ 
		    $('input[name=active_yn][value='+ val + ']').prop('checked', true);
		},
	    getFilter: (val)=>{ 
		    return $('input[name=active_yn]:checked').val();
		}
	  },
	
	// If selector & setfilter is used (for comma application), one-way
	point: {
    selector: { key: '#point_view',         type: 'text' },
    setFilter: function(val) { return numberWithCommas(val); }
    default: 0, // Set initial value
	},
	
	// When using selector & getFilter (when converting code values), one-way
	point: {
		selector: { key: '#codeValue',           type: 'value' },
	    getFilter: function(val) { return val == '' ? 'CODE1' : 'CODE2'; }
	},
});
```