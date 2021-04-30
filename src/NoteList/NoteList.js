import React, { Component } from "react";
import PropTypes from "prop-types";
import NotesContext from "../NotesContext";
import NoteItem from "../NoteItem/NoteItem";
import NoteItemTodo from "../NoteItemTodo/NoteItemTodo";
import "./NoteList.css";

class NoteList extends Component {
  static proptTypes = {
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
      })
    ),
  };

  static defaultProps = {
    notes: [],
    todos: [],
  };

  static contextType = NotesContext;

  render() {
    const notes = this.context.notes;
    const todos = this.context.todos;

    return (
      <section className="NoteList">
        <p className="title">
          This is a note and todos app. Users can add, delete, and update notes
          or todos
        </p>
        <div>
          <div className="NoteList__list" aria-live="polite">
            {notes.map((note) => (
              <NoteItem key={note.id} {...note} />
            ))}

            {todos != null
              ? todos.map((todo) => <NoteItemTodo key={todo.id} {...todo} />)
              : ""}
          </div>
        </div>
      </section>
    );
  }
}

export default NoteList;
