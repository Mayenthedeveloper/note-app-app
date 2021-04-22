import React, { Component } from "react";
import PropTypes from "prop-types";
import NotesContext from "../NotesContext";
import config from "../config";
import "./EditNote.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Required = () => <span className="EditNote__required">*</span>;

class EditNote extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
  };

  static contextType = NotesContext;

  state = {
    error: null,
    id: "",
    title: "",
    notepad: "",
    description: "",
  };

  componentDidMount() {
    const { noteId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${noteId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));

        return res.json();
      })
      .then((responseData) => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          notepad: responseData.notepad,
          description: responseData.description,
        });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  handleChangeNotepad = (e) => {
    this.setState({ notepad: e.target.value });
  };

  handleChangeDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { noteId } = this.props.match.params;
    const { id, title, notepad, description } = this.state;
    const newNote = { id, title, notepad, description };
    fetch(config.API_ENDPOINT + `/${noteId}`, {
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
        this.resetFields(newNote);
        this.context.updateNote(newNote);
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      notepad: newFields.notepad || "",
      description: newFields.description || "",
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { error, title, notepad, description } = this.state;
    return (
      <section className="EditNote">
        <h2>Edit Note</h2>
        <form className="EditNote__form" onSubmit={this.handleSubmit}>
          <div className="EditNote__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <input type="hidden" name="id" />
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Note Title!"
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor="notepad">
              NotePad <Required />
            </label>
            <input
              type="notepad"
              name="notepad"
              id="notepad"
              placeholder="write your note"
              required
              value={notepad}
              onChange={this.handleChangeNotepad}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>

          <div className="EditNote__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{" "}
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditNote;
