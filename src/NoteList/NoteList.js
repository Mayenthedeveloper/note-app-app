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
    console.log("Note List");
    console.log(this.context);
    return (
      <section className="NoteList">
        <h2 class="title">Your notes</h2>
        <div className="NoteList__list" aria-live="polite">
          {notes.map((note) => (
            <NoteItem key={note.id} {...note} />
          ))}
          {/* </div>
        <div>
          <h2>YOUR TODOS</h2> */}
          {todos != null
            ? todos.map((todo) => <NoteItemTodo key={todo.id} {...todo} />)
            : ""}
        </div>
      </section>
    );
  }
}

export default NoteList;
