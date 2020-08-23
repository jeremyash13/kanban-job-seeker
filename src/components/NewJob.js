import React, { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  FormGroup,
  Button,
} from "shards-react";
import { ObjectId } from "mongodb";

function NewJob({ createNewJob }) {
  const [toggle, setToggle] = useState(false);
  const [roleValue, setRoleValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");

  const [companyInvalid, setCompanyInvalid] = useState(false);
  const [roleInvalid, setRoleInvalid] = useState(false);

  const roleRef = useRef();
  const companyRef = useRef();

  const { user } = useAuth0();

  const toggleFunc = () => {
    setToggle(!toggle);
  };

  const submitNewToDB = async (newJobItem) => {
    axios
      .put("http://localhost:4000/items", newJobItem)
      .then((res) => console.log(res.data.message));
  };

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
                onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setRoleValue(e.value);
                }}
              />
              <FormInput
                id="#company"
                placeholder="Company"
                autoComplete="off"
                invalid={companyInvalid}
                value={companyValue}
                innerRef={companyRef}
                onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    e.preventDefault();
                  }
                }}
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
                  if (roleRef.current.value !== "") {
                    setRoleInvalid(false);
                  } else {
                    setRoleInvalid(true);
                  }
                  if (companyRef.current.value !== "") {
                    setCompanyInvalid(false);
                  } else {
                    setCompanyInvalid(true);
                  }
                  if (!roleInvalid && !companyInvalid) {
                    const newJobItem = {
                      _id: ObjectId(),
                      user: user.email,
                      role: roleRef.current.value,
                      company: companyRef.current.value,
                      status: "applied",
                      note: null,
                    };
                    createNewJob([newJobItem]);
                    submitNewToDB(newJobItem);
                    toggleFunc();
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
  );
}

export default NewJob;
