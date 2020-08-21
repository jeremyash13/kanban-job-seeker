import React from "react";
import DragNDrop from "./components/DragNDrop";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";



function App() {

  return (
    <div className="p-4">
      <h3>Job Seeker</h3>
      <DragNDrop />
    </div>
  );
}

export default App;
