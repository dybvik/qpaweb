
var RelationList = function(quiver) {
  this.quiver = quiver;
}
//Possibly my ugliest function ever.
var Relation = function(relstring, quiver) {
  var i;
  valid = true;


  var alfabet="abcdefghijklmnopqrstuvwxyz";
  alfabet = alfabet+alfabet.toUpperCase();
  alfabet+="0123456789";
  

  var ns = relstring.split(/([-+])/g);

  
  var parse = function(s) {
    if(/^[+-]$/.test(s)) {
      return svar tt = val.split(/^/g);
      if(tt.length > 2) {//more than one ^ sign
        valid = false;
        return null;
      }; else if(tt.length == 2) {
        
      }
    }
    var facs = s.split(/(\*)/g);

    for(var j = 0; j < facs.length;j++) {

  
      if(list[index] == null) {return;}if(facs[j] == "*") {
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
    for(var j = 0; j < ns[i].length;i++) {
      if(ns[i][j\\] == "*") {
        continue;
      }
      if(ns[i][j] instanceof Array) {
        ns[i][j][0] = quiver.items[ns[i][j][0]];
        tarrow = ns[i][j][0];
      }
      else {
        ns[i][j] = quiver.items[ns[i][j]];
        tarrow = ns[i][j];
      }
      if(tarrow === undefined) {
        this.valid=false;
        return;
      }
      if(lastArrow != null) {
        //do we have a continuous path?
        this.valid=false;
        for(h = 0; h < lastArrow.target.arrows.length;h++) {
          if(lastArrow.target.arrows[h].source == lastArrow && lastArrow.target.arrows[h].target == tarrow) {
            this.valid = true;
          }
        }
        if(!this.valid) {
          return;
        }
        lastArrow = tarrow;
      }
    }
  }
}


