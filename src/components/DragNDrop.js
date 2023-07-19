import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
// import { useAuth } from "react-use-auth"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  Button,
  Fade,
} from "shards-react"
import Global from "../state/Global"

import { css } from "@emotion/core"
import HashLoader from "react-spinners/HashLoader"

import NewJob from "./NewJob"
import TrashCan from "./TrashCan"

const appliedID = "applied"
const interviewingID = "interviewing"
const offersID = "offers"

let appliedColumn = []
let interviewingColumn = []
let offersColumn = []

function DragNDrop({ userId }) {
  const GlobalState = Global.useContainer()

  const [columns, setColumns] = useState({})

  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteModalColumn, setNoteModalColumn] = useState(null)

  const [editingItemIndex, setEditingItemIndex] = useState(null)

  const [jobsLoading, setJobsLoading] = useState(true)

  const NoteModal = ({ column }) => {
    const [value, setValue] = useState("")
    const inputRef = useRef()
    const clickHandler = () => {
      let newState
      if (column === "interviewing") {
        newState = [...interviewingColumn]
        newState[editingItemIndex].note = inputRef.current.value
        newState[editingItemIndex].status = "interviewing"

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
        })
      } else if (column === "offers") {
        newState = [...offersColumn]
        newState[editingItemIndex].note = inputRef.current.value
        newState[editingItemIndex].status = "offers"

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
            items: [...newState],
          },
        })
      }

      updateItemInDB(newState[editingItemIndex])
      setShowNoteModal(false)
    }
    return (
      <Modal
        open={true}
        toggle={() => setShowNoteModal(!showNoteModal)}
        centered
      >
        <ModalHeader>Add note</ModalHeader>
        <ModalBody>
          <Form>
            <FormInput
              id="#role"
              placeholder={`${
                column === "interviewing"
                  ? "When is your interview?"
                  : column === "offers"
                  ? "What are your thoughts about the offer?"
                  : ""
              }`}
              autoComplete="off"
              value={value}
              // invalid={roleInvalid}
              innerRef={inputRef}
              onKeyPress={e => {
                if (e.charCode === 13) {
                  e.preventDefault()
                }
              }}
              onChange={e => {
                setValue(e.value)
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
                clickHandler()
              }}
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </Modal>
    )
  }

  const updateItemInDB = updatedItem => {
    const url = GlobalState.updateItemUrl
    axios.post(url, updatedItem)
  }

  const deleteItemInDB = targetItem => {
    const url = GlobalState.deleteItemUrl
    axios.post(url, targetItem)
  }

  const spliceItem = result => {
    const { source, destination } = result

    let sourceDropId =
      source.droppableId === "applied"
        ? "applied"
        : source.droppableId === "interviewing"
        ? "interviewing"
        : source.droppableId === "offers"
        ? "offers"
        : source.droppableId === "trash"
        ? "trash"
        : null
    let destinationDropId =
      destination.droppableId === "applied"
        ? "applied"
        : destination.droppableId === "interviewing"
        ? "interviewing"
        : destination.droppableId === "offers"
        ? "offers"
        : destination.droppableId === "trash"
        ? "trash"
        : null

    const destItemIndex = destination.index
    let sourceItem

    if (sourceDropId === "applied") {
      ;[sourceItem] = appliedColumn.splice(source.index, 1)
    } else if (sourceDropId === "interviewing") {
      ;[sourceItem] = interviewingColumn.splice(source.index, 1)
    } else if (sourceDropId === "offers") {
      ;[sourceItem] = offersColumn.splice(source.index, 1)
    }

    if (destinationDropId === "applied") {
      appliedColumn.splice(destItemIndex, 0, sourceItem)
    } else if (destinationDropId === "interviewing") {
      interviewingColumn.splice(destItemIndex, 0, sourceItem)
    } else if (destinationDropId === "offers") {
      offersColumn.splice(destItemIndex, 0, sourceItem)
    } else if (destinationDropId === "trash") {
      deleteItemInDB(sourceItem)
    }

    sourceItem.status = destinationDropId
    // update item in db
    updateItemInDB(sourceItem)
    renderColumns()
  }

  const onDragEnd = result => {
    const { source, destination } = result
    if (!result.destination) return

    if (source.droppableId !== destination.droppableId) {
      // item moved columns
      setEditingItemIndex(destination.index)
      setNoteModalColumn(destination.droppableId)

      if (destination.droppableId === "applied") {
        spliceItem(result)
      }
      if (destination.droppableId === "interviewing") {
        setShowNoteModal(true)
        spliceItem(result)
      }
      if (destination.droppableId === "offers") {
        // trigger a modal
        setShowNoteModal(true)
        spliceItem(result)
      }
      if (destination.droppableId === "trash") {
        // trigger a modal
        spliceItem(result)
      }
    } else {
      // if item moved positions in the same column
      spliceItem(result)
    }
  }

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
    })
  }

  const organizeColumns = data => {
    appliedColumn = data.filter(item => item.status === "applied")
    interviewingColumn = data.filter(item => item.status === "interviewing")
    offersColumn = data.filter(item => item.status === "offers")
    renderColumns()
  }

  const createNewJob = data => {
    appliedColumn = [...appliedColumn, ...data]
    renderColumns()
  }

  const fetchItems = user => {
    setJobsLoading(true)
    const url = GlobalState.getItemsUrl
    axios
      .post(url, {
        // user: user.email,
        user: userId,
      })
      .then(json => {
        organizeColumns(json.data)
        setJobsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (userId) {
      // wait for user obj to be defined before fetching items for that user
      fetchItems(userId)
    }
  }, [userId])

  return (
    <>
      {jobsLoading ? (
        <div className="sweet-loading absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <HashLoader size={150} color={"#007bff"} loading={true} />
        </div>
      ) : (
        <>
          <Fade>
            <NewJob createNewJob={createNewJob} userId={userId} />
            <div className="flex user-select-none">
              {showNoteModal && <NoteModal column={noteModalColumn} />}
              <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
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
                              className="rounded overflow-y-scroll custom-scrollbar"
                              style={{
                                background: snapshot.isDraggingOver
                                  ? "#007bff"
                                  : "",
                                boxShadow: snapshot.isDraggingOver
                                  ? "inset 0 0 40px rgba(0, 0, 0,.20), inset 0 0 4px rgba(0, 0, 0,.5)"
                                  : "inset 0 0 40px rgba(0, 123, 255,.1), inset 0 0 4px rgba(0, 0, 0,.25)",
                                padding: "4px",
                                width: "275px",
                                minHeight: "500px",
                                maxHeight: "calc(100vh - 300px)",
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
                                          className="rounded relative"
                                          style={{
                                            userSelect: "none",
                                            padding: "16px",
                                            margin: "0 0 8px 0",
                                            minHeight: "50px",
                                            backgroundColor: "white",
                                            boxShadow: snapshot.isDragging
                                              ? "0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 4px 0 rgba(0, 0, 0, 0.10)"
                                              : "0 10px 20px rgba(0, 0, 0, 0.1)",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          {item.status === "interviewing" && (
                                            <div
                                              className="absolute right-0 top-10 transform -translate-x-4 cursor-pointer text-gray-400 hover:text-black transition-colors duration-500 ease-in-out"
                                              onClick={() => {
                                                setEditingItemIndex(index)
                                                setNoteModalColumn(
                                                  interviewingID
                                                )
                                                setShowNoteModal(true)
                                              }}
                                            >
                                              <svg
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-pencil-square"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path
                                                  fillRule="evenodd"
                                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                                />
                                              </svg>
                                            </div>
                                          )}
                                          {item.status === "offers" && (
                                            <div
                                              className="absolute right-0 top-10 transform -translate-x-4 cursor-pointer text-gray-400 hover:text-black transition-colors duration-500 ease-in-out"
                                              onClick={() => {
                                                setEditingItemIndex(index)
                                                setNoteModalColumn(offersID)
                                                setShowNoteModal(true)
                                              }}
                                            >
                                              <svg
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 16 16"
                                                className="bi bi-pencil-square"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path
                                                  fillRule="evenodd"
                                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                                />
                                              </svg>
                                            </div>
                                          )}
                                          <h6 className="mb-0">{item.role}</h6>
                                          <div className="text-gray-500 text-sm font-normal mb-2">
                                            {item.company}
                                          </div>
                                          {item.note && (
                                            <div className="text-black text-sm font-normal">
                                              {item.note}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    }}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                          )
                        }}
                      </Droppable>
                    </div>
                  )
                })}
                <TrashCan />
              </DragDropContext>
            </div>
          </Fade>
        </>
      )}
    </>
  )
}

export default DragNDrop
