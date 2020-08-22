import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import NewJob from "./NewJob";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  // if (source.droppableId !== destination.droppableId) {
  // add source item to destination
  // remove source item from source

  // }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const appliedID = "applied";
const interviewingID = "interviews";
const offersID = "offers";

let appliedColumn = [];

function DragNDrop() {
  const [interviewingColumn, setInterviewingColumn] = useState([]);
  const [offersColumn, setOffersColumn] = useState([]);
  const [columns, setColumns] = useState({});

  const { user } = useAuth0();

  const setAppliedColumn = (newState) => {
    appliedColumn = [...appliedColumn, ...newState];
    setColumns({
      [appliedID]: {
        name: "Applied",
        items: appliedColumn,
      },
      [interviewingID]: {
        name: "Interviewing",
        items: interviewingColumn,
      },
      [offersID]: {
        name: "Offers",
        items: offersColumn,
      },
    });
  };

  const fetchItems = (user) => {
    const url = "http://localhost:4000/items";

    axios
      .post(url, {
        user: user.email,
      })
      .then((json) => {
        setAppliedColumn(json.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user) {
      fetchItems(user);
    }
  }, [user]);

  return (
    <>
      <NewJob setAppliedColumn={setAppliedColumn} />
      <div className="flex user-select-none">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div className="mr-4" key={id + column}>
                <h6 className="font-medium">{`${column.items.length} ${column.name}`}</h6>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="rounded"
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "",
                          padding: "4px",
                          width: "250px",
                          minHeight: "500px",
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item._id}
                              draggableId={item._id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="rounded"
                                    style={{
                                      userSelect: "none",
                                      padding: "16px",
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      border: "solid 1px black",
                                      backgroundColor: snapshot.isDragging
                                        ? "#fef2e3"
                                        : "",
                                      boxShadow: snapshot.isDragging
                                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.08)"
                                        : "",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <h6>{item.role}</h6>
                                    <div className="text-gray-600 font-normal">
                                      {item.company}
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}

export default DragNDrop;
