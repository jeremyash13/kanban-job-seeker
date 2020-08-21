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
  FormFeedback,
  Button,
} from "shards-react";

function NewJob({ setAppliedColumn }) {
  const [toggle, setToggle] = useState(false);
  const [roleValue, setRoleValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");

  const [companyInvalid, setCompanyInvalid] = useState(false);
  const [roleInvalid, setRoleInvalid] = useState(false);

  const roleRef = useRef();
  const companyRef = useRef();

  const submitToDB = async () => {
    // axios
    //   .put("http://localhost:4000/items", {
    //     _id: null,
    //     user: "john", // SWAP OUT FOR CURRENTLY LOGGED IN USER WHEN USER AUTH IS SET UP
    //     role: roleRef.current.value,
    //     company: companyRef.current.value,
    //     status: "applied",
    //     info: null,
    //   })
    //   .then((res) => console.log(res.data.message));
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
                  invalid={roleInvalid}
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
                invalid={companyInvalid}
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
