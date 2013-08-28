/*! backbone-sorted-collection */
;(function (root) { function moduleDefinition(Backbone, _) {

function onAdd(model) {
  var index = this._collection.sortedIndex(model, this._comparator);
  this._collection.add(model, { at: index });
  this.length = this._collection.length;
}

function onRemove(model) {
  if (this.contains(model)) {
    this._collection.remove(model);
  }
  this.length = this._collection.length;
}

function onChange(model) {
  this._collection.remove(model);
  onAdd.call(this, model);
}

function sort() {
  if (!this._comparator) {
    this._collection.reset(this._superset.toArray());
    return;
  }

  var newOrder = this._superset.sortBy(this._comparator);
  this._collection.reset(this._reverse ? newOrder.reverse() : newOrder);
  this.length = this._collection.length;
}

function pipeEvents() {
  var args = _.toArray(arguments);

  // replace any references to `this._collection` with `this`
  for (var i = 1; i < args.length; i++) {
    // Is there a better way to check for this?
    // List all of the possible events?
    if (args[i].models && args[i].models.length === this._collection.models.length) {
      args[i] = this;
    }
  }

  this.trigger.apply(this, args);
}

function Sorted(superset) {
  // Save a reference to the original collection
  this._superset = superset;

  // The idea is to keep an internal backbone collection with the paginated
  // set, and expose limited functionality.
  this._collection = new Backbone.Collection(superset.toArray());
  this.length = this._collection.length;
  this._reverse = false;
  this._comparator = null;

  this.listenTo(this._superset, 'add', onAdd);
  this.listenTo(this._superset, 'remove', onRemove);
  this.listenTo(this._superset, 'change', onChange);
  this.listenTo(this._superset, 'reset', sort);
  this.listenTo(this._collection, 'all', pipeEvents);
}

var methods = {

  sortBy: function(comparator) {
    this._reverse = false;
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

  superset: function() {
    return this._superset;
  }

};

// Methods on `this._collection` we will expose to the outside world
var collectionMethods = [
  'toJSON', 'forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
  'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
  'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
  'max', 'min', 'groupBy', 'sortedIndex', 'shuffle', 'toArray', 'size',
  'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last',
  'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'chain', 'pluck',
  'findWhere', 'get', 'at', 'slice', 'where', 'findWhere'
];

_.each(collectionMethods, function(method) {
  methods[method] = function() {
    return Backbone.Collection.prototype[method].apply(this._collection, arguments);
  };
});

// Build up the prototype
_.extend(Sorted.prototype, methods, Backbone.Events);

return Sorted;

// ---------------------------------------------------------------------------
} if (typeof exports === 'object') {
  // node export
  module.exports = moduleDefinition(require('backbone'), require('underscore'));
} else if (typeof define === 'function' && define.amd) {
  // amd anonymous module registration
  define(['backbone', 'underscore'], moduleDefinition);
} else {
  // browser global
  root.SortedCollection = moduleDefinition(root.Backbone, root._);
}}(this));

