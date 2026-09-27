import React, { useState } from 'react';
import './App.css';
import { EzineManager } from './model/EzineModel';

const managerInstance = new EzineManager();

function App() {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const [activityName, setActivityName] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedReporter, setSelectedReporter] = useState(null);
  const activities = managerInstance.getActivities();
  const reporters = managerInstance.getReporters();

  const handleAppendActivity = (e) => {
    e.preventDefault();
    if (activityName.trim() && activityDesc.trim()) {
      managerInstance.appendActivity(activityName.trim(), activityDesc.trim());
      setActivityName('');
      setActivityDesc('');
      refresh();
    }
  };

  const handlePromoteActivity = (act, e) => {
    e.stopPropagation();
    managerInstance.promoteActivity(act);
    refresh();
  };

  const handleRemoveActivity = (act, e) => {
    e.stopPropagation();
    managerInstance.removeActivity(act);
    if (selectedActivity === act) setSelectedActivity(null);
    refresh();
  };

  const handleAddReporter = (e) => {
    e.preventDefault();
    if (reporterName.trim()) {
      managerInstance.addReporter(reporterName.trim());
      setReporterName('');
      refresh();
    }
  };

  const handleRemoveReporter = (rep, e) => {
    e.stopPropagation();
    managerInstance.removeReporter(rep);
    if (selectedReporter === rep) setSelectedReporter(null);
    refresh();
  };

  const handleAssign = () => {
    if (selectedReporter && selectedActivity) {
      const success = managerInstance.assignReporter(selectedReporter, selectedActivity);
      if (success) {
        setSelectedReporter(null);
        setSelectedActivity(null);
        refresh();
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Ezine Editor Dashboard</h1>
      </header>

      <div className="layout-grid">
        {/* Activities Panel */}
        <section className="panel" aria-label="Activities Section">
          <h2>Ordered Activities Queue</h2>

          {/* Append Activity (UC 1) */}
          <form className="form-row" onSubmit={handleAppendActivity}>
            <input
              type="text"
              placeholder="Activity Name / ID"
              aria-label="Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              aria-label="Activity Description"
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
            />
            <button type="submit">Append</button>
          </form>

          <ul className="item-list" data-testid="activity-list">
            {activities.map((act, index) => {
              const isAssigned = act.isAssigned();
              const isSelected = selectedActivity === act;
              return (
                <li
                  key={`${act.getShortName()}-${index}`}
                  className={`item-card ${isAssigned ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isAssigned && setSelectedActivity(act === selectedActivity ? null : act)}
                  data-testid={`activity-item-${index}`}
                >
                  <div className="item-info">
                    <span className="item-title">{index + 1}. {act.getShortName()}</span>
                    <span className="item-subtext">{act.getDescription()}</span>
                    {isAssigned ? (
                      <span className="badge badge-assigned">
                        Assigned to: {act.getAssignedReporter().getName()}
                      </span>
                    ) : (
                      <span className="badge badge-open">Unassigned</span>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      title="Promote to first spot"
                      onClick={(e) => handlePromoteActivity(act, e)}
                    >
                      Promote
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      disabled={isAssigned}
                      title={isAssigned ? "Cannot remove an assigned activity" : "Remove"}
                      onClick={(e) => handleRemoveActivity(act, e)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Reporter Roster Panel */}
        <section className="panel" aria-label="Reporters Section">
          <h2>Reporter Roster</h2>

          {/* Add Reporter (UC 4) */}
          <form className="form-row" onSubmit={handleAddReporter}>
            <input
              type="text"
              placeholder="Reporter Name"
              aria-label="Reporter Name Input"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />
            <button type="submit">Add Reporter</button>
          </form>

          <ul className="item-list" data-testid="reporter-list">
            {reporters.map((rep, index) => {
              const isAssigned = rep.isAssigned();
              const isSelected = selectedReporter === rep;
              return (
                <li
                  key={`${rep.getName()}-${index}`}
                  className={`item-card ${isAssigned ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isAssigned && setSelectedReporter(rep === selectedReporter ? null : rep)}
                  data-testid={`reporter-item-${index}`}
                >
                  <div className="item-info">
                    <span className="item-title">{rep.getName()}</span>
                    {isAssigned ? (
                      <span className="badge badge-assigned">
                        Assigned: {rep.getAssignedActivity().getShortName()}
                      </span>
                    ) : (
                      <span className="badge badge-open">Available</span>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="btn-danger"
                      disabled={isAssigned}
                      title={isAssigned ? "Assigned reporters cannot be removed" : "Remove"}
                      onClick={(e) => handleRemoveReporter(rep, e)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Assign Reporter Action Bar (UC 6) */}
      <footer className="action-bar">
        <div className="selection-summary">
          <strong>Active Assignment Pairing:</strong>{' '}
          Reporter: <em>{selectedReporter ? selectedReporter.getName() : 'None Selected'}</em>{' '}
          ➔ Activity: <em>{selectedActivity ? selectedActivity.getShortName() : 'None Selected'}</em>
        </div>
        <button
          type="button"
          disabled={!selectedReporter || !selectedActivity}
          onClick={handleAssign}
        >
          Execute Assignment
        </button>
      </footer>
    </div>
  );
}

export default App;