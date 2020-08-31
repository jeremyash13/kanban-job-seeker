import React from "react";
import { Droppable } from "react-beautiful-dnd";

function TrashCan() {
  const trashID = "trash";
  return (
    <div className="mt-8 pt-1" key={trashID}>
      <Droppable droppableId={trashID} key={trashID + "69"}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="rounded overflow-y-scroll custom-scrollbar relative"
              style={{
                background: snapshot.isDraggingOver ? "#c4183c" : "",
                boxShadow: snapshot.isDraggingOver
                  ? "inset 0 0 40px rgba(0, 0, 0,.20), inset 0 0 4px rgba(0, 0, 0,.5)"
                  : "inset 0 0 40px rgba(0, 123, 255,.1), inset 0 0 4px rgba(0, 0, 0,.25)",
                width: "75px",
                height: "75px",
              }}
            >
              <svg
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
                className={`bi bi-trash-fill absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 ease-in-out 
                  ${snapshot.isDraggingOver ? "text-white" : ""}`}
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
                />
              </svg>
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default TrashCan;
