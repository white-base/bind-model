---
lang: en
title: "PropertyCollection Class"
layout: single
permalink: /docs/api-property-collection/
date: 2024-08-14T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
# the main structure

## an inheritance relationship

Class diagram
![image-center](/assets/images/coll-diagram-2024-08-16-002653.png){: .align-center}

# a key element

## Properties

| Item | Description |
| ---------- | ---------------------------------- |
| count | Number of collection elements |
| _owner | is the owner of the collection. |
| _elemTypes | Type constraints for collection elements |
| _list | List of collection elements. |
| _guid | Unique identifier of the object (GUID). Uniquely identifies the object. |
| _type | The generator function of the object. The function used when the object was created. |
|            |                                    |





## Method

| Item ||
| ------------------------ | ---------------------------------------- |
| add(key, element, desc) | Add an element to the property collection
| Clear() | Initializes the property collection
| keyOf(idx) | Returns the key corresponding to the index of the property collection |
| Exist(key) | Verify that the specified key exists in the property collection
| remove(element) | Delete an element in the collection |
| removeAt(pos) | Deletes elements in the specified location from the collection
| contains(element) | Verify that the element exists in the collection
| indexOf (target, isKey) | Returns the index of the key or element specified in the property collection. |
| getObject(vOpt, up) | Returns properties collection objects as serialized objects |
| setObject(oGuid, origin) | Initializes property collection objects using serialized objects |
| equal(target) | Compare the current object with the specified object. |
| getTypes() | Returns the constructors of the current object and all the constructors of the prototype chain to the array. |
| instanceOf(target) | Verify that the current object is an instance of the specified type (with _UNION) |
|                          |                                          |



## Events

| Item | Description |
| ---------- | ----------------------------- |
| onAdd | Events that occur before adding collection elements |
| OnAdded | Events that occur after adding collection elements |
| onRemove | Events that occur before deleting collection elements |
| OnRemoved | Events that occur after the collection element is deleted |
| onClear | Events that occur before the collection is initialized
| OnCleared | Events that occur after the collection is initialized
| onChanging | Events that occur before changing collection elements |
| OnChanged | Events that occur after changing the collection element |
|            |                               |

# Detailed description

## Key Properties

### count

> Returns the number of elements in the current collection.

```ts
readonly type count = number;
```

### \_owner

> This is the object owned by the collection.

```ts
type _owner = object;
```

### \_elemTypes

> Define the type constraints for the collection element.

```ts
type _elemTypes = any[];
```

### \_list

> Array that stores the list of elements in the collection, which contains the actual data of the collection.

```ts
readonly type _list = any[];
```

### \_guid

> Unique identifier of the object (GUID). Uniquely identifies the object.

```ts
type _guid = string;
```

### \_type

> The generator function of the object, which was used when the object was created.

```ts
type _type = Function;
```


## Key Methods

### add()

> Add an element to the property collection.

```ts
type add = (key: string, elem: any, desc?: PropertyDescriptor) => number;
```
- key : The key of the key element.
- element : The element to be added.
- desc : Property descriptor object for element. Select value.
- return : Index of the added element.
### clear()

> Initialize the property collection.
> This method initializes the array '$elements', '$descriptors', and '$keys'.
> Events are not initialized.

```ts
type clear = () => void;
```

```js
myCollection.clear();
console.log(myCollection.count); // 0
```
### keyOf()

> Returns the key corresponding to the index of the property collection.

```ts
type keyOf = (idx: number) => string;
```
- idx : Index value to look up.
- return : The key corresponding to the index. If the index is out of range, it can return 'undefined'.

```js
const key = myCollection.keyOf(0);
console.log(key for index 0: ${key}');
```

### exist()

> Verify that the specified key exists in the property collection.

```ts
type exist = (key: string) => boolean;
```
- key - This is the key to check.
- return —Bulian value indicating the presence or absence of a key.

### remove()

> Delete an element in the collection.

```ts
type remove = (elem: any) => number;
```
- element : The element to be deleted.
- return : Index of the deleted element.

```js
const removedIndex = myCollection.remove(someElement);
console.log(`Index of deleted element: ${removedIndex}`);
```

### removeAt()

> Deletes elements in the specified location from the collection.

```ts
type removeAt = (pos: number) => boolean;
```
- pos : Index of the element to be deleted.
- return : Bullion value that indicates whether element deletion is successful.

```js
const success = myCollection.removeAt(0);
console.log(`Delete element successful: ${success}`);
```

### contains()

> Verify that the element exists in the collection.

```ts
type contains = (elem) => boolean;
```
- element : The element to be checked.
- return : A Boolean value indicating the presence or absence of an element.

```js
const exists = myCollection.contains(someElement);
console.log(`element exists: ${exists}`);
```

### indexOf()

> Returns the index of the key or element specified in the property collection.

```ts
type indexOf = (target: any | string, isKey?: boolean) => number;
```
- target : A key or element to look up the target. A string can be passed when viewed with a key.
- isKey : A bullion value that determines whether to look up with a key. Default is 'false'.
- return : Index of the element. Returns '-1' if the element does not exist.

```js
const index = myCollection.indexOf("key1", true);
console.log(`Index of key: ${index}`);
```
## Key Events

### onAdd

> Events that occur before adding an element to a collection.

```ts
type onAdd = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of the element to be added.
- element : The element to be added.
- \_this : current collection object.

```js
myCollection.onAdd = function(idx, elem, _this) {
	console.log(`Before adding elements: index ${idx}, element ${elem}`);
};
```

### onAdded

> Events that occur after adding an element to a collection.

```ts
type onAdded = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of the added element.
- element : Added element.
- \_this : current collection object.

```js
myCollection.onAdded = function(idx, elem, _this) {
	console.log ('After adding elements: index ${idx}, element ${elem}');
};
```

### onRemove

> An event that occurs before an element is deleted from the collection.

```ts
type onRemove = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of the element to be deleted.
- element : The element to be deleted.
- \_this : current collection object.

```js
myCollection.onRemove = function(idx, elem, _this) {
	console.log(`Before element deletion: index ${idx}, element ${elem}`);
};
```

### onRemoved

> Events that occur after you delete an element from the collection.

```ts
type onRemoved = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of deleted elements.
- element : Deleted element.
- \_this : current collection object.

```js
myCollection.onRemoved = function(idx, elem, _this) {
	console.log(`After element deletion: index ${idx}, element ${elem}`);
};
```

### onClear

> Events that occur before the collection is initialized.

```ts
type onClear = (_this: object) => {};
```
- \_this : current collection object.

```js
myCollection.onClear = function(_this) {
	console.log ('Before collection initialization);
};
```
### onCleared

> Events that occur after the collection is initialized.

```ts
type onCleared = (_this: object)=> {};
```
- \_this : current collection object.

```js
myCollection.onCleared = function(_this) {
	console.log ('After collection initialization');
};
```

### onChanging

> Events that occur before you change the elements in the collection.

```ts
type onChanging = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of the element to be changed.
- element : The element to be changed.
- \_this : current collection object.

```js
myCollection.onChanging = function(idx, elem, _this) {
	console.log(`Before element change: index ${idx}, element ${elem}`);
};
```

### onChanged

> Events that occur after you change the elements of the collection.

```ts
type onChanged = (idx: number, elem: any, _this: object) => void;
```
- idx : Index of the changed element.
- element : Changed element.
- \_this : current collection object.

```js
myCollection.onChanged = function(idx, elem, _this) {
	console.log ('After element change: index ${idx}, element ${elem}');
};
```
