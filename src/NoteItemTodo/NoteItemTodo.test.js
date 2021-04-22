import React from "react";
import ReactDOM from "react-dom";
import NoteItemTodo from "./NoteItemTodo";
import { BrowserRouter } from "react-router-dom";

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
