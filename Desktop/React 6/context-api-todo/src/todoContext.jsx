import { createContext, useState } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', completed: false },
    { id: 2, text: 'Walk the dog', completed: true },
  ]);

  const addTodo = (text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: prevTodos.length + 1, text, completed: false }
    ]);
  };

  const toggleCompletion = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleCompletion, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
