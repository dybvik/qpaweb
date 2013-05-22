
var ResultPanel = function(element, joblist) {
  this.joblist = joblist;
  var that = this;
  console.log($(element).val());
  this.element = element;

  $(this.joblist).on("job_add", function(ev, job) {
    that.rebuildList();
    $(job).on("status_change", function(ev) {
       that.rebuildList();
    });
  });
 
}

ResultPanel.prototype.rebuildList = function() {
  var that = this;
  console.log("REREBUILD");
  var done = [];
  var waiting = [];
  _.each(this.joblist.jobs, function(val,key,list) {
    if(val.status == Job.Status.WAITING) {
      waiting.push(val);
    } else if(val.status == Job.Status.DONE) {
      done.push(val);
    }
  });
  done.sort(function(a,b){return b.time_start-a.time_start;});
  waiting.sort(function(a,b){return b.time_start-a.time_start;});
  $(that.element).val("");
  console.log("NUM DONE: "+ done.length);
  _.each(done, function(job) {

    var date = new Date(job.time_start);
   $(that.element).val("<" + $(that.element).val() + date.toLocaleString()+"> " + job.command + ": " + job.result+"\n");
  });
};

