import React from "react";
import ReactDOM from "react-dom";
import NoteItemTodo from "./NoteItemTodo";
import { BrowserRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSmile, faImage } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faListUl, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faTrash, faListUl, faTimes);

it("renders without crashing", () => {
  const div = document.createElement("div");
  let prop = {
    params: "",
  };
  ReactDOM.render(
    <BrowserRouter>
      <NoteItemTodo todo={""} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
