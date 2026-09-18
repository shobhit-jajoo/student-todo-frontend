import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/date';
import { getApiErrorMessage } from '../utils/apiError';
import type { Task } from '../types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<
    'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
  >('ALL');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<
    'newest' | 'oldest' | 'dueDate' | 'priority' | 'completed'
  >('newest');

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    category: '',
  });

  const loadTasks = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (status && status !== 'all') {
        params.set('status', status);
      }

      if (priorityFilter !== 'ALL') {
        params.set('priority', priorityFilter);
      }

      if (category) {
        params.set('category', category);
      }

      if (search) {
        params.set('search', search);
      }

      if (sort !== 'newest') {
        params.set('sort', sort);
      }

      const queryString = params.toString();

      const response = await api.get(
        queryString ? `/tasks?${queryString}` : '/tasks'
      );

      setTasks(response.data.data ?? []);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, [status, priorityFilter, category, search, sort]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          tasks
            .map((task) => task.category)
            .filter(Boolean) as string[]
        )
      ),
    [tasks]
  );

  const openCreateForm = () => {
    setEditingTask(null);

    setForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      category: '',
    });
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : '',
      category: task.category ?? '',
    });
  };

  const closeForm = () => {
    setEditingTask(null);

    setForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      category: '',
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post('/tasks', form);
      }

      closeForm();
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save task'));
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update task'));
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete task'));
    }
  };

  return (
    <div className="page">
      <header className="page-header tasks-header">
        <div>
          <p className="eyebrow">Planner</p>
          <h2>My Tasks</h2>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          + New Task
        </button>
      </header>

      {/* Filters */}
      <div className="toolbar card">
        <input
          type="search"
          placeholder="Search by title, description, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as 'all' | 'pending' | 'completed'
            )
          }
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value as 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
            )
          }
        >
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>

          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueDate">Due date</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {editingTask !== null ||
      form.title ||
      form.description ||
      form.category ? (
        <div className="card form-card">
          <div className="form-header">
            <h3>
              {editingTask ? 'Edit task' : 'Create task'}
            </h3>

            <button
              type="button"
              className="text-button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="task-form"
          >
            <label>
              Title

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                maxLength={120}
                required
              />
            </label>

            <label>
              Description

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                maxLength={1000}
                rows={4}
              />
            </label>

            <div className="two-column">
              <label>
                Priority

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as
                        | 'LOW'
                        | 'MEDIUM'
                        | 'HIGH',
                    })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>

              <label>
                Due date

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <label>
              Category

              <input
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                maxLength={80}
              />
            </label>

            <button
              className="primary-button"
              type="submit"
            >
              {editingTask
                ? 'Save changes'
                : 'Create task'}
            </button>
          </form>
        </div>
      ) : null}

      {/* Task List */}
      {loading ? (
        <div className="page-loading">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks
            .slice()
            .sort((a, b) => {
              switch (sort) {
                case 'oldest':
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'dueDate':
                  return new Date(a.dueDate ?? '9999-12-31').getTime() - new Date(b.dueDate ?? '9999-12-31').getTime();
                case 'priority':
                  return ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[b.priority] ?? 0) - ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[a.priority] ?? 0);
                case 'completed':
                  return Number(a.completed) - Number(b.completed);
                default:
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }
            })
            .map((task) => (
            <article
              key={task.id}
              className={`task-card ${
                task.completed ? 'completed' : ''
              }`}
            >
              <div className="task-topline">
                <div>
                  <h3>{task.title}</h3>

                  {task.category && (
                    <span className="chip">
                      {task.category}
                    </span>
                  )}
                </div>

                <span
                  className={`priority-badge ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>

              <p className="task-description">
                {task.description ||
                  'No description provided.'}
              </p>

              <div className="task-meta">
                <span>
                  Due: {formatDate(task.dueDate)}
                </span>

                <span>
                  Created: {formatDate(task.createdAt)}
                </span>
              </div>

              <div className="task-actions">
                <button
                  className="secondary-button"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed
                    ? 'Undo'
                    : 'Mark complete'}
                </button>

                <button
                  className="ghost-button"
                  onClick={() => openEditForm(task)}
                >
                  Edit
                </button>

                <button
                  className="danger-button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </article>
            ))}
        </div>
      )}
    </div>
  );
}