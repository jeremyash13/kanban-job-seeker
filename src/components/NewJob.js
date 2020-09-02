import React, { useState, useRef } from "react"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"
import Global from "../state/Global"
import ObjectID from "bson-objectid"

import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  Button,
} from "shards-react"

function NewJob({ createNewJob }) {
  const GlobalState = Global.useContainer()

  const [toggle, setToggle] = useState(false)
  const [roleValue, setRoleValue] = useState("")
  const [companyValue, setCompanyValue] = useState("")

  const [companyInvalid, setCompanyInvalid] = useState(false)
  const [roleInvalid, setRoleInvalid] = useState(false)

  const roleRef = useRef()
  const companyRef = useRef()

  const { user } = useAuth0()

  const toggleFunc = () => {
    setToggle(!toggle)
  }

  const submitNewToDB = async newJobItem => {
    const url = GlobalState.newJobItemUrl
    axios.post(url, newJobItem).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <Button size="sm" className="mb-4 mt-10" onClick={() => toggleFunc()}>
        + New
      </Button>
      {toggle && (
        <Modal open={toggle} toggle={toggleFunc} centered>
          <ModalHeader>Add New Job</ModalHeader>
          <ModalBody>
            <Form>
              <FormInput
                id="#role"
                placeholder="Role"
                autoComplete="off"
                invalid={roleInvalid}
                value={roleValue}
                innerRef={roleRef}
                className="mb-2"
                onKeyPress={e => {
                  if (e.charCode === 13) {
                    e.preventDefault()
                  }
                }}
                onChange={e => {
                  setRoleValue(e.value)
                }}
              />
              <FormInput
                id="#company"
                placeholder="Company"
                autoComplete="off"
                invalid={companyInvalid}
                value={companyValue}
                innerRef={companyRef}
                onKeyPress={e => {
                  if (e.charCode === 13) {
                    e.preventDefault()
                  }
                }}
                onChange={e => {
                  setCompanyValue(e.value)
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
                  if (roleRef.current.value !== "") {
                    setRoleInvalid(false)
                  } else {
                    setRoleInvalid(true)
                  }
                  if (companyRef.current.value !== "") {
                    setCompanyInvalid(false)
                  } else {
                    setCompanyInvalid(true)
                  }
                  if (!(roleInvalid && companyInvalid)) {
                    const newJobItem = {
                      _id: ObjectID().toString(),
                      user: user.email,
                      role: roleRef.current.value,
                      company: companyRef.current.value,
                      status: "applied",
                      note: "",
                    }
                    createNewJob([newJobItem])
                    submitNewToDB(newJobItem)
                    toggleFunc()
                  }
                }}
              >
                Add
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default NewJob
