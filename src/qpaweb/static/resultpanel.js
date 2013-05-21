
var ResultPanel = function(element, joblist) {
  this.joblist = joblist;
  var that = this;
  this.element = element;

  $(this.jobs).on("job_add.resultpanel", function(ev) {
    that.rebuildList();
  });
}

ResultPanel.prototype.rebuildList() {
  var done = [];
  var waiting = [];
  _.each(this.joblist.jobs, function(val,key,list) {
    if(val.status == status.WAITING) {
      waiting.push(val);
    } else {
      done.push(val);
    }
  });
  done.sort(function(a,b){return a.time_done-b.time_done;});
  waiting.sort(function(a,b){return a.time_start-b.time_start;});
  };
};
