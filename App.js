import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS file

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRemoveAll, setShowRemoveAll] = useState(false); // State để kiểm tra xem có ít nhất hai task trở lên hay không

  // Load todos from local storage when component mounts
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    // Kiểm tra số lượng task và hiển thị nút Remove All nếu có ít nhất hai task trở lên
    setShowRemoveAll(todos.length >= 2);
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = { id: Date.now(), text: inputValue, completed: false };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const removeAll = () => {
    setTodos([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }
    if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your todo..."
        />
        <button className="add-button" onClick={addTodo}>Add Todo</button>
      </div>
      <div className="filter-buttons">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      

      <button className="clear-completed-button" onClick={clearCompleted}>Clear Completed</button>
      {showRemoveAll && (
        <button className="remove-all-button" onClick={removeAll}>Remove All</button>
      )}
    </div>
  );
}

export default TodoApp;
