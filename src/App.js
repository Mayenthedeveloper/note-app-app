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
import { totalmem } from "os";
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
    console.log("adding todo to state");
    this.setState({
      todos: [...this.state.todos, todo],
    });
    console.log(this.state.todos);
  };

  deleteNote = (noteId) => {
    console.log("Deleting from state notes");
    const newNotes = this.state.notes.filter((bm) => bm.id !== noteId);
    this.setState({
      notes: newNotes,
    });
  };

  deleteTodo = (todoId) => {
    console.log(this.state.todos);
    const newTodos = this.state.todos.filter((bm) => bm.id !== todoId);
    console.log("Deleting from state todo");
    this.setState({
      todos: newTodos,
    });
  };

  deletTodoListItem = (id, item, value) => {
    console.log("In delete");
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
    console.log(delTodo);
    fetch(config.API_ENDPOINT + `todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify(delTodo),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        console.log("RESPONSE");
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((todo) => {
        console.log(todo);
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

  // deleteTodoItem = (id, item) => {
  //   console.log(id);
  //   console.log(item);
  //   const patchTodo = {
  //     todo: JSON.stringify([
  //       item,
  //       ...JSON.parse(this.state.todos.find((t) => t.id === id).todo),
  //     ]),
  //   };
  // };

  addToDoList = () => {
    console.log("Attempting to add todo");
    const newTodo = {
      title: "New Todo",
      todoList: [],
      completed: false,
      todo: "[]",
    };
    // this.setState({
    //   todos: [...this.state.todos, newTodo],
    // });

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
        console.log("Data");
        console.log(data);

        var size = this.state.notes.length;
        var noteAdded = this.state.notes[size - 1];
        noteAdded.id = data.id;
        console.log("Note added");
        console.log(noteAdded);
        this.setState({
          notes: this.state.notes.map((bm, index) =>
            index == size - 1 ? noteAdded : bm
          ),
        });
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
              console.log("error");
              return res.json().then((error) => Promise.reject(error));
            }
            console.log("Results fetched");
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
    console.log("App.js -- update note");
    this.setState({
      notes: this.state.notes.map((bm) =>
        bm.id !== updatedNote.id ? bm : updatedNote
      ),
    });
  };

  updateTodo = (updatedTodo) => {
    console.log("Before");
    console.log(this.state.todos);
    this.setState({
      todos: this.state.todos.map((bm) =>
        bm.id !== updatedTodo.id ? bm : updatedTodo
      ),
    });
    console.log("After");
    console.log(this.state.todos);
  };

  editTodoTitle(noteId, title, todo) {
    console.log("Edit todot title");
    const id = noteId;
    const newNote = { id, title, todo };
    console.log(newNote);
    this.updateEndpoint(noteId, newNote);
  }

  updateEndpoint(noteId, newNote) {
    console.log("Updating todo");
    console.log(newNote);
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
        //this.resetFields(newNote);
        this.updateTodo(newNote);
        //this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        //this.setState({ error });
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
      // addTodo: this.addTodo,
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
