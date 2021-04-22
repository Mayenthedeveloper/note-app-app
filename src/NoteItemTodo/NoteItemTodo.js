import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import NotesContext from "../NotesContext";
import config from "../config";
import "./NoteItemTodo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash, faListUl, faTimes } from "@fortawesome/free-solid-svg-icons";
// library.add(faTrash, faListUl, faTimes);

function deleteNoteRequest(noteId, cb) {
  fetch(config.API_ENDPOINT + `todo/${noteId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${config.API_KEY}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => Promise.reject(error));
      }
      return res;
    })
    .then((data) => {
      cb.deleteTodo(noteId);
    })
    .catch((error) => {
      console.error(error);
    });
}

function createTodoArray(props) {
  if (props.todo == null) return;
  if (props.todo.length == 1) {
    let arr = props.todo;
    return arr;
  } else {
    let arr = props.todo.split(",");
    return arr;
  }
}

export default function NoteItemTodo(props) {
  const context = useContext(NotesContext);

  let todoArray = createTodoArray(props);

  if (todoArray == null) {
    todoArray = [];
  }

  // function addNewLine(event, index) {
  //   if (event.code == "Enter") {
  //     todoArray[index] = event.target.innerText;

  //     let todos = todoArray.join(",");

  //     context.editTodoTitle(props.id, props.title, todos);
  //   }
  // }

  function deleteTodoItem(id, todos, val) {
    context.deletTodoListItem(id, todos, val);
  }

  function addItem(id, addText) {
    context.addTodoListItem(id, addText);
    setAddText("");
  }

  const [addText, setAddText] = useState("");
  const todos =
    props.todo && props.todo.length > 1 ? JSON.parse(props.todo) : props.todo;

  return (
    <div className="NoteItem">
      <input value={addText} onChange={(e) => setAddText(e.target.value)} />

      <button onClick={() => addItem(props.id, addText)}>Add Todo</button>

      <table id="todolist">
        <tbody>
          {todos
            ? todos.map((todo, index) => (
                <tr key={index}>
                  <td>{todo}</td>
                  <td id="crossIcon">
                    <b
                      value={todo}
                      onClick={() => deleteTodoItem(props.id, todos, { todo })}
                    >
                      X
                    </b>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <div className="NoteItem__buttons">
        <FontAwesomeIcon
          icon={["fas", "trash"]}
          className="fa-icon delete-todo"
          onClick={() => deleteNoteRequest(props.id, context)}
        />
      </div>
    </div>
  );
}

NoteItemTodo.defaultProps = {
  onClickDelete: () => {},
};

NoteItemTodo.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  todo: PropTypes.string,
  completed: PropTypes.bool,
  onClickDelete: PropTypes.func,
};
