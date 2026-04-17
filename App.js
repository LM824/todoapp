import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [uncompletedSort, setUncompletedSort] = useState('asc');
  const [completedSort, setCompletedSort] = useState('asc');
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error fetching todos:', err));
  }, []);

  const userIds = useMemo(
    () => [...new Set(todos.map((t) => t.userId))],
    [todos]
  );

  const processList = (list, sortOrder) => {
    let filtered = list;
    if (selectedUserId !== 'all') {
      filtered = list.filter((t) => t.userId === parseInt(selectedUserId));
    }
    return [...filtered].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  };

  const uncompletedList = processList(
    todos.filter((t) => !t.completed),
    uncompletedSort
  );
  const completedList = processList(
    todos.filter((t) => t.completed),
    completedSort
  );

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Todo Manager</h1>
        <div className="global-filters">
          <label>Filter by User ID: </label>
          <select onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="all">All Users</option>
            {userIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="todo-grid">
        <section className="column">
          <h2>Uncompleted</h2>
          <div className="sort-controls">
            <select onChange={(e) => setUncompletedSort(e.target.value)}>
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
          </div>
          <div className="list">
            {uncompletedList.slice(0, limit).map((todo) => (
              <div key={todo.id} className="todo-item">
                <span>{todo.title}</span>
                <button
                  className="complete-btn"
                  onClick={() => toggleTodo(todo.id)}
                >
                  Complete
                </button>
              </div>
            ))}
            {uncompletedList.length > limit && (
              <button
                className="load-more"
                onClick={() => setLimit((prev) => prev + 10)}
              >
                Load More
              </button>
            )}
          </div>
        </section>

        <section className="column">
          <h2>Completed</h2>
          <div className="sort-controls">
            <select onChange={(e) => setCompletedSort(e.target.value)}>
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
          </div>
          <div className="list">
            {completedList.map((todo) => (
              <div key={todo.id} className="todo-item completed">
                <span>{todo.title}</span>
                <button
                  className="uncomplete-btn"
                  onClick={() => toggleTodo(todo.id)}
                >
                  Uncomplete
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
