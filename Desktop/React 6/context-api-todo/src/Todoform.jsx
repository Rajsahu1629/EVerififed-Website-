import React, { useContext, useState } from 'react';
import { TodoContext } from './todoContext';

function TodoForm() {
  const context = useContext(TodoContext);
  const addTodo = context?.addTodo || (() => {});
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
    console.log(addTodo)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
