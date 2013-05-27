

/**
 * @classdesc A job, sent to a server for processing.
 * @constructor
 * @param data The job in the form of a JavaScript object
 */
var Job = function(data) {
  this.status = 0;
  this.data = data;
  this.id = 0;
  this.time_start = Date.now();
  this.command = data["command"];
  this.w = 5;
}
Job.Status = {DONE: 1, WAITING: 3};



Job.prototype.setStatus = function(newstatus) {
  var oldstatus = this.status;
  this.status = newstatus;

  $(this).trigger("status_change", [oldstatus]);
}

/**
 * @classdesc A list of jobs
 * @constructor
 */
var JobList = function() {
  this.jobs = {};
};

JobList.prototype.add = function(job) {
  this.jobs[job.id] = job;
  $(this).trigger("job_add", [job]);
  this.jobs[job.id].setStatus(Job.Status.WAITING);
};
