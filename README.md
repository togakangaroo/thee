Thee is a micro-utility to make you never have to use the `this` keyword ever again.

# Why `thee`?

I think we can all agree, the `this` keyword in javascript is dumb. So `thee` gets rid of the need to use it. Ever. Like this:

Normally we would write

```js
var ackgnowledgeClick = function(e) {
	this.textContent = "You Clicked the button at (" + e.pageX + ", " + e.pageY + ")";
};
$('button').on('click', ackgnowledgeClick);
```

Now you can 

	npm install thee

or

	jspm install github:togakangaroo/thee	

and

```js
import thee from 'thee'

var ackgnowledgeClick = function(button, e) {
	button.textContent = "You Clicked the button at (" + e.pageX + ", " + e.pageY + ")";
};
$('button').click( thee(ackgnowledgeClick) );
```

Nice and simple. [See below for more uses](#more-uses)

Thee is written entirely in es6 javascript. An [cross-compiled](thee.es5.js) es5 version is available for those not using a compiler (like [Babel](https://babeljs.io/) with [Jspm](http://jspm.io/). I can't emphasize enough that you should use Jspm).


# We don't all agree that `this` is dumb?

Oh boy. Let me take you through this and keep an open mind.

Let's start with the following code

```js
var fred = {
	name: "Fred Flintstone",
	sayHi: function() {
		alert("Hello from " + this.name);
	}
};

var button = $('button');
button.click(function() {
	fred.sayHi();
});
```

Now an enterprising (and OCD) developer might say

> Hold on, I should be able to clean this up! We've got `click` taking a simple function argument in which we don't care about parameters, and `fred.sayHi` *is* a simple function in which we don't care about parameters. So how about

```js
$('button').click(fred.sayHi);
```

> less indirection, and I save two lines of ceremony code and...oh...crap

Yeah, doesn't work, does it? All of a sudden you're not saying `"Hello from Fred Flintstone"`. That's because the `this` parameter changes out underneath us.

So ok, you might concede; `this` is confusing, but isn't it a necessary evil? It might be dumb, but you can't exactly get around without it?. Afterall, `this` is special, it's not like `this` is just another much more familiar language feature in disguise, is it?

Assuming that you fist pumped and screamed out loud *"no it's not!"* let me blow your mind. It is! Let me prove it to you.

Most people are aware that all functions in javascript have a special [`call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) method. 

```js
    doStuff.call(1, 2, 3);
```

This will invoke `doStuff` while setting `this` to 1, the first agument to 2, and the second to 3".

In fact if you wanted to, you could use *only* `.call` to invoke all functions in your codebase. In that case we might rewrite the above code in this way.

```js
var fred = {
	name: "Fred Flintstone",
	sayHi: function() {
		alert.call(window, "Hello from " + this.name);
	}
};

var button = $.call(window, 'button');
button.click.call(button, function() {
	fred.sayHi.call(fred);
});
```

this is verbose, but equivalent to the previous code. So let's say we only ever invoked functions with `.call`. Let's take a more complex example

```js
var function whatAreThings(arg1, arg2) {
	console.log("Things passed in:", this, arg1, arg2, arguments[2]);
}
whatAreThings.call("one", "two", "three", "four");
// Will print
//   Things passed in: one two three four
```

> Umm (you say) - so how exactly is `this` different from like...any other parameter?

**Now you're getting it!**

`this` is just a parameter! It's in fact worse because

* it's not included in the automatic arguments object
* and you don't get to name it in an nice way

Oh and there's the fact that if you *don't* explicitly use `.call` the programming language [*takes a guess* at what you want `this` to be](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

```js 
whatAreThings("one", "two", "three"); //Things passed in: window one two three

(function() {
	'use strict'
	whatAreThings("one", "two", "three"); //Things passed in: undefined one two three
})();

var obj = {};
obj.whatAreThings = whatAreThing;
obj.whatAreThings("one", "two", "three"); //Things passed in: [Object object] one two three
```

What a pain in the ass!

So the question becomes. **Why use `this` at all?** And the good news is, in your own code, you usually don't have to. The problem is more when you try to use a library's code. These often force you to use `this`. And that's where `thee` comes in!


# More Uses

`thee` is not just for wrapping functions. You can use it to wrap whole objects, which will return a new object with the same properties but wrapped methods.

Instead of

```js
var Person = React.createClass({
	name: "Person component",
	render: function() {
		return (
			<header>{this.props.name}</header>
		)
	},
	componentWillMount: function() {
		logMouting(this)
	}
})
```

you can do

```js
var Person = React.createClass(thee({
	name: "Person component",
	render: function(c) {
		return (
			<header>{c.props.name}</header>
		)
	},
	componentWillMount: logMouting //yay! this works like it should
}))
```

Heck, wee can even do es6 arrow functions because without `this`, who cares about scope binding?

```js
var Person = React.createClass(thee({
	name: "Person component",
	render:( (c) =>
		<header>{c.props.name}</header>
	),
	componentWillMount: logMouting
}))
```

Note that all other parameters will still be present, they will simply be shifted over by one.

## `this` checking

Code using `thee` shouldn't use `this`. Therefore, when first wrapping a function, `thee` will by default attempt to parse the function code for usages of `this` and throw an error if this is found. 
Sometimes this might not be the desired behavior. In order to disable it, pass an optioins object with `{ noThisCheck: true}`

```js
fred.sayHi = thee(function(p) { console.log("Hi from this. " + p.name) }, { noThisCheck: true }) );
```

or disable it globally

```js
thee.noThisCheck = true 
//...
fred.sayHi = thee(function(p) { console.log("Hi from this. " + p.name) } );
```

# About `thee`

`thee` is written as part of the [New Orleans Open Source Hackathon](http://opensourcenola.org/). The original name was Thus but a [Thus library that does the exact opposite already exists](https://www.npmjs.com/package/thus). Boo on Thus!. The name was suggested by [Gant Laborde](http://www.iconoclastlabs.com/) who is a judge. Hi Gant!
