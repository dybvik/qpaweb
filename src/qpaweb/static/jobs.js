


var Job = function(data) {
  this.status = 0;
  this.data = data;
  this.id = 0;
  this.time_start = Date.now();
  this.command = data["command"];
  this.w = 5;
}
Job.Status = {DONE: 1, WAITING: 3};
console.log(Job.Status.DONE);


Job.prototype.setStatus = function(newstatus) {
  var oldstatus = this.status;
  this.status = newstatus;
  console.log("NEWS: "+ this.status);
  $(this).trigger("status_change", [oldstatus]);
}

var JobList = function() {
  this.jobs = {};
};

JobList.prototype.add = function(job) {
  this.jobs[job.id] = job;
  $(this).trigger("job_add", [job]);
  this.jobs[job.id].setStatus(Job.Status.WAITING);
};
