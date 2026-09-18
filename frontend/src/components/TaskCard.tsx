import { formatDate, isOverdue, isDueToday } from '../utils/date';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isToggling?: boolean;
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isToggling = false,
}: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.completed);
  const dueToday = isDueToday(task.dueDate) && !task.completed;

  return (
    <article
      className={`task-card ${task.completed ? 'completed' : ''} ${overdue ? 'task-overdue' : ''}`}
      data-task-id={task.id}
    >
      <div className="task-topline">
        <div className="task-title-group">
          <div className="task-title-row">
            <label className="checkbox-container" title={task.completed ? 'Mark pending' : 'Mark complete'}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                disabled={isToggling}
                aria-label={`Mark task ${task.title} as ${task.completed ? 'pending' : 'completed'}`}
              />
              <span className="checkmark" />
            </label>
            <h3 className="task-heading">{task.title}</h3>
          </div>

          <div className="task-tags">
            {task.category && <span className="chip category-chip">{task.category}</span>}
            {task.completed && <span className="chip completed-chip">✓ COMPLETED</span>}
            {overdue && <span className="chip overdue-chip">⚠ OVERDUE</span>}
            {dueToday && <span className="chip today-chip">📅 DUE TODAY</span>}
          </div>
        </div>

        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority} PRIORITY
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`meta-due ${overdue ? 'text-danger' : dueToday ? 'text-warning' : ''}`}>
          <strong>Due:</strong> {formatDate(task.dueDate)}
        </span>
        <span className="meta-created">
          <strong>Created:</strong> {formatDate(task.createdAt)}
        </span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className={`toggle-button ${task.completed ? 'undo-button' : 'complete-button'}`}
          onClick={() => onToggle(task.id)}
          disabled={isToggling}
        >
          {isToggling ? 'Updating...' : task.completed ? '↩ Undo' : '✓ Mark Complete'}
        </button>

        <button
          type="button"
          className="ghost-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
