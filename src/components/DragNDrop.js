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
    const clickHandler = () => {
      const newState = [...interviewingColumn];
      newState[editingItemIndex].note = inputRef.current.value;
      newState[editingItemIndex].status = "interviewing";

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
      updateItemInDB(newState[editingItemIndex]);
      setShowInterviewingModal(false);
    };
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
                clickHandler();
              }}
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  const updateItemInDB = (updatedItem) => {
    const url = "http://localhost:4000/updateitem";
    axios
      .put(url, {
        ...updatedItem,
      })
      .then((res) => {
        console.log(res);
      });
  };

  const spliceItem = (result) => {
    const { source, destination } = result;

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

    const destItemIndex = destination.index;
    let sourceItem;

    if (sourceDropId === "applied") {
      [sourceItem] = appliedColumn.splice(source.index, 1);
    } else if (sourceDropId === "interviewing") {
      [sourceItem] = interviewingColumn.splice(source.index, 1);
    } else if (sourceDropId === "offers") {
      [sourceItem] = offersColumn.splice(source.index, 1);
    }

    if (destinationDropId === "applied") {
      appliedColumn.splice(destItemIndex, 0, sourceItem);
    } else if (destinationDropId === "interviewing") {
      interviewingColumn.splice(destItemIndex, 0, sourceItem);
    } else if (destinationDropId === "offers") {
      offersColumn.splice(destItemIndex, 0, sourceItem);
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
        spliceItem(result, columns);
        // update item (status and info fields) in DB in the background
      }
      if (destination.droppableId === "interviewing") {
        setShowInterviewingModal(true);
        spliceItem(result, columns);
        // update item (status and info fields) in DB in the background
      }
      if (destination.droppableId === "offers") {
        // trigger a modal
        spliceItem(result, columns);
        // update item (status and info fields) in DB in the background
      }
    } else {
      // if item moved positions in the same column
      spliceItem(result, columns);
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
      // wait for user obj to be defined before fetching items for that user
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
                                    <div>{`${item.note ? item.note : ""}`}</div>
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
