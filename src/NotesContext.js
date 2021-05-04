import React from "react";

const NotesContext = React.createContext({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
  todos: [],

  deleteTodo: () => {},
  updateTodo: () => {},
  editTodoTitle: () => {},
  addTodoListItem: () => {},
  deletTodoListItem: () => {},
});

export default NotesContext;
