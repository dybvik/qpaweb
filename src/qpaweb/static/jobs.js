
var status = {DONE: 1, FAIL: 2, WAITING: 3, TIMEDOUT: 4}

var Job = function(data) {
  this.status = 0;
  this.data = data;
  this.id = 0;
  this.time_start = Date.now;
  this.w = 5;
}

Job.prototype.setStatus = function(newstatus) {
  var oldstatus = this.status;
  this.status = newstatus;
  $(this).trigger("status_change", oldstatus);
}

var JobList = function() {
  this.jobs = {};
};

JobList.prototype.add = function(job) {
  this.jobs[job.id] = job;
  $(this).trigger("job_add",job);
  this.jobs[job.id].setStatus(status.WAITING);
};
