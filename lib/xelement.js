/*
    //TODO: need to implement xpath
    /
    //
    .
    ..
    @
    name
    predicate [1][2][3]
    first()
    last()
    position()
    expression
    multiple
*/

/*
XElement is mainly inspired from .Net XElement object.
It facilitates all necessary functionality to search descendant elements.
Can traverse upwards and downwards with in the XElement object tree.
It allows to search, modify, add, delete any XElement object with in the XElement tree.
Can convert to Xml string from any referral XElement.
*/
var XELEMENT = (function ()
{
    
    var sax;
    
    //XElement is main type represents fundamental XElement constuct(Xml Element).
    //All child elements with in the XElement are an XElements
    
    //XElement
    //{
    //	value : value of the element
    //	name : name of the element
    //	attr : attributes
    //	isCData: value is CData 
    //	elements : all child elements
    //	parent : reference of parent XElement	
    //}
    
    var XElement = function (name)
    {
        this.value = "";
        this.name = name || '';
        this.attr = {};
        this.isCData = false;
        this.elements = [];
        this.parent = null;
        if (name == '')
        {
            throw "Element name cannot be empty";
        }
        
        if (!isValidName(name))
        {
            throw "Invalid element name: " + name;
        }
    }
    
    function isValidName(name)
    {
        return (new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i).test(name));
    }
    //Returns the all descendants elements with matching name
    ///name : element name, its optional, the default(unspecified) is empty and returns all elements with in the tree
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    XElement.prototype.descendants = function (name, ignoreCase)
    {
        
        var ret = [];
        if (arguments.length > 2)
        {
            ret = arguments[2];
        }
        
        name = name || '';
        var thisName = this.name;
        if (ignoreCase == true)
        {
            name = name.toUpperCase();
            thisName = thisName.toUpperCase();
        }
        
        if (thisName == name || name == '')
        {
            ret.push(this);
        }
        
        for (var i = 0; i < this.elements.length; i++)
        {
            this.elements[i].descendants(name, ignoreCase, ret);
        }
        
        return ret;
    }
    
    //Returns the all descendants elements and self with matching name
    ///name : element name, its optional, the default(unspecified) is empty and returns all elements with in the tree
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    
    XElement.prototype.descendantsAndSelf = function (name, ignoreCase)
    {
        
        var ret = this.descendants(name, ignoreCase);
        
        ret.unshift(this);
        
        return ret;
    }
    
    //Returns the first descendant element with matching name
    ///name : element name, its not optional.
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    
    XElement.prototype.descendantFirst = function (name, ignoreCase)
    {
        
        name = name || '';
        if (name == '')
            return;
        var thisName = this.name;
        if (ignoreCase == true)
        {
            name = name.toUpperCase();
            thisName = thisName.toUpperCase();
        }
        for (var i = 0; i < this.elements.length; i++)
        {
            var cl = this.elements[i].descendantFirst(name, ignoreCase);
            if (cl != undefined)
            {
                return cl;
            }
        }
        if (thisName == name)
        {
            return this;
        }

    }
    
    //Returns the first occuring ancestor element with matching name
    ///name : element name, its not optional.
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    
    XElement.prototype.ancestor = function (name, ignoreCase)
    {
        if ((name || '') != '' && this.parent != null)
        {
            
            var parentName = this.parent.name;
            if (ignoreCase == true)
            {
                name = name.toUpperCase();
                parentName = parentName.toUpperCase();
            }
            
            
            if (parentName == name)
            {
                return this.parent;
            }
            else
            {
                return this.parent.ancestor(name, ignoreCase);
            }

        }

    }
    
    
    //Returns all sibling elements	
    XElement.prototype.siblings = function (name)
    {
        var thisEle = this;
        name = name || '';
        return this.parent.elements.where(function (o)
        {
            return o != thisEle && (o.name == name || name == "");
        });
    }
    
    //Removes the element from parent
    XElement.prototype.remove = function ()
    {
        if (this.parent != null)
        {
            var myIndex = this.index();
            if (myIndex >= 0)
            {
                this.parent.elements.remove(this);
            }
        }
    }
    
    //Retruns the first child element
    //Return undefined if there are no child elements
    XElement.prototype.firstElement = function ()
    {
        if (this.elements.length > 0)
        {
            return this.elements[0];
        }
    }
    
    //Retruns the last child element
    //Return undefined if there are no child elements
    XElement.prototype.lastElement = function ()
    {
        if (this.elements.length > 0)
        {
            return this.elements[this.elements.length - 1];
        }
    }
    
    //Retruns the previous sibling element
    //Return undefined if there are previous sibling elements
    XElement.prototype.previousSibling = function ()
    {
        
        if (this.parent != null)
        {
            var myIndex = this.index();
            if (myIndex > 0)
            {
                return this.parent.elements[myIndex - 1];
            }
        }
    }
    
    //Retruns the next sibling element
    //Return undefined if there are next sibling elements
    XElement.prototype.nextSibling = function ()
    {
        if (this.parent != null)
        {
            var myIndex = this.index();
            if (myIndex < this.parent.elements.length - 1)
            {
                return this.parent.elements[myIndex + 1];
            }
        }
    }
    
    //Retruns the index of current element amoung its siblings
    //Return undefined if the element is not a child of any
    XElement.prototype.index = function ()
    {
        if (this.parent != undefined)
        {
            return this.parent.elements.indexOf(this);
        }
    }
    
    //Removes all its child elements
    XElement.prototype.removeAll = function ()
    {
        this.elements = [];
    }
    
    //Sets the attibute value of the current element
    //Creates the attribute if specified is not exists
    ///name : attribute name
    ///val : value to set
    XElement.prototype.setAttr = function (name, val)
    {
        if (isValidName(name))
            this.attr[name] = val;
    }
    
    //Returns the attribute value of the current element
    //Returngs empty value if specified attribute is not exists
    ///name : attribute name
    XElement.prototype.getAttr = function (name)
    {
        return this.attr[name] || '';
    }
    
    //Removes the specified attribute of the current element
    ///name : attribute name
    XElement.prototype.removeAttr = function (name)
    {
        delete this.attr[name];
    }
    
    //Adds the XElement(s) to the current element
    //Accepts sing XElement or array of XElement
    ///elements: XElement or array of XElement
    XElement.prototype.add = function (elements)
    {
        
        var _elements = [];
        if (Array.prototype.isPrototypeOf(elements))
        {
            _elements = elements;
        }
        else
        {
            _elements.push(elements);
        }
        
        for (var i = 0; i < _elements.length; i++)
        {
            
            var ele = _elements[i];
            
            if (XElement.prototype.isPrototypeOf(ele) && ele.parent == null)
            {
                if (this.elements == null || this.elements == undefined)
                {
                    this.elements = [];
                }
                ele.parent = this;
                this.elements.push(ele);
            }
        }

    }
    
    //Create a new element with specified name and returns the instance.
    //name : element name, not optional
    //value :  value for new element
    XElement.prototype.createElement = function (name, value)
    {
        var newEle = new XElement(name);
        value = value || '';
        newEle.value = value;
        this.add(newEle);
        return newEle;
    }
    
    //Returns the first child element matched by name
    //Returns undefined if no elements found by matching name
    ///name : element name, not optional
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    XElement.prototype.element = function (name, ignoreCase)
    {
        name = name || '';
        
        for (var i = 0; i < this.elements.length; i++)
        {
            var eleName = this.elements[i].name;
            if (ignoreCase == true)
            {
                name = name.toUpperCase();
                eleName = eleName.toUpperCase();
            }
            if (eleName == name)
            {
                return this.elements[i];
            }
        }

    }
    
    //Returns the all child element matched by name
    //Returns undefined if no elements found by matching name
    ///name : element name, its optional, the default(unspecified) is empty and returns all elements with in current element
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    XElement.prototype.getElements = function (name, ignoreCase)
    {
        name = name || '';
        if (name == '')
        {
            return this.elements;
        }
        else
        {
            var ret = [];
            for (var i = 0; i < this.elements.length; i++)
            {
                var eleName = this.elements[i].name;
                if (ignoreCase == true)
                {
                    name = name.toUpperCase();
                    eleName = eleName.toUpperCase();
                }
                
                if (eleName == name)
                {
                    ret.push(this.elements[i]);
                }
            }
            return ret;
        }
    }
    
    //Returns the value of first child element matched by name
    //Returns empty if no elements found by matching name
    ///name : element name, its not optional
    ///ignoreCase : ignore name case while searching, default(unspecified) value is false
    XElement.prototype.getElementValue = function (name, ignoreCase)
    {
        
        var ch = this.element(name, ignoreCase);
        if (ch != undefined)
        {
            return ch.value;
        }
        return "";
    }
    
    //Sets the value of first child element matched by name	
    ///name : element name, its not optional
    ///value: value to set
    XElement.prototype.setElementValue = function (name, value)
    {
        var ch = this.element(name);
        if (ch == undefined)
        {
            ch = new XElement(name);
            this.add(ch);
        }
        ch.value = value;

    }
    
    //returns the Xml string of the current element
    XElement.prototype.toXmlString = function ()
    {
        var sb = [];
        var attrtext = "";
        for (var at in this.attr)
        {
            if (isValidName(at))
            {
                attrtext += at + '="' + eacapeChars(this.attr[at]) + '" ';
            }
        }
        if (attrtext.length > 0)
        {
            attrtext = " " + attrtext.trim();
        }
        sb.push("<" + this.name + attrtext + ">");
        
        if (this.isCData)
        {
            sb.push('<![CDATA[' + this.value + ']]>');
        }
        else
        {
            sb.push(eacapeChars(this.value));
        }
        
        for (var i = 0; i < this.elements.length; i++)
        {
            sb.push(this.elements[i].toXmlString());
        }
        
        sb.push("</" + this.name + ">");
        return sb.join("\n");
    }
    
    Object.defineProperty(XElement.prototype, "hasElements", {
        get : function ()
        {
            return this.elements.length > 0;
        }
    });
    
    Object.defineProperty(XElement.prototype, "hasAttr", {
        get : function ()
        {
            var att = this.attr || {};
            for (var p in att)
            {
                return true;
            }
            return false;
        }
    });
    
    
    /**
     * converts XElement to Json object
     * @options Json convertions options
       {
            includeAttributes : true/false // include or exclude attribute infromation    
       }     
     */
    
    XElement.prototype.toJSON = function (options)
    {
        var options = options || {};
        if (this.hasElements)
        {
            var object = {};
            if (options.includeAttributes)
            {
                //convert all attribute
                for (var att in this.attr)
                {
                    object["@" + att] = this.attr[att];
                }
            }
            
            //converts all elements
            for (var i = 0; i < this.elements.length; i++)
            {
                var ele = this.elements[i];
                
                if (object.hasOwnProperty(ele.name))
                {
                    var eleJson = ele.toJSON(options);
                    var prp = object[ele.name];
                    if (!Array.isArray(prp))
                    {
                        prp = object[ele.name] = [prp];
                    }
                    prp.push(eleJson);
                }
                else
                {
                    object[ele.name] = ele.toJSON(options);
                }
            }
            
            
            
            return object;
        }
        else
        {
            return this.value.trim();
        }
    }
    
    function eacapeChars(value)
    {
        return value.replace(/</g, "&lt;")
				   .replace(/>/g, "&gt;")
				   .replace(/&/g, '&amp;')
				   .replace(/"/g, '&quot;')
				   .replace(/'/g, '&apos;');

    }
    
    //Converts xml string as XElement
    //Returns XElement object type	
    ///data: valid xml string
    var parse = function (data)
    {
        var rootElement;
        var parser = sax.parser(true);
        var elms = [];
        var isFirst = true;
        
        parser.onopentag = function (saxEle)
        {
            var xele = new XElement(saxEle.name);
            
            xele.attr = saxEle.attributes;
            
            if (isFirst)
            {
                rootElement = xele;
            }
            else
            {
                var parent = elms[elms.length - 1];
                xele.parent = parent;
                parent.elements.push(xele);
            }
            elms.push(xele);
            isFirst = false;
        }
        
        parser.onclosetag = function (eleName)
        {
            elms.pop();
        }
        
        parser.ontext = function (text)
        {
            if (elms.length > 0)
                elms[elms.length - 1].value = text;
        }
        
        parser.oncdata = function (cdata)
        {
            elms[elms.length - 1].value = cdata;
            elms[elms.length - 1].isCData = true;
        }
        
        parser.oncomment = function (cmtText)
        {
            var aa = cmtText;
        }
        
        parser.ondoctype = function (docType)
        {
            var aa = docType;
        }
        
        parser.onerror = function (err)
        {
            throw err;
        }
        
        
        parser.write(data);
        
        return rootElement;

    }
    
    var parseJson = function (data, elementName)
    {
        
        if (data instanceof Uint8Array)
            data = data.toString();
        
        if (typeof data == "string")
            data = JSON.parse(data);
        
        
        if (data)
        {
            
            var xele = new XElement(elementName, '');
            
            for (var prpty in data)
            {
                var pval = data[prpty];

                if (prpty.indexOf('@') == 0)
                {
                    xele.attr[prpty.replace('@','')] = pval;
                }
                else if (Array.isArray(pval))
                {
                    for (var i = 0; i < pval.length; i++)
                    {
                        xele.add(parseJson(pval[i], prpty));
                    }
                }
                else if (typeof pval == "object")
                {
                    xele.add(parseJson(pval, prpty));
                }               
                else
                {
                    xele.setElementValue(prpty, pval);
                }

            }
            
            return xele;
        }
        
        return null;
    }
    
    
    /*Array extensions */
    // where function will return items arry from array based on in condition	
    if (Array.prototype.where == undefined)
    {
        
        Array.prototype.where = function (fun)
        {
            var ret = [];
            if (typeof fun == "function")
            {
                for (var i = 0; i < this.length; i++)
                {
                    if (fun(this[i]))
                    {
                        ret.push(this[i]);

                    }
                }
            }
            return ret;
        }
    }
    
    
    if (Array.prototype.select == undefined)
    {
        Array.prototype.select = function (fun)
        {
            var ret = [];
            if (typeof fun == "function")
            {
                for (var i = 0; i < this.length; i++)
                {
                    ret.push(fun(this[i]));
                }
            }
            return ret;
        }
    }
    
    if (Array.prototype.selectMany == undefined)
    {
        Array.prototype.selectMany = function (fun)
        {
            var ret = [];
            
            if (typeof fun == "function")
            {
                for (var i = 0; i < this.length; i++)
                {
                    var funRet = fun(this[i]);
                    if (Array.prototype.isPrototypeOf(funRet))
                    {
                        ret.concat(funRet);
                    }
                    else
                    {
                        ret.push(funRet);
                    }
                }
            }
            
            return ret;
        }
    }
    
    
    if (Array.prototype.forEach == undefined)
    {
        Array.prototype.forEach = function (fun)
        {
            if (typeof fun == "function")
            {
                for (var i = 0; i < this.length; i++)
                {
                    fun(this[i]);
                }
            }
        }
    }
    
    if (Array.prototype.remove == undefined)
    {
        Array.prototype.remove = function (item, all)
        {
            for (var i = this.length - 1; i >= 0; i--)
            {
                if (this[i] === item)
                {
                    this.splice(i, 1);
                    if (!all)
                        break;
                }
            }
        }
    }
    
    if (Array.prototype.indexOf == undefined)
    {
        Array.prototype.indexOf = function (item)
        {
            for (var i = 0; i < this.length; i++)
            {
                if (this[i] == item)
                {
                    return i;
                }
            }
            return -1;
        }
    }
    
    /*end of Array extensions */
    
    //incase this framework is used for node application
    if (typeof module !== 'undefined' && module.exports)
    {
        // We're being used in a Node-like environment
        sax = require('sax');
        
        module.exports.XElement = XElement;
        module.exports.Parse = parse;
        module.exports.ParseJson = parseJson;

    }
    else
    {
        //incase this framework is used for browser application
        sax = this.sax;
        if (!sax) // no sax for you!
            throw new Error("'sax' is not found. Please make sure 'sax' is included properly.");
    }
    
    
    return {
        XElement: XElement,
        Parse: parse,
        ParseJson : parseJson
    };

})();

