import React, { Component } from "react";
import PropTypes from "prop-types";
import NotesContext from "../NotesContext";
import config from "../config";
import "./AddNote.css";

const Required = () => <span className="AddNote__required">*</span>;

class AddNote extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  static contextType = NotesContext;

  state = {
    error: null,
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { title, notepad, description } = e.target;
    const note = {
      title: title.value,
      notepad: notepad.value,
      description: description.value,
    };
    this.setState({ error: null });
    fetch(config.API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(note),
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
        title.value = "";
        notepad.value = "";
        description.value = "";

        this.context.AddNote(data);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { error } = this.state;
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <form className="AddNote__form" onSubmit={this.handleSubmit}>
          <div className="AddNote__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Note topic!"
              required
            />
          </div>
          <div>
            <label htmlFor="url">
              Note <Required />
            </label>
            <textarea
              type="notepad"
              name="notepad"
              id="notepad"
              placeholder="write notes here"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" />
          </div>

          <div className="AddNote__buttons">
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

export default AddNote;
