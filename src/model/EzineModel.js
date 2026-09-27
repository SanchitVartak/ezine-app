export class Activity {
  constructor(shortName, description) {
    this.shortName = shortName;
    this.description = description;
    this.assignedReporter = null;
  }

  getShortName() {
    return this.shortName;
  }
  getDescription() {
    return this.description;
  }

  getAssignedReporter() {
    return this.assignedReporter;
  }
  setAssignedReporter(reporter) {
    this.assignedReporter = reporter;
  }

  isAssigned() {
    return this.assignedReporter !== null;
  }
}

export class Reporter {
  constructor(name) {
    this.name = name;
    this.assignedActivity = null;
  }

  getName() {
    return this.name;
  }
  getAssignedActivity() {
    return this.assignedActivity;
  }
  assignTo(activity) {
    if (this.isAssigned()) {
      return false;
    }
    this.assignedActivity = activity;
    return true;
  }

  isAssigned() {
    return this.assignedActivity !== null;
  }
}

export class EzineManager {
  constructor() {
    this.activities = [];
    this.reporters = [];
  }

  //UC 1
  appendActivity(shortName, description) {
    if (!shortName || !description) return null;
    const activity = new Activity(shortName, description);
    this.activities.push(activity);
    return activity;
  }

  //UC2
  promoteActivity(activity) {
    const index = this.activities.indexOf(activity);
    if (index > 0) {
      this.activities.splice(index, 1);
      this.activities.unshift(activity);
      return true;
    }
    return false;
  }

  //UC3
  removeActivity(activity) {
    if (!activity || activity.isAssigned()) {
      return false;
    }
    const index = this.activities.indexOf(activity);
    if (index !== -1) {
      this.activities.splice(index, 1);
      return true;
    }
    return false;
  }

  //UC4
  addReporter(name) {
    if (!name) return null;
    const reporter = new Reporter(name);
    this.reporters.push(reporter);
    return reporter;
  }

  //UC5
  removeReporter(reporter) {
    if (!reporter || reporter.isAssigned()) {
      return false;
    }
    const index = this.reporters.indexOf(reporter);
    if (index !== -1) {
      this.reporters.splice(index, 1);
      return true;
    }
    return false;
  }

  //UC6
  assignReporter(reporter, activity) {
    if (!reporter || !activity) return false;
    if (reporter.isAssigned() || activity.isAssigned()) return false;
    if (!this.reporters.includes(reporter) || !this.activities.includes(activity)) return false;

    reporter.assignTo(activity);
    activity.setAssignedReporter(reporter);
    return true;
  }

  getActivities() {
    return this.activities;
  }
  getReporters() {
    return this.reporters;
  }
}