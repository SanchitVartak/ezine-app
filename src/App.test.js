import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { EzineManager, Activity, Reporter } from './model/EzineModel';

describe('Ezine Application Rubric Verification Suite', () => {
  test('Complete rubric workflow evaluation', () => {
    render(<App />);

    // 1. Confirm application runs and presents dashboard visually
    expect(screen.getByText(/Ezine Editor Dashboard/i)).toBeInTheDocument();
    const activityNameInput = screen.getByLabelText(/Activity Name/i);
    const activityDescInput = screen.getByLabelText(/Activity Description/i);
    const appendBtn = screen.getByRole('button', { name: /Append/i });

    const reporterNameInput = screen.getByLabelText(/Reporter Name Input/i);
    const addReporterBtn = screen.getByRole('button', { name: /Add Reporter/i });

    const activityList = screen.getByTestId('activity-list');
    const reporterList = screen.getByTestId('reporter-list');

    // 2. Manager can add three reporters (Alice, Bob, and Charlie)
    ['Alice', 'Bob', 'Charlie'].forEach((name) => {
      fireEvent.change(reporterNameInput, { target: { value: name } });
      fireEvent.click(addReporterBtn);
    });

    // 3. Manager can add three activities (Hiking, Climb Mountain), (Dining, Try New Restaurant), (Summer, Visit Beach)
    const initialActivities = [
      { name: 'Hiking', desc: 'Climb Mountain' },
      { name: 'Dining', desc: 'Try New Restaurant' },
      { name: 'Summer', desc: 'Visit Beach' },
    ];
    initialActivities.forEach(({ name, desc }) => {
      fireEvent.change(activityNameInput, { target: { value: name } });
      fireEvent.change(activityDescInput, { target: { value: desc } });
      fireEvent.click(appendBtn);
    });

    // 4. Confirm that application GUI shows activities in proper order
    expect(screen.getByTestId('activity-item-0')).toHaveTextContent('Hiking');
    expect(screen.getByTestId('activity-item-1')).toHaveTextContent('Dining');
    expect(screen.getByTestId('activity-item-2')).toHaveTextContent('Summer');

    // 5. Confirm that application GUI shows list of reporters
    expect(within(reporterList).getByText('Alice')).toBeInTheDocument();
    expect(within(reporterList).getByText('Bob')).toBeInTheDocument();
    expect(within(reporterList).getByText('Charlie')).toBeInTheDocument();

    // 6. Manager can assign Alice to the Dining activity
    fireEvent.click(within(reporterList).getByText('Alice'));
    fireEvent.click(within(activityList).getByText(/Dining/));
    fireEvent.click(screen.getByRole('button', { name: /Execute Assignment/i }));

    // 7. Confirm that editor cannot remove Dining activity
    const diningItem = within(activityList).getByText(/Dining/).closest('li');
    const diningRemoveBtn = diningItem.querySelector('.btn-danger');
    expect(diningRemoveBtn).toBeDisabled();

    // 8. Confirm that editor cannot remove Alice from list of reporters
    const aliceItem = within(reporterList).getByText('Alice').closest('li');
    const aliceRemoveBtn = aliceItem.querySelector('.btn-danger');
    expect(aliceRemoveBtn).toBeDisabled();

    // 9. Create new activity (Movie, Odyssey)
    fireEvent.change(activityNameInput, { target: { value: 'Movie' } });
    fireEvent.change(activityDescInput, { target: { value: 'Odyssey' } });
    fireEvent.click(appendBtn);

    // 10. Confirm that application GUI shows (Movie, Odyssey) as the last activity in ordered list
    expect(screen.getByTestId('activity-item-3')).toHaveTextContent('Movie');

    // 11. Editor can remove Charlie as a reporter
    const charlieItem = within(reporterList).getByText('Charlie').closest('li');
    const charlieRemoveBtn = charlieItem.querySelector('.btn-danger');
    fireEvent.click(charlieRemoveBtn);

    // 12. Confirm that only Alice and Bob remain as reporter
    expect(within(reporterList).queryByText('Charlie')).not.toBeInTheDocument();
    expect(within(reporterList).getByText('Alice')).toBeInTheDocument();
    expect(within(reporterList).getByText('Bob')).toBeInTheDocument();

    // 13. Editor can remove (Summer, Visit Beach) activity
    const summerItem = within(activityList).getByText(/Summer/).closest('li');
    const summerRemoveBtn = summerItem.querySelector('.btn-danger');
    fireEvent.click(summerRemoveBtn);

    // 14. Confirm GUI shows (Movie, Odyssey) is now #3 on the list and first two are unchanged
    expect(screen.getByTestId('activity-item-0')).toHaveTextContent('Hiking');
    expect(screen.getByTestId('activity-item-1')).toHaveTextContent('Dining');
    expect(screen.getByTestId('activity-item-2')).toHaveTextContent('Movie');

    // 15. Editor can promote (Movie, Odyssey) to be #1
    const movieItem = within(activityList).getByText(/Movie/).closest('li');
    const moviePromoteBtn = movieItem.querySelector('.btn-secondary');
    fireEvent.click(moviePromoteBtn);

    // 16. Confirm that application GUI shows activities as (Movie, Hiking, Dining) in that order
    expect(screen.getByTestId('activity-item-0')).toHaveTextContent('Movie');
    expect(screen.getByTestId('activity-item-1')).toHaveTextContent('Hiking');
    expect(screen.getByTestId('activity-item-2')).toHaveTextContent('Dining');

    // 17. Editor can assign Bob to the Hiking activity
    fireEvent.click(within(reporterList).getByText('Bob'));
    fireEvent.click(within(activityList).getByText(/Hiking/));
    fireEvent.click(screen.getByRole('button', { name: /Execute Assignment/i }));

    // 18. Confirm that editor cannot remove Bob from list of reporters
    const bobItem = within(reporterList).getByText('Bob').closest('li');
    const bobRemoveBtn = bobItem.querySelector('.btn-danger');
    expect(bobRemoveBtn).toBeDisabled();

    // 19. Editor can remove (Movie, Odyssey) from activities list
    const currentMovieItem = within(activityList).getByText(/Movie/).closest('li');
    const currentMovieRemoveBtn = currentMovieItem.querySelector('.btn-danger');
    expect(currentMovieRemoveBtn).not.toBeDisabled();
    fireEvent.click(currentMovieRemoveBtn);

    // 20. Confirm that application GUI shows two activities
    expect(within(activityList).queryByText(/Movie/)).not.toBeInTheDocument();
    expect(screen.getByTestId('activity-item-0')).toHaveTextContent('Hiking');
    expect(screen.getByTestId('activity-item-1')).toHaveTextContent('Dining');
  });

  test('UI edge cases: unselecting, blank forms, and assigned clicks', () => {
    render(<App />);
    const activityNameInput = screen.getByLabelText(/Activity Name/i);
    const activityDescInput = screen.getByLabelText(/Activity Description/i);
    const appendBtn = screen.getByRole('button', { name: /Append/i });
    const reporterNameInput = screen.getByLabelText(/Reporter Name Input/i);
    const addReporterBtn = screen.getByRole('button', { name: /Add Reporter/i });

    // Submit empty forms
    fireEvent.change(activityNameInput, { target: { value: '   ' } });
    fireEvent.change(activityDescInput, { target: { value: '' } });
    fireEvent.click(appendBtn);

    fireEvent.change(reporterNameInput, { target: { value: '   ' } });
    fireEvent.click(addReporterBtn);

    // Add a valid item and toggle selection
    fireEvent.change(reporterNameInput, { target: { value: 'Delta' } });
    fireEvent.click(addReporterBtn);
    const repDelta = screen.getByText('Delta');
    fireEvent.click(repDelta);
    fireEvent.click(repDelta);

    fireEvent.change(activityNameInput, { target: { value: 'TaskX' } });
    fireEvent.change(activityDescInput, { target: { value: 'DescX' } });
    fireEvent.click(appendBtn);
    const actX = screen.getByText(/TaskX/);
    fireEvent.click(actX);
    fireEvent.click(actX);

    // Remove while selected
    fireEvent.click(actX);
    const actItem = actX.closest('li');
    fireEvent.click(actItem.querySelector('.btn-danger'));

    fireEvent.click(repDelta);
    const repItem = repDelta.closest('li');
    fireEvent.click(repItem.querySelector('.btn-danger'));
  });

  test('Model unit tests: full domain invariant and branch coverage', () => {
    const mgr = new EzineManager();

    // UC 1 null/empty guards
    expect(mgr.appendActivity('', 'desc')).toBeNull();
    expect(mgr.appendActivity('name', '')).toBeNull();
    const a1 = mgr.appendActivity('Act1', 'Desc1');
    const a2 = mgr.appendActivity('Act2', 'Desc2');

    // UC 4 null/empty guards
    expect(mgr.addReporter('')).toBeNull();
    const r1 = mgr.addReporter('Rep1');
    const r2 = mgr.addReporter('Rep2');

    // Entity getters
    expect(a1.getShortName()).toBe('Act1');
    expect(a1.getDescription()).toBe('Desc1');
    expect(a1.getAssignedReporter()).toBeNull();
    expect(r1.getName()).toBe('Rep1');
    expect(r1.getAssignedActivity()).toBeNull();

    // UC 2 promote guard
    expect(mgr.promoteActivity(a1)).toBe(false);
    expect(mgr.promoteActivity(a2)).toBe(true);

    // UC 6 invariant checks
    expect(mgr.assignReporter(null, a1)).toBe(false);
    expect(mgr.assignReporter(r1, null)).toBe(false);

    const foreignReporter = new Reporter('Ghost');
    const foreignActivity = new Activity('Ghost', 'Ghost');
    expect(mgr.assignReporter(foreignReporter, a1)).toBe(false);
    expect(mgr.assignReporter(r1, foreignActivity)).toBe(false);

    // Valid assignment
    expect(mgr.assignReporter(r1, a1)).toBe(true);
    // Double assignment guard
    expect(mgr.assignReporter(r1, a2)).toBe(false);
    expect(r1.assignTo(a2)).toBe(false);
    expect(mgr.assignReporter(r2, a1)).toBe(false);

    // UC 3 & UC 5 locked removals
    expect(mgr.removeActivity(a1)).toBe(false);
    expect(mgr.removeReporter(r1)).toBe(false);
    expect(mgr.removeActivity(null)).toBe(false);
    expect(mgr.removeReporter(null)).toBe(false);
    expect(mgr.removeActivity(foreignActivity)).toBe(false);
    expect(mgr.removeReporter(foreignReporter)).toBe(false);

    // Valid unassigned removals
    expect(mgr.removeActivity(a2)).toBe(true);
    expect(mgr.removeReporter(r2)).toBe(true);
  });
});