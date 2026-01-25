import React, { useContext } from 'react';
import { TodoContext } from './todoContext';

function TodoList() {
  const context = useContext(TodoContext);
  const todos = context?.todos || [];
  const toggleCompletion = context?.toggleCompletion || (() => {});
  const deleteTodo = context?.deleteTodo || (() => {});

  if (!todos.length) {
    return <p>No todos available.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => toggleCompletion(todo.id)}>Toggle Completion</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
