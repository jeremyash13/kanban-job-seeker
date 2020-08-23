import React from "react";
import DragNDrop from "./components/DragNDrop";
import Navbar from "./components/Navbar";
import { Fade } from "shards-react";
import Global from "./state/Global";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

function App() {
  return (
    <Global.Provider>
      <Fade>
        <div className="p-4">
          <Navbar />
          <h2>Job Seeker</h2>
          <DragNDrop />
        </div>
      </Fade>
    </Global.Provider>
  );
}

export default App;
