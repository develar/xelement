[![Build Status](https://travis-ci.org/dongariteja/xelement.svg?branch=master)](https://travis-ci.org/dongariteja/xelement)

# xelement
#### _A powerful xelement (Xml Element) class to parse xml for JavaScript._
***
`xelement` represents an xml element. You can use this class to create or parse xml string to xml element. It allows to add, edit and delete any element or its attributes within the element tree and serialize the entire element to string from. You can search through the element and can traverse the element tree up and downwards.

The basic building blocks of this module are XElement class and Parser
* XElement class represents each element in the xml element tree.
* Parser will create XElement tree from the xml string.

### Installation for node
	npm install xelement
### Usage
```js
	var xelement = require('xelement');
	var xeleRoot = new xelement.Parse("<root><ele1>some value</ele1></root>");
```
### Class
The main class is XElement which represents the parsed xml, all elements in the XElement tree from root to leaf element are XElement.

#### Members
* `name`: name of the element or node name “\<root\>”. For more information about namespaces please refer to [sax][sax].
* `attr`: an object represents all attributes of the element. The default value is `{}`. Ex: - `book.attr.id` where `<book id=”bk108”>`
* `value`: value of the element.  Ex: - `book.value returns` “some value”where `<book>some value</book>`
* `elements`: array of child elements. The default value is `[]`.
* `parent`: refers to the parent element. Ex: - `author.parent.name` will return “book” where `<book><author>tj</author></book>`

Features
- [Parse](#Parse) 
- [ParseJson](#ParseJson)
- [XElement](#XElement)
	- [descendants](#descendants)
	- [descendantsAndSelf](#descendantsAndSelf)
	- [descendantFirst](#descendantFirst)
	- [ancestor](#ancestor)
	- [firstElement](#firstElement)
	- [lastElement](#lastElement)
	- [siblings](#siblings)
	- [previousSibling](#previousSibling)
	- [nextSibling](#nextSibling)
	- [index](#index)
	- [setAttr](#setAttr)
	- [getAttr](#getAttr)
	- [removeAttr](#removeAttr)
	- [add](#add)
	- [createElement](#createElement)
	- [element](#element)
	- [getElements](#getElements)
	- [getElementValue](#getElementValue)
	- [setElementValue](#setElementValue)
	- [hasElements](#hasElements)
	- [hasAttr](#hasAttr)
	- [remove](#remove)
	- [removeAll](#removeAll)
	- [toXmlString](#toXmlString)
	- [toJSON](#toJSON)
- [Array Extensions](#ArrayExtensions)
	- [where](#where)
	- [select](#select)
	- [selectMany](#selectMany)
	- [forEach](#forEach)



<a name="Parse"></a>
### Parse(data)
Converts xml string to XElemnt
```js
	var fs = require('fs');
	var xelement = require('xelement');
	var xmlString = fs.readFileSync('./sampledata.xml', 'utf8');
	xeleCatalog = xelement.Parse(xmlString); //parses the xmlString to XElement object representing complete xml element tree
```
<a name="ParseJson"></a>
### ParseJson(data, elementName)
Converts json string or object to XElement
 `elementName`: elementName
```js
	var obj = {
		"name" : "teja",
		"location" : "hyderabad"
	}

	var xelement = require('xelement');
		xeleCatalog = xelement.ParseJson(obj); //parses the Json string/object to XElement object representing complete xml element tree	

```


### Example Xml
You can find sample xml at [here][SampleXml]

### Methods
-----

<a name="descendants"></a>
#### descendants(name, ignoreCase) 
Returns the array of all descendant element with specified name by default parameter is empty on unspecified and it will return all descendant elements, ignoreCase is the flag whether to ignore the case of the element name, by default set to false. On unsuccessful result it will return [].
```js
	var descs = xeleCatalog.descendants('author', true);	//returns all elements with “author” name
```
<a name="descendantsAndSelf"></a>
#### descendantsAndSelf(name, ignoreCase) 
Returns the array of all descendant element with specified name and self by default parameter is empty on unspecified and it will return all descendant elements, ignoreCase is the flag whether to ignore the case of the element name, by default set to false. On unsuccessful result it will return [].
```js
	var descs = xeleCatalog.descendantsAndSelf('author', true); //returns all elements with “author” name including self
```
<a name="descendantFirst"></a>
#### descendantFirst(name, ignoreCase) 
Returns the first descendant element with specified name, name is not optional , ignoreCase is the flag whether to ignore the case of the element name, by default set to false. On unsuccessful result it will undefined.
```js
	var descs = xeleCatalog.descendantsFirst('author', true); //returns the first element with “author” name
```
<a name="ancestor"></a>
#### ancestor(name, ignoreCase)
Returns the ancestor parent with specified name. ignoreCase is the flag whether to ignore the case of the element name, by default set to false. On unsuccessful result it will return undefined.
```js
	var author = xele.descendantsFirst('author');
	var book = author.ancestor('book'); //returns the book element
	var catalog= author.ancestor('catalog');   //return the catalog element
```

<a name="firstElement"></a>
#### firstElement() 
Returns the first child element, returns undefine if doesn’t exist.
```js
	var author = xele.descendantsFirst(book);
	var author = author.firstElement(); //returns the author element
```

<a name="lastElement"></a>
#### lastElement() 
Returns the last child element, return undefined if doesn’t exist.
```js
	var author = xele.descendantsFirst(book);
	var description = author.lastElement(); //returns the description element
```

<a name="siblings"></a>
#### siblings(name) 
Returns the siblings of the element with specified name, if name unspecified it returns all siblings. Return [] if doesn’t exist.
```js
	var author = xele.descendantsFirst('author');
	var sl[] = xele.siblings(); //returns all sibling elements
```

<a name="previousSibling"></a>
#### previousSibling() 
Returns the previous sibling of the element, it returns undefined if doesn’t exist.
```js
	var fd = xeleCatalog.descendantFirst('title', true);
	var ps = fd.previousSibling();
	console.log(ps.name); //prints “author”
	console.log(fd.previousSibling().previousSibling()); //prints undefined
```

<a name="nextSibling"></a>
#### nextSibling()
Returns the next sibling of the element, it returns undefined if doesn’t exist.
```js
	var fd = xeleCatalog.descendantFirst('publish_date', true);
	var ps = fd.nextSibling();
	console.log(ps.name); //prints “description”
	console.log(fd.nextSibling().nextSibling()); //prints undefined
```

<a name="index"></a>
#### index()
Returns the index of the element among its sibling. Index starts from 0. It returns undefined if the element is not a child other element.
```js
	var fd = xeleCatalog.elements.where(function (o) { return o.attr.id == "bk104"; });
	console.log(fd[0].index()); //prints 3
```

<a name="setAttr"></a>
#### setAttr(name, value)
Sets the value to specified attribute of the element. If the attribute doesn’t exist, it will create.
```js
	var fd = xeleCatalog.descendantFirst('book');
	fd.setAttr('NewAttr', '100');
	console.log(fd.attr.NewAttr); //prints “100”   
```

<a name="getAttr"></a>
#### getAttr(name)
Returns the value from specified attribute of the element. If the attribute doesn’t exist it will return empty.
```js
	var fd = xeleCatalog.descendantFirst('book');
	fd.setAttr('NewAttr', '100');
	console.log(fd.getAttr('NewAttr')); //prints “100” 
	console.log(fd.getAttr('yyy')); //prints empty
```

<a name="removeAttr"></a>
#### removeAttr(name)
Remove the specified attribute from the element.
```js
	var fd = xeleCatalog.descendantFirst('book');
	fd.removeAttr('NewAttr', '100');
	console.log(fd.attr.NewAttr); //prints undefined
	console.log(fd.getAttr('NewAttr')); //prints empty
```

<a name="add"></a>
#### add(obj)
Adds xelement as its child element. Single or array of xelement can be passed. Only valid xelement object will be added and others ignored.
```js
	var dummy = {};
	xeleCatalog.add(dummy);//adding invalid object it will ignore     
	console.log(xeleCatalog.lastElement().attr.id); //prints “bk112” because the {} object didn’t add to xeleCatalog element.
	
	//adding single element
	var newBook = new xelement.XElement("book");
	newBook.attr.id = "bk113";
	xeleCatalog.add(newBook);
	console.log(xeleCatalog.lastElement().attr.id); //prints “bk113”
	
	//Adding range of elements
	var newElements = [];
	for (var i = 0; i < 5; i++) {
		newBook = new xelement.XElement("book");
		newBook.attr.id = "bk" + (113 + i).toString();
		newElements.push(newBook);
	}
	xeleCatalog.add(newElements);    
	console.log(xeleCatalog.lastElement().attr.id) //prints “bk117”    
```

<a name="createElement"></a>
#### createElement(name,value)
Create a new element and adds to its child elements. If value parameter is unspecified it will consider as empty.
```js
	var newEle = xeleCatalog.createElement("TestElement");
	newEle.value = "100";  
	console.log(xeleCatalog.lastElement().name); //prints “TestElement”
	
	//or
	var newEle = xeleCatalog.createElement("TestElement", "100");  
	console.log(newEle.value); //prints “100”
```

<a name="element"></a>
#### element(name, ignoreCase)
Return the first element with specified name, name is not optional. It returns undefined if doesn’t exist.
```js
	var fd = xeleCatalog.element('book1');
	console.log(fd); //prints undefined
	fd = xeleCatalog.element('book');
	console.log(fd.name); //prints “book”
```

<a name="getElements"></a>
#### getElements(name, ignoreCase)
Return the all elements with specified name, if name unspecified it will return all child elements.
```js
	var eles = xeleCatalog.getElements('book', true); //return all elements with “book” name
```

<a name="getElementValue"></a>	
#### getElementValue(name, ignoreCase)
Return the first element value with specified name, name is not optional.
```js
	var vl = xeleCatalog.getElementValue("TestElement1", true);
	console.log(vl); //prints TestElement1 element value
```

<a name="setElementValue"></a>
#### setElementValue(name,value)
Sets the specified child element value. If element doesn’t exist it will create new.
```js
	xeleCatalog.setElementValue("TestElement", 1001); 
	console.log(xeleCatalog.getElementValue("TestElement")); //prints 1001
```

<a name="hasElements"></a>
#### hasElements
return true if the element has any child elements.
```js
	if(xeleCatalog.hasElements)
	console.log('has elements'); 
```

<a name="hasAttr"></a>
#### hasAttr
return true if the element has any attribues.
```js
	if(xeleCatalog.hasAttr)
	console.log('has attribues'); 
```

<a name="remove"></a>
#### remove()
Remove the current element from its parent. The element will be no longer associated with element tree.
```js
	var fd = xeleCatalog.descendantFirst('book');
	fd.remove(); //remove the book element from its parent
```

<a name="removeAll"></a>
#### removeAll()
Removes the all child elements. All child elements will be no longer associated with element tree.
```js
	var fd = xeleCatalog.descendantFirst('book');
	fd.removeAll(); //remove all child element from book element
```

<a name="toXmlString"></a>
#### toXmlString()
Converts the xelement into valid xml string. This function is available for each element in the tree thus xml string can be created from any element from the tree.
```js
	var fd = xeleCatalog.descendantFirst('book');
	console.log(fd.toXmlString())
	//prints the following xml
```
```xml
	<book id="bk101">
		<author>Gambardella, Matthew</author>
		<title>XML Developer's Guide</title>
		<genre>Computer</genre>
		<price>44.95</price>
		<publish_date>2000-10-01</publish_date>
		<description>
			An in-depth look at creating applications with XML.
		</description>
	</book>
```

<a name="toJSON"></a>
#### toJSON(options)
Converts the xelement into JSON object. This function is available for each element in the tree thus JSON object can be created from any element from the tree.  
 `options` : {
	includeAttributes : true/false to specifiy to include attrubes in the JSON. default value is fale
 }

```js
	var fd = xeleCatalog.descendantFirst('book');
	console.log(fd.toJSON())
	//prints the following JSON
```

```json
	{
		"@id": "bk101",
		"author": "Gambardella, Matthew",
		"title" : "XML Developer's Guide",
		"genre" : "Computer",
		"price" : "44.95",
		"publish_date" : "2000-10-01",
		"description" : "An in-depth look at creating applications with XML."
	}
```

<a name="ArrayExtensions"></a>
### Array Extensions
##### Array extension methods will facilitate search, select, foreach operations on collection of items
------

<a name="where"></a>
#### where(fn)
Is an extension method to an array to enable to apply filter to its collection as array. The default value is [].
```js
	var wr = xeleCatalog.descendants("book").where(function (o) { return o.attr.id == "bk109" });
```

<a name="select"></a>
#### select(fn)
Is an extension method to an array to select any object or object value as array. The default value is [].
```js
	var wr = xeleCatalog.descendants("author").select(function (o) { return o.value; });
```

<a name="selectMany"></a>
#### selectMany(fn)
Is an extension method to an array to select Many and returns a single array. The default value is [].
```js
	var wr = xeleCatalog.descendants("book").selectMany(function (o) { return o.elements });
```

<a name="forEach"></a>
#### forEach(fn)
Is an extension method to an array to execute operation on each item in the array.
```js
	var wr = xeleCatalog.descendants("book");
	wr.forEach(function (o) {
		o.setAttr('newAttr', 'someValue');
		o.createElement('newElement', 'someValue');
   	});
```

### Feedback and Comments
----
Please feel free to post your comments on [Twitter][twitter] and issues on [github][githubIssues]


[twitter]: https://twitter.com/dongariteja
[sax]: https://github.com/isaacs/sax-js
[githubIssues]: https://github.com/dongariteja/xelement/issues
[SampleXml]: https://github.com/dongariteja/xelement/blob/master/sampledata.xml
