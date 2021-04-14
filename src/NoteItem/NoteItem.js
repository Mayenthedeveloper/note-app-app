import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import Rating from "../Rating/Rating";
import NotesContext from "../NotesContext";
import config from "../config";
import "./NoteItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function editNote(noteId, noteTitle, e, noteDescription, context) {
  const id = noteId;
  const title = noteTitle;
  const notepad = e.innerText;
  const description = noteDescription;
  const newNote = { id, title, notepad, description };
  console.log("Editing note");
  console.log(newNote);
  updateEndpoint(noteId, newNote, context);
}

function editNoteTitle(noteId, e, noteBody, noteDescription, context) {
  const id = noteId;
  const title = e.innerText;
  const notepad = noteBody;
  const description = noteDescription;
  const newNote = { id, title, notepad, description };
  console.log(newNote);
  updateEndpoint(noteId, newNote, context);
}

function updateEndpoint(noteId, newNote, context) {
  fetch(config.API_ENDPOINT + `notes/${noteId}`, {
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
      console.log("Editted Note");
      console.log(newNote);
      context.updateNote(newNote);
      //this.props.history.push("/");
    })
    .catch((error) => {
      console.error(error);
      //this.setState({ error });
    });
}

function deleteNoteRequest(noteId, context) {
  //document.getElementById(noteId).style.display = "none";
  fetch(config.API_ENDPOINT + `notes/${noteId}`, {
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
      return;
    })
    .then((data) => {
      context.deleteNote(noteId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function NoteItem(props) {
  const context = useContext(NotesContext);
  return (
    <NotesContext.Consumer>
      {(context) => (
        <div className="NoteItem" id={props.id}>
          <h3
            contentEditable="true"
            className="NoteItem__title"
            onBlur={(e) =>
              editNoteTitle(
                props.id,
                e.target,
                props.notepad,
                props.description,
                context
              )
            }
          >
            {props.title}
            <i className=""></i>
          </h3>
          <p
            contentEditable="true"
            className="NoteItem_body"
            onBlur={(e) =>
              editNote(
                props.id,
                props.title,
                e.target,
                props.description,
                context
              )
            }
          >
            {props.notepad}
          </p>

          {/* //listtag */}

          <p className="NoteItem__description">{props.description}</p>
          <div className="NoteItem__buttons">
            {/* <Link to={`/edit/${props.id}`}>Edit</Link>{" "} */}
            {/* <button
              className="NoteItem__description"
              onClick={() => deleteNoteRequest(props.id, context.deleteNote)}
            >
              Delete
            </button> */}
            <FontAwesomeIcon
              icon={["fas", "trash"]}
              className="fa-icon"
              onClick={() => deleteNoteRequest(props.id, context)}
            />
          </div>
        </div>
      )}
    </NotesContext.Consumer>
  );
}

NoteItem.defaultProps = {
  onClickDelete: () => {},
};

NoteItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  notepad: PropTypes.string.isRequired,
  desciption: PropTypes.string,

  onClickDelete: PropTypes.func,
};
