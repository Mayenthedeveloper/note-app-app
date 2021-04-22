import React from "react";
import ReactDOM from "react-dom";
import EditNote from "./EditNote";
import { BrowserRouter } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <EditNote />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
