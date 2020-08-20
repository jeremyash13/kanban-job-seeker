import React, { useEffect } from "react";
import DragNDrop from "./components/DragNDrop";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import NewJob from "./components/NewJob";

function App() {
  useEffect(() => {}, []);

  return (
    <div className="p-4">
      <h3>Job Seeker</h3>
      <NewJob />
      <DragNDrop />
    </div>
  );
}

export default App;
