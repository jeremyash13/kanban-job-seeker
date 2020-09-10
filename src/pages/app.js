import React from "react";
import DragNDrop from "../components/DragNDrop";
import Navbar from "../components/Navbar";
import { Fade } from "shards-react";
import Global from "../state/Global";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import SEO from "../components/seo";

function App() {
  return (
    <Global.Provider>
      <Fade>
      <SEO title="Board" />
        <div className="p-4">
          <Navbar />
          <DragNDrop />
        </div>
      </Fade>
    </Global.Provider>
  );
}

export default App;
