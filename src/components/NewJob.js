import React, { useState, useRef } from "react";
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
                      _id: "69",
                      user: "john",
                      role: roleRef.current.value,
                      company: companyRef.current.value,
                      status: "applied",
                      info: null,
                    },
                  ]);
                  toggleFunc()
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
