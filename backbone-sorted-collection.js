(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('underscore'), require('backbone'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone'], factory);
    }
    else {
        root.SortedCollection = factory(root._, root.Backbone);
    }
}(this, function(_, Backbone) {
var require=function(name){return {"backbone":Backbone,"underscore":_}[name];};
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"NN7JHQ":[function(require,module,exports){

var _ = require('underscore');
var Backbone =require('backbone');
var proxyCollection = require('backbone-collection-proxy');
var reverseSortedIndex = require('./src/reverse-sorted-index.js');

function onAdd(model) {
  var index;
  if (!this._comparator) {
    index = this._superset.indexOf(model);
  } else {
    if (!this._reverse) {
      index = this._collection.sortedIndex(model, this._comparator);
    } else {
      index = reverseSortedIndex(this._collection.toArray(), model, this._comparator);
    }
  }
  this._collection.add(model, { at: index });
}

function onRemove(model) {
  if (this.contains(model)) {
    this._collection.remove(model);
  }
}

function onChange(model) {
  if (this.contains(model)) {
    this._collection.remove(model);
    onAdd.call(this, model);
  }
}

function sort() {
  if (!this._comparator) {
    this._collection.reset(this._superset.toArray());
    return;
  }

  var newOrder = this._superset.sortBy(this._comparator);
  this._collection.reset(this._reverse ? newOrder.reverse() : newOrder);
}

function Sorted(superset) {
  // Save a reference to the original collection
  this._superset = superset;
  this._reverse = false;
  this._comparator = null;

  // The idea is to keep an internal backbone collection with the paginated
  // set, and expose limited functionality.
  this._collection = new Backbone.Collection(superset.toArray());
  proxyCollection(this._collection, this);

  this.listenTo(this._superset, 'add', onAdd);
  this.listenTo(this._superset, 'remove', onRemove);
  this.listenTo(this._superset, 'change', onChange);
  this.listenTo(this._superset, 'reset', sort);
}

var methods = {

  setSort: function(comparator, direction) {
    this._reverse = direction === 'desc' ? true : false;
    this._comparator = comparator;

    sort.call(this);

    if (!comparator) {
      this.trigger('sorted:remove');
    } else {
      this.trigger('sorted:add');
    }

    return this;
  },

  reverseSort: function() {
    this._reverse = !this._reverse;
    sort.call(this);

    return this;
  },

  removeSort: function() {
    this.setSort();
    return this;
  },

  superset: function() {
    return this._superset;
  },

  destroy: function() {
    this.stopListening();
    this._collection.reset([]);
    this._superset = this._collection;
    this.length = 0;

    this.trigger('sorted:destroy');
  }

};

// Build up the prototype
_.extend(Sorted.prototype, methods, Backbone.Events);

module.exports = Sorted;


},{"./src/reverse-sorted-index.js":4,"backbone":false,"backbone-collection-proxy":2,"underscore":false}],2:[function(require,module,exports){

var _ = require('underscore');
var Backbone = require('backbone');

// Methods in the collection prototype that we won't expose
var blacklistedMethods = [
  "_onModelEvent", "_prepareModel", "_removeReference", "_reset", "add",
  "initialize", "sync", "remove", "reset", "set", "push", "pop", "unshift",
  "shift", "sort", "parse", "fetch", "create", "model", "off", "on",
  "listenTo", "listenToOnce", "bind", "trigger", "once", "stopListening"
];

function proxyCollection(from, target) {

  function updateLength() {
    target.length = from.length;
  }

  function pipeEvents() {
    var args = _.toArray(arguments);

    // replace any references to `from` with `this`
    for (var i = 1; i < args.length; i++) {
      if (args[i] && args[i].length && args[i].length === from.length) {
        args[i] = this;
      }
    }

    this.trigger.apply(this, args);
  }

  var methods = {};

  _.each(_.functions(Backbone.Collection.prototype), function(method) {
    if (!_.contains(blacklistedMethods, method)) {
      methods[method] = function() {
        return from[method].apply(from, arguments);
      };
    }
  });

  _.extend(target, Backbone.Events, methods);

  target.listenTo(from, 'all', updateLength);
  target.listenTo(from, 'all', pipeEvents);

  updateLength();
  return target;
}

module.exports = proxyCollection;


},{"backbone":false,"underscore":false}],"backbone-sorted-collection":[function(require,module,exports){
module.exports=require('NN7JHQ');
},{}],4:[function(require,module,exports){

var _ = require('underscore');

// Underscore and backbone provide a .sortedIndex function that works
// when sorting ascending based on a function or a key, but there's no
// way to do the same thing when sorting descending. This is a slight
// modification of the underscore / backbone code to do the same thing
// but descending.

function lookupIterator(value) {
  return _.isFunction(value) ? value : function(obj){ return obj.get(value); };
}

function reverseSortedIndex(array, obj, iterator, context) {
  iterator = iterator == null ? _.identity : lookupIterator(iterator);
  var value = iterator.call(context, obj);
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >>> 1;
    iterator.call(context, array[mid]) < value ? high = mid : low = mid + 1;
  }
  return low;
}

module.exports = reverseSortedIndex;

},{"underscore":false}]},{},[])
;
return require('backbone-sorted-collection');

}));
