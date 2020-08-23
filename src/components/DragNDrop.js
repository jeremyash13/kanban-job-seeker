import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  Button,
} from "shards-react";
import Global from "../state/Global";

import NewJob from "./NewJob";

const appliedID = "applied";
const interviewingID = "interviewing";
const offersID = "offers";

let appliedColumn = [];
let interviewingColumn = [];
let offersColumn = [];

function DragNDrop() {
  const GlobalState = Global.useContainer();

  const [columns, setColumns] = useState({});
  const [showInterviewingModal, setShowInterviewingModal] = useState(false);

  const [editingItemIndex, setEditingItemIndex] = useState(null);

  const { user } = useAuth0();

  const InterviewingModal = () => {
    const [value, setValue] = useState("");
    const inputRef = useRef();
    return (
      <Modal
        open={true}
        toggle={() => setShowInterviewingModal(!showInterviewingModal)}
        centered
      >
        <ModalHeader>Add note</ModalHeader>
        <ModalBody>
          <Form>
            <FormInput
              id="#role"
              placeholder="When is your interview?"
              autoComplete="off"
              value={value}
              // invalid={roleInvalid}
              innerRef={inputRef}
              onChange={(e) => {
                setValue(e.value);
              }}
            />
          </Form>
          <div className="flex">
            <Button
              outline
              pill
              size="sm"
              theme="primary"
              className="ml-auto mt-2"
              onClick={() => {
                const newState = [...interviewingColumn]
                newState[editingItemIndex].role = inputRef.current.value;

                setColumns({
                  [appliedID]: {
                    name: "Applied",
                    items: appliedColumn,
                  },
                  [interviewingID]: {
                    name: "Interviewing",
                    items: [...newState],
                  },
                  [offersID]: {
                    name: "Offers",
                    items: offersColumn,
                  },
                });
                setShowInterviewingModal(false)
              }}
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  const modifyItem = (newState, cb) => {
    // const { field, value } = newState;
    // const index = GlobalState.editingItemIndex;
    // appliedColumn[index].role = value;
    // renderColumns();
  };

  const spliceItem = (result, columns) => {
    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId]; // THESE NEED TO BE STORED IN GLOBAL STATE
    const sourceItems = [...sourceColumn.items]; // THESE NEED TO BE STORED IN GLOBAL STATE
    const destItemIndex = destination.index; // THESE NEED TO BE STORED IN GLOBAL STATE

    const [sourceItem] = sourceItems.splice(source.index, 1);

    let sourceDropId =
      source.droppableId === "applied"
        ? "applied"
        : source.droppableId === "interviewing"
        ? "interviewing"
        : source.droppableId === "offers"
        ? "offers"
        : null;
    let destinationDropId =
      destination.droppableId === "applied"
        ? "applied"
        : destination.droppableId === "interviewing"
        ? "interviewing"
        : destination.droppableId === "offers"
        ? "offers"
        : null;

    if (destinationDropId === "applied") {
      appliedColumn.splice(destItemIndex, 0, sourceItem);
    } else if (destinationDropId === "interviewing") {
      interviewingColumn.splice(destItemIndex, 0, sourceItem);
    } else if (destinationDropId === "offers") {
      offersColumn.splice(destItemIndex, 0, sourceItem);
    }

    if (sourceDropId === "applied") {
      appliedColumn.splice(source.index, 1);
    } else if (sourceDropId === "interviewing") {
      interviewingColumn.splice(source.index, 1);
    } else if (sourceDropId === "offers") {
      offersColumn.splice(source.index, 1);
    }

    renderColumns();
  };

  const onDragEnd = (result, columns) => {
    const { source, destination } = result;
    if (!result.destination) return;

    if (source.droppableId !== destination.droppableId) {
      // item moved columns
      setEditingItemIndex(destination.index);
      if (destination.droppableId === "applied") {
        // update item (status and info fields) in DB in the background
        spliceItem(result, columns);
      }
      if (destination.droppableId === "interviewing") {
        // trigger a modal
        setShowInterviewingModal(true);
        spliceItem(result, columns);

        // modify item in state (status and info fields) for instant UI update

        // update item (status and info fields) in DB in the background
      }
      if (destination.droppableId === "offers") {
        // trigger a modal
        spliceItem(result, columns);
        // modify item in state (status and info fields) for instant UI update
        // update item (status and info fields) in DB in the background
      }
    }
  };

  const renderColumns = () => {
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

  const organizeColumns = (data) => {
    appliedColumn = data.filter((item) => item.status === "applied");
    interviewingColumn = data.filter((item) => item.status === "interviewing");
    offersColumn = data.filter((item) => item.status === "offers");
    renderColumns();
  };

  const createNewJob = (data) => {
    appliedColumn = [...appliedColumn, ...data];
    renderColumns();
  };

  const fetchItems = (user) => {
    const url = "http://localhost:4000/items";

    axios
      .post(url, {
        user: user.email,
      })
      .then((json) => {
        organizeColumns(json.data);
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
      <NewJob createNewJob={createNewJob} />
      <div className="flex user-select-none">
        {showInterviewingModal && <InterviewingModal />}
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div className="mr-4" key={id + column}>
                <h5 className="font-medium">{`${column.items.length} ${column.name}`}</h5>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="rounded"
                        style={{
                          background: snapshot.isDraggingOver ? "#007bff" : "",
                          boxShadow:
                            "inset 0 0 40px rgba(0,0,0,.1), inset 0 0 4px rgba(0,0,0,.25)",
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
                                      // border: "solid 1px rgba(0,0,0,.1)",
                                      backgroundColor: "white",
                                      boxShadow: snapshot.isDragging
                                        ? "0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 4px 0 rgba(0, 0, 0, 0.10)"
                                        : "0 10px 20px rgba(0, 0, 0, 0.1)",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <h6>{item.role}</h6>
                                    <div className="text-gray-500 font-normal">
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
