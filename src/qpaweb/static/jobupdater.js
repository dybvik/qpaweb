
var Updater = function(joblist) {
  var that = this;
  this.num_waiting;
  this.waitTime = 1;
  this.joblist = joblist;
  this.timer = null;

  $(this.joblist).on("job_add", function(ev,job) {
    $(job).on("status_change", function(e2, oldStatus) {
      if(oldStatus == status.WAITING && job.status != status.WAITING) {
        that.num_waiting--;
        if(that.num_waiting >= 0) {
          that.num_waiting = 0;
          if(that.timer) {
            clearTimeout(that.timer);
          }
        }
      } else if(job.status == status.WAITING) {
        that.waitTime = 1000;
        that.poll();
      }
    });
  });
};

Updater.prototype.poll = function() {
  var that = this;
  $.ajax("http://158.38.57.12:1882/jobs", {
    type:"GET",
    crossDomain: true,
    success: function(data,status) {
      var jobs_done = JSON.parse(data).jobs_done;
      console.log(jobs_done);
      console.log("HEI");
      _.each(that.joblist.jobs, function(val,key,list) {
        console.log("H: " + val.status + "==" + status.WAITING + ": " +  val.status == status.WAITING);
        if(val.status === status.WAITING && jobs_done.indexOf(val.id) >= 0) {
          console.log("ROCKET");
          $.ajax("http://158.38.57.12:1882/jobs/" + val.id, {
            type:"GET",
            crossDomain: true,
            success: function(data2, status2) {
              console.log("DATA" + data2);
            },
          });
        }
      });

  }});
  setTimeout(function() {that.poll()}, this.waitTime);
  if(this.waitTime < 64000) {
    this.waitTime*=2;
  }
}
