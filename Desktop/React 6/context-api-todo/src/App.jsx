import React from 'react';
import TodoList from './TodoList';
import TodoForm from './Todoform';

function App() {
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
