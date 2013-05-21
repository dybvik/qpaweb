
var Updater = function(joblist) {
  var that = this;
  this.num_waiting = 0;
  this.joblist = joblist;
  this.timer = null;

  $(this.joblist).on("job_add", function(ev,job) {
    $(job).on("status_change", function(e2, oldStatus) {
      console.log("STATS: " + oldStatus+ " - " + job.status);
      if(oldStatus == Job.Status.WAITING && job.status != Job.Status.WAITING) {
        console.log("JAUJAU");
        that.num_waiting--;
        if(that.num_waiting <= 0) {
          that.num_waiting = 0;
          if(that.timer) {
            clearTimeout(that.timer);
            that.timer = null;
          }
        }
      } else if(job.status == Job.Status.WAITING) {
        that.num_waiting++;
        console.log("POLL ON STAT");
        that.waitTime = 1000;
        that.timer = -1;
        that.poll();
      }
    });
  });
};

Updater.prototype.poll = function() {
  var that = this;
  console.log("POLL");
  $.ajax("http://158.38.57.12:1882/jobs", {
    type:"GET",
    crossDomain: true,
    success: function(data) {
      console.log("SKEL");
      var jobs_done = JSON.parse(data).jobs_done;
      _.each(that.joblist.jobs, function(val,key,list) {

        if(val.status === Job.Status.WAITING && jobs_done.indexOf(val.id) >= 0) {
          console.log("MID " + val.id);
          $.ajax("http://158.38.57.12:1882/jobs/" + val.id, {
            type:"GET",
            crossDomain: true,
            success: function(data2, status2) {
              val.result = JSON.parse(data2)["result"];

              val.setStatus(Job.Status.DONE);

            },
          });
        }
      });
      if(that.waitTime < 64000) {
        that.waitTime*=2;
      }
      if(that.timer) {
        clearTimeout(that.timer);
        that.timer = null;
        that.timer = setTimeout(function() {that.poll()}, that.waitTime);
      }
  }});
  
  
}
