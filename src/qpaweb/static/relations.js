
var RelationList = function(quiver) {
  this.quiver = quiver;
  this.relations = [];
}



//Possibly my ugliest function ever.
var Relation = function(relstring, quiver) {
  var i;
  valid = true;

  relstring = relstring.replace(/\s+/g, "");
  var alfabet="abcdefghijklmnopqrstuvwxyz";
  alfabet = alfabet+alfabet.toUpperCase();
  alfabet+="0123456789";
  alfabet+="./";
  

  var ns = relstring.split(/([-+])/g);
  this.rel = ns;
  
  var parse = function(s) {
    if(/^[+-]$/.test(s)) {
      return s;
    } 

      
    var facs = s.split(/(\*)/g);

    for(var j = 0; j < facs.length;j++) {

  
      if(facs[j] == null) {return;}if(facs[j] == "*") {
        continue;
      }
      var tt = facs[j].split(/(\^)/g);

      var exp = null;
      
      var v = new RegExp("^[" + alfabet + "]+$");
     
      if(!v.test(tt[0])) {
        valid = false;
        return null;
      }
      
      if(tt.length > 3) {//more than one ^ sign
        valid = false;
        return null;
      } else if(tt.length == 3) {
        if(!/^\d+$/.test(tt[2])) {

          valid = false;
          return null;
        }
        facs[j] = tt;
        continue;
      } else if(tt.length != 1) {
        valid = false;
        return null;
      }
      facs[j] = tt[0];
    }

    return facs;
  }

  for(i=0; i < ns.length; i++) {
    ns[i] = parse(ns[i]);
    if(ns[i] == null) {break;}
  }
  this.ro = ns;
  this.valid = valid;
  console.log("w: " + ns);
  if(!valid) {return;}

  //now we replace the arrow names with arrow objects
  var states = {
    no: 1,
    arrow: 2,
    pow: 3,
    mult: 4,
  };
  var state = states.no;
  var lastArrow = null;
  var tarrow = null;
  var h = 0;
  
  for(i=0;i < ns.length;i++) {
    if(typeof ns[i] == "string") {
      lastArrow = null;
      continue;
    }
    
    for(var j = 0; j < ns[i].length;j++) {
      if(ns[i][j] == "*") {
        continue;
      }
      
      if(ns[i][j] instanceof Array) {
        ns[i][j][0] = quiver.items[ns[i][j][0]];
        tarrow = ns[i][j][0];
        if(tarrow.source != tarrow.target) {
          this.valid=false;
          return;
        }
        else {
          continue;
        }
      }
      else {
        if(/^\d+((\.|\/)\d+)?$/.test(ns[i][j])) {
          console.log("is a number: " + ns[i][j]);
          continue;
        }
        console.log("not a number: " + ns[i][j]);
        ns[i][j] = quiver.items[ns[i][j]];
        tarrow = ns[i][j];
      }
      if(tarrow === undefined || !(tarrow instanceof Arrow)) {
        this.valid=false;
        return;
      }

      if(lastArrow != null) {
        //do we have a continuous path?
        
        if(tarrow.source !== lastArrow.target) {
          this.valid = false;
          return;
        }
      }
      lastArrow = tarrow;
    }
  }

}


