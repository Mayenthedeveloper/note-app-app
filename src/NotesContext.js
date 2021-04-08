import React from "react";

const NotesContext = React.createContext({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
  todos: [],
  // addTodo: () => {},
  deleteTodo: () => {},
  updateTodo: () => {},
  editTodoTitle: () => {},
  addTodoListItem: () => {},
  deletTodoListItem: () => {},
  // addTodo: () => {},

  // dlete list added so
});

export default NotesContext;
