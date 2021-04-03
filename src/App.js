import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddNote from "./AddNote/AddNote";
import EditNote from "./EditNote/EditNote";
import NoteList from "./NoteList/NoteList";
import NotesContext from "./NotesContext";
import Nav from "./Nav/Nav";
import config from "./config";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSmile, faImage } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faListUl, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faTrash, faListUl, faTimes);

class App extends Component {
  state = {
    notes: [],
    todos: [],
    error: null,
  };

  setNotes = (notes) => {
    this.setState({
      notes,
      error: null,
    });
  };

  setTodos = (todos) => {
    this.setState({
      todos,
      error: null,
    });
  };

  AddNote = (note) => {
    this.setState({
      notes: [...this.state.notes, note],
    });
  };

  addTodo = (todo) => {
    this.setState({
      todos: [...this.state.todos, todo],
    });
  };

  deleteNote = (noteId) => {
    const newNotes = this.state.notes.filter((bm) => bm.id !== noteId);
    console.log("Deleting from state");
    this.setState({
      notes: newNotes,
    });
  };

  deleteTodo = (todoId) => {
    const newTodos = this.state.todos.filter((bm) => bm.id !== todoId);
    console.log("Deleting from state");
    this.setState({
      todo: newTodos,
    });
  };

  addToDoList = () => {
    console.log("Attempting to add todo");
    const newTodo = {
      title: "New Todo",
      todoList: [],
      completed: "",
      todo: [],
    };
    this.setState({
      todos: [...this.state.todos, newTodo],
    });

    fetch(config.API_ENDPOINT + `todo/`, {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((data) => {
        this.context.addTodo(data);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  addNewNote = () => {
    const newNote = {
      title: "New Note",
      notepad: "Add new text",
      description: "",
    };
    this.setState({
      notes: [...this.state.notes, newNote],
    });

    fetch(config.API_ENDPOINT + `notes/`, {
      method: "POST",
      body: JSON.stringify(newNote),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((data) => {
        this.context.AddNote(data);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  componentDidMount() {
    var todourl = config.API_ENDPOINT + "todo";
    var notesurl = config.API_ENDPOINT + "notes";
    fetch(notesurl, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then(this.setNotes)
      .then(
        fetch(todourl, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${config.API_KEY}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((error) => Promise.reject(error));
            }
            return res.json();
          })
          .then((todos) => {
            console.log("Getting from DB");
            console.log(todos);
            this.setState({
              todos: todos,
            });
          })
      )
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  updateNote = (updatedNote) => {
    this.setState({
      notes: this.state.notes.map((bm) =>
        bm.id !== updatedNote.id ? bm : updatedNote
      ),
    });
  };
  updateTodo = (updatedTodo) => {
    this.setState({
      todos: this.state.todos.map((bm) =>
        bm.id !== updatedTodo.id ? bm : updatedTodo
      ),
    });
  };
  render() {
    const contextValue = {
      notes: this.state.notes,
      AddNote: this.AddNote,
      deleteNote: this.deleteNote,
      updateNote: this.updateNote,
      todos: this.state.todos,
      addToDoList: this.addToDoList,
      addTodo: this.addTodo,
      deleteTodo: this.deleteTodo,
      updateTodo: this.updateTodo,
    };
    return (
      <main className="App">
        <div id="header">
          <button id="addNoteBtn" onClick={this.addNewNote}>
            +
          </button>
          <button className="addTodo">
            {" "}
            <FontAwesomeIcon
              icon={["fas", "list-ul"]}
              className="fa-icon"
              onClick={this.addToDoList}
            />
          </button>
          <p id="appTitle">Notes App</p>
        </div>
        <NotesContext.Provider value={contextValue}>
          <div className="content" aria-live="polite">
            <Route exact path="/" component={NoteList} />
            <Route path="/add-note" component={AddNote} />
            <Route path="/edit/:noteId" component={EditNote} />
          </div>
        </NotesContext.Provider>
      </main>
    );
  }
}

export default App;
