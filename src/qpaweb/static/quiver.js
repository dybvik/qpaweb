/**
 * 
 * @constructor
 * @classdesc An object with a name
 */
var NamedObject = function(name) {
  this._name = name;
}

NamedObject.prototype = {
  /**
   * The objects name.
   * @member
   * @fires change_name
   */
  get name() {
    return this._name;
  },
  set name(name) {
    var oldName = this._name;
    this._name = name;
    $(this).trigger("change_name", [oldName]);
  },
};


/**
 * Creates an instance of Quiver
 *
 * @constructor
 * @class
 *
 */
var Quiver = function() {
  this.items = {};
}



/**
 * Adds an item to the canvas.
 * Name conflicts result in overwrite of existing item.
 *
 * @param {Arrow|Vertex} item
 */
Quiver.prototype.add = function(item) {
  if(typeof item.type == "undefined" || item._quiver == this || this._types.indexOf(item.type) == -1) {
    return;
  }
  
  item._quiver = this;
  this.items[item.name]=item;
  $(item).on("change_name.Quiver", function(ev, oldName) {
    item._quiver.items[item.getName()]=item;
    delete item._quiver.items[oldName];
  });
  $(this).trigger("add_item", [item]);
  return true;
}

Quiver.prototype._types = ["arrow", "vertex"];

Quiver.prototype.remove = function(item) {
  if(typeof item.type == "undefined" || this._types.indexOf(item.type) == -1 || item._quiver != this) {
    return;
  }
  delete item._quiver;
  delete this.items[item.name];
  $(this).trigger("remove_item", [item]);
}

/**
 * Creates an arrow between two vertices. To create a loop pass the same source and target.
 *
 * @constructor
 * @class
 * @this {Arrow}
 * @param {String} name
 * @param {Vertex} source
 * @param {Vertex} target
 */
var Arrow = function(name, source, target) {
  NamedObject.call(this, name);
  this.name = name;
  this.source = source;
  this.target = target;
  this.type = "arrow";
  this._quiver = null;
  source.arrows.push(this);
  if(source != target) { target.arrows.push(this); }
}
Arrow.prototype = Object.create(NamedObject.prototype);


/**
 * 
 *
 * @constructor
 * @param {String} name Vertex name. Must be unique in quiver.
 * @param {int} x X coordinate of vertex
 * @param {int} y Y coordinate of vertex
 */
var Vertex = function(name, x ,y) {
  NamedObject.call(this, name);
  this.name = name;
  this.type = "vertex";
  this._quiver = null;
  this.arrows = [];
  this.x = x;
  this.y = y;
}
Vertex.prototype = Object.create(NamedObject.prototype);

Vertex.prototype.addArrow = function(arrow) {
  if(this._quiver != null) {
    this._quiver.add(arrow);
  }
  this.arrows.push(arrow);
}
