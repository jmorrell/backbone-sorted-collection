/*! backbone-sorted-collection */
;(function (root) { function moduleDefinition(Backbone, _) {



function Sorted(superset) {
  // Save a reference to the original collection
  this._superset = superset;

  // The idea is to keep an internal backbone collection with the paginated
  // set, and expose limited functionality.
  this._collection = new Backbone.Collection(superset.toArray());

  // A drawback is that we will have to update the length ourselves
  // every time we modify this collection.
  this.length = this._collection.length;
}

var methods = {

  sortBy: function(comparator) {

  },

  reverseSort: function() {

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

