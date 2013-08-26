# backbone-sorted-collection

[![Build Status](https://secure.travis-ci.org/user/backbone-sorted-collection.png?branch=master)](http://travis-ci.org/user/backbone-sorted-collection)

Create a read-only sorted version of a backbone collection that stays in sync.

```javascript
var sorted = new SortedCollection(originalCollection);

sorted.sortBy(function(model) {
  return model.get('foo');
});

// or

sorted.sortBy('foo');

// or

sorted.sortBy(function(model) {
  return calculateSomething(model);
});

sorted.reverseSort();
```

## Installation

### Usage with Bower

Install with [Bower](http://bower.io):

```
bower install backbone-sorted-collection
```

The component can be used as a Common JS module, an AMD module, or a global.

### Usage with Browserify

Install with npm, use with [Browserify](http://browserify.org/)

```
> npm install backbone-sorted-collection
```

and in your code

```javascript
var SortedCollection = require('backbone-sorted-collection');
```

### Usage as browser global

You can include `backbone-sorted-collection.js` directly in a script tag. Make 
sure that it is loaded after underscore and backbone. It's exported as `SortedCollection`
on the global object.

```HTML
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone-sorted-collection.js"></script>
```

## Methods

### new SortedCollection

### sorted.sortBy
### sorted.reverseSort

## Events

`add`, `remove`, `change`, `reset` should fire as you expect.


## Testing

Install [Node](http://nodejs.org) (comes with npm) and Bower.

From the repo root, install the project's development dependencies:

```
npm install
bower install
```

Testing relies on the Karma test-runner. If you'd like to use Karma to
automatically watch and re-run the test file during development, it's easiest
to globally install Karma and run it from the CLI.

```
npm install -g karma
karma start
```

To run the tests in Firefox, just once, as CI would:

```
npm test
```

## License

MIT

