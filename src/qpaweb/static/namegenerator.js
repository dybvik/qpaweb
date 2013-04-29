//TODO: clean up!
var AlfabetNameGenerator = function(quiver, uppercase) {
  
  this.quiver = quiver;
  if(uppercase === undefined) {
    this.uppercase = false;
  } else { this.uppercase == uppercase; }


  this.alfabet = "abcdefghijklmnopqrstuvwxyz".split("");
  
}

AlfabetNameGenerator.prototype.next = function() {
  //Optimize this later
  var i;
  //if(this.uppercase) { this.alfabet = this.alfabet.toUpperCase(); }


  var nextName = null;
  var n = 0;
  while(n < this.alfabet.length) {
    if(this.quiver.items[this.alfabet[n]] === undefined) {
      nextName = this.alfabet[n];
      break;
    }
    n++;
  }
 
  if(nextName == null) {
    var n = 1;
    while(this.quiver.items[(this.alfabet[this.alfabet.length-1] + n)] != undefined) {
      n++;
    }
    nextName = this.alfabet[this.alfabet.length-1] + n;
  }
  return nextName;
}

var NumberNameGenerator = function(quiver) {
  this.quiver = quiver;
}

NumberNameGenerator.prototype.next = function() {
  var nextName = null;
  var n = 0;
  while(nextName === null) {
    if(this.quiver.items[n] === undefined) {
      nextName = n.toString();
    }
    n++;
  }
  return nextName;
}

var SingleCharNumberNameGenerator = function(quiver, prefix) {
    this.quiver = quiver;
    this.prefix = prefix;
}

SingleCharNumberNameGenerator.prototype.next = function() {
    var nextName = null;
    var n = 0;
    while(nextName === null) {
        if(this.quiver.items[this.prefix+n] === undefined) {
            nextName = n.toString();
        }
        n++;
    }
    return this.prefix+nextName;
}

var GreekAlfabetNameGenerator = function(quiver) {
  AlfabetNameGenerator.call(this, quiver, false);
  this.alfabet = "\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03D1\u03B9	\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03D6\u03C1\u03C2\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9";
}




