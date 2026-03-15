import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TaskManager.css';

const API_BASE = 'http://localhost:8000/api';

function TaskItem({ task, index, onDelete }) {
  return (
    <li
      className="task-item"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="task-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="task-title">{task.title}</span>
      <span className="task-date">
        {new Date(task.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day:   'numeric',
        })}
      </span>
      <button
        className="tm-delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        ✕
      </button>
    </li>
  );
}

export default function TaskManager() {
  const [tasks,       setTasks]       = useState([]);
  const [inputValue,  setInputValue]  = useState('');
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [fieldError,  setFieldError]  = useState('');
  const [successMsg,  setSuccessMsg]  = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_BASE}/tasks`);
      setTasks(data);
    } catch (err) {
      setError('Could not load tasks. Is the Laravel server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError('');
    setSuccessMsg('');

    if (!inputValue.trim()) {
      setFieldError('Task title cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: newTask } = await axios.post(`${API_BASE}/tasks`, {
        title: inputValue.trim(),
      });

      setTasks((prev) => [newTask, ...prev]);
      setInputValue('');
      setSuccessMsg('Task added!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      if (err.response?.status === 422) {
        const messages = Object.values(err.response.data.errors).flat();
        setFieldError(messages[0] || 'Validation error.');
      } else {
        setError('Failed to add task. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="tm-wrapper">
      <header className="tm-header">
        <div className="tm-logo">✦</div>
        <h1 className="tm-title">Task Manager</h1>
        <p className="tm-subtitle">Laravel + React Lab Activity</p>
      </header>

      <section className="tm-card">
        <h2 className="tm-card-title">Add New Task</h2>
        <form className="tm-form" onSubmit={handleSubmit} noValidate>
          <div className={`tm-input-wrap ${fieldError ? 'has-error' : ''}`}>
            <input
              type="text"
              className="tm-input"
              placeholder="e.g. Review pull request…"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={submitting}
              aria-label="New task title"
            />
            <button
              type="submit"
              className={`tm-btn ${submitting ? 'loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? <span className="spinner" /> : 'Add Task'}
            </button>
          </div>
          {fieldError  && <p className="tm-msg tm-msg--error">{fieldError}</p>}
          {successMsg  && <p className="tm-msg tm-msg--success">{successMsg}</p>}
        </form>
      </section>

      <section className="tm-card">
        <div className="tm-list-header">
          <h2 className="tm-card-title">
            Tasks
            {!loading && (
              <span className="tm-count">{tasks.length}</span>
            )}
          </h2>
          <button className="tm-refresh" onClick={fetchTasks} title="Refresh">
            ↻
          </button>
        </div>

        {error && <p className="tm-msg tm-msg--error">{error}</p>}

        {loading ? (
          <div className="tm-loading">
            <span className="spinner spinner--lg" />
            <span>Loading tasks…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="tm-empty">
            <span className="tm-empty-icon">📋</span>
            <p>No tasks yet. Add one above!</p>
          </div>
        ) : (
          <ul className="tm-list">
            {tasks.map((task, i) => (
              <TaskItem key={task.id} task={task} index={i} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}