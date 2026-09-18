import { useState, useEffect } from 'react';
import type { Priority, Task } from '../types';
import { toInputDateFormat } from '../utils/date';

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  category: string;
}

interface TaskFormProps {
  initialTask?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const COMMON_CATEGORIES = [
  'Academic',
  'Assignment',
  'Project',
  'Exam Prep',
  'Lab Work',
  'Personal',
  'Admin',
];

export default function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description ?? '',
        priority: initialTask.priority,
        dueDate: toInputDateFormat(initialTask.dueDate),
        category: initialTask.category ?? '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        category: '',
      });
    }
    setErrors({});
  }, [initialTask]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      nextErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 120) {
      nextErrors.title = 'Title must be 120 characters or fewer';
    }

    if (formData.description && formData.description.length > 1000) {
      nextErrors.description = 'Description must be 1000 characters or fewer';
    }

    if (!['LOW', 'MEDIUM', 'HIGH'].includes(formData.priority)) {
      nextErrors.priority = 'Priority must be LOW, MEDIUM, or HIGH';
    }

    if (formData.dueDate) {
      const parsedDate = new Date(formData.dueDate);
      if (Number.isNaN(parsedDate.getTime())) {
        nextErrors.dueDate = 'Due date must be a valid date';
      }
    }

    if (formData.category && formData.category.trim().length > 80) {
      nextErrors.category = 'Category must be 80 characters or fewer';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
    });
  };

  return (
    <div className="card form-card">
      <div className="form-header">
        <div>
          <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
          <p className="form-subtitle">
            {initialTask
              ? 'Update the details for this task below.'
              : 'Add a new academic or personal task to your checklist.'}
          </p>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="form-field">
          <label htmlFor="task-title">
            Task Title <span className="required-mark">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g. Complete Operating Systems assignment"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            maxLength={120}
            className={errors.title ? 'input-error' : ''}
            disabled={isSubmitting}
            required
          />
          <div className="field-hint-row">
            {errors.title ? (
              <span className="error-text">{errors.title}</span>
            ) : (
              <span className="field-hint">A concise title for your task</span>
            )}
            <span className="char-count">{formData.title.length}/120</span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            placeholder="Additional notes, instructions, or steps to complete..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            maxLength={1000}
            rows={3}
            className={errors.description ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          <div className="field-hint-row">
            {errors.description && <span className="error-text">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/1000</span>
          </div>
        </div>

        <div className="two-column">
          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              disabled={isSubmitting}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-dueDate">Due Date</label>
            <input
              id="task-dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData({ ...formData, dueDate: e.target.value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
              }}
              className={errors.dueDate ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="task-category">Category / Subject</label>
          <input
            id="task-category"
            type="text"
            placeholder="e.g. Academic, Database Systems, Exam"
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              if (errors.category) setErrors({ ...errors, category: '' });
            }}
            maxLength={80}
            className={errors.category ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.category && <span className="error-text">{errors.category}</span>}

          <div className="quick-category-chips">
            <span className="quick-chip-label">Suggestions:</span>
            {COMMON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`suggestion-chip ${formData.category === cat ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
