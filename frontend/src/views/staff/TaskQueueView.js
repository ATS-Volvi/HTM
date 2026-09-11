import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderTaskQueueView(state) {
  const selectedCat = state.selectedTaskCat || 'All';
  const categories = ['All', 'Housekeeping', 'Maintenance', 'Dining'];

  let tasks = state.tasks;
  if (selectedCat !== 'All') {
    tasks = tasks.filter(t => t.category === selectedCat);
  }

  const urgentCount = state.tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Live Hotel Dispatch</div>
          <h2 class="display-title" style="font-size: 24px;">Task Queue</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge ${urgentCount > 0 ? 'badge-dirty' : 'badge-clean'}" style="font-size: 10px;">
            ${urgentCount} Urgent Tickets
          </span>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills-row">
        ${categories.map(cat => `
          <button class="category-pill task-cat-pill ${cat === selectedCat ? 'active' : ''}" data-cat="${cat}" style="font-size: 11px; padding: 6px 14px;">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Task List -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${tasks.map(task => {
          const isUrgent = task.priority === 'Urgent';
          const isHigh = task.priority === 'High';
          const isCompleted = task.status === 'Completed';
          const isInProgress = task.status === 'In Progress';

          return `
            <div class="glass-card" style="padding: 16px; border-left: 4px solid ${
              isCompleted ? 'var(--success)' :
              isUrgent ? 'var(--error)' :
              isHigh ? 'var(--warning)' : 'var(--primary)'
            }; opacity: ${isCompleted ? '0.7' : '1'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="badge ${isUrgent ? 'badge-dirty' : isHigh ? 'badge-gold' : 'badge-inspected'}" style="font-size: 9px;">
                    ${task.priority}
                  </span>
                  <span class="badge badge-vip" style="font-size: 9px;">Room ${task.room}</span>
                </div>
                <span style="font-size: 11px; color: var(--on-surface-variant); font-weight: 600;">
                  Due: ${task.timeDue}
                </span>
              </div>

              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                ${task.title}
              </h4>
              <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 10px;">
                ${task.details}
              </p>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                <div style="font-size: 11px; color: var(--outline);">
                  Assignee: <strong style="color: var(--primary);">${task.assignee}</strong>
                </div>

                <div style="display: flex; gap: 6px;">
                  ${!isCompleted ? `
                    ${!isInProgress ? `
                      <button class="btn-secondary start-task-btn" data-id="${task.id}" style="padding: 4px 10px; font-size: 11px;">
                        Start Task
                      </button>
                    ` : ''}
                    <button class="btn-primary complete-task-btn" data-id="${task.id}" style="padding: 4px 12px; font-size: 11px; background: #2e7d32;">
                      ✓ Complete
                    </button>
                  ` : `
                    <span class="badge badge-clean" style="font-size: 10px;">Done</span>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindTaskQueueEvents() {
  const catPills = document.querySelectorAll('.task-cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      store.state.selectedTaskCat = pill.dataset.cat;
      store.notify();
    });
  });

  const startBtns = document.querySelectorAll('.start-task-btn');
  startBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.updateTaskStatus(id, 'In Progress');
      showToast('Task In Progress', `Task #${id} moved to In Progress`, 'hourglass_top');
    });
  });

  const completeBtns = document.querySelectorAll('.complete-task-btn');
  completeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.updateTaskStatus(id, 'Completed');
      showToast('Task Completed', `Task #${id} marked as completed and logged to handover.`, 'check_circle');
    });
  });
}
