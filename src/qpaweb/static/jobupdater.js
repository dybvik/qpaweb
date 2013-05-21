
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
        that.waitTime = 1;
        that.poll();
      }
    });
    job.setStatus(status.WAITING);
  });
};

Updater.prototype.poll() {
  var that = this;
  $.ajax("http://158.38.57.12:1882/jobs", {
    type:"GET",
    crossDomain: true,
    success: function(data,status) {
      jobs_done = data.jobs_done;
      _.each(that.joblist.jobs, function(val,key,list) {
        if(val.status == status.WAITING && _.contains(jobs_done, val.id)) {
          $.ajax("http://158.38.57.12:1882/jobs/" + val.id, {
            type:"GET",
            crossDomain: true,
            success: function(data2, status2) {
              console.log(data);
            },
          });
        }
      });

  }});
  setTimeout(this.poll, this.waitTime);
  if(this.waitTime < 64) {
    this.waitTime*=2;
  }
}
