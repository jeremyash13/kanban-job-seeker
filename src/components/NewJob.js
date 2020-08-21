import React, { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  FormGroup,
  Button,
} from "shards-react";

function NewJob({ setAppliedColumn }) {
  const [toggle, setToggle] = useState(false);
  const [roleValue, setRoleValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");

  const roleRef = useRef();
  const companyRef = useRef();

  const submitToDB = async () => {
    axios
      .put("http://localhost:4000/items", {
        _id: null,
        user: "john", // SWAP OUT FOR CURRENTLY LOGGED IN USER WHEN USER AUTH IS SET UP
        role: roleRef.current.value,
        company: companyRef.current.value,
        status: "applied",
        info: null,
      })
      .then((res) => console.log(res.data.message));
  };

  const toggleFunc = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Button
        outline
        size="sm"
        className="mb-4 mt-10"
        onClick={() => toggleFunc()}
      >
        + New
      </Button>
      {toggle && (
        <Modal open={toggle} toggle={toggleFunc} centered>
          <ModalHeader>Add New Job</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <FormInput
                  id="#role"
                  placeholder="Role"
                  autocomplete="off"
                  value={roleValue}
                  innerRef={roleRef}
                  onChange={(e) => {
                    setRoleValue(e.value);
                  }}
                />
              </FormGroup>
              <FormInput
                id="#company"
                placeholder="Company"
                autocomplete="off"
                value={companyValue}
                innerRef={companyRef}
                onChange={(e) => {
                  setCompanyValue(e.value);
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
                  setAppliedColumn([
                    {
                      _id: uuid(),
                      user: "john", // SWAP OUT FOR CURRENTLY LOGGED IN USER WHEN USER AUTH IS SET UP
                      role: roleRef.current.value,
                      company: companyRef.current.value,
                      status: "applied",
                      info: null,
                    },
                  ]);
                  submitToDB();
                  toggleFunc();
                }}
              >
                Add
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default NewJob;
