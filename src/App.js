import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddNote from "./AddNote/AddNote";
import EditNote from "./EditNote/EditNote";
import NoteList from "./NoteList/NoteList";
import NotesContext from "./NotesContext";

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
    this.setState({
      notes: newNotes,
    });
  };

  deleteTodo = (todoId) => {
    const newTodos = this.state.todos.filter((bm) => bm.id !== todoId);

    this.setState({
      todos: newTodos,
    });
  };

  deletTodoListItem = (id, item, value) => {
    var todoFinal = [];
    item.map((todoItem) => {
      if (todoItem != value.todo) {
        todoFinal.push(todoItem);
      }
    });
    const todo = JSON.stringify(todoFinal);
    const title = "New TODO";
    const completed = true;
    const delTodo = { id, title, completed, todo };

    fetch(config.API_ENDPOINT + `todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify(delTodo),
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
      .then((todo) => {
        this.setState({
          todos: this.state.todos.map((existing) =>
            existing.id === id ? delTodo : existing
          ),
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  addTodoListItem = (id, item) => {
    const patchTodo = {
      todo: JSON.stringify([
        item,
        ...JSON.parse(this.state.todos.find((t) => t.id === id).todo),
      ]),
    };
    fetch(config.API_ENDPOINT + `todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patchTodo),
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
      .then((todo) => {
        this.setState({
          todos: this.state.todos.map((existing) =>
            existing.id === id ? { ...existing, ...patchTodo } : existing
          ),
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  addToDoList = () => {
    const newTodo = {
      title: "New Todo",
      todoList: [],
      completed: false,
      todo: "[]",
    };

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
      .then((todo) => {
        this.setState({
          todos: [...this.state.todos, todo],
        });
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
        newNote.id = data.id;

        this.setState({
          notes: [...this.state.notes, newNote],
        });
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
          .then(this.setTodos)
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

  editTodoTitle(noteId, title, todo) {
    const id = noteId;
    const newNote = { id, title, todo };

    this.updateEndpoint(noteId, newNote);
  }

  updateEndpoint(noteId, newNote) {
    fetch(config.API_ENDPOINT + `todo/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify(newNote),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.updateTodo(newNote);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    const contextValue = {
      notes: this.state.notes,
      AddNote: this.AddNote,
      deleteNote: this.deleteNote,
      updateNote: this.updateNote,
      todos: this.state.todos,
      addToDoList: this.addToDoList.bind(this),

      deleteTodo: this.deleteTodo,
      updateTodo: this.updateTodo,
      editTodoTitle: this.editTodoTitle.bind(this),
      addTodoListItem: this.addTodoListItem,
      deletTodoListItem: this.deletTodoListItem.bind(this),
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
          <p id="appTitle">Notely App</p>
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
