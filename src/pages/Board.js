import React from "react";
import DragNDrop from "../components/DragNDrop";
import Navbar from "../components/Navbar";
import { Fade } from "shards-react";

export default function Board() {
  return (
    <Fade>
      <div className="p-4">
        <Navbar />
        <DragNDrop />
      </div>
    </Fade>
  );
}
