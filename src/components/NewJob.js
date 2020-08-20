import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "shards-react";

function NewJob() {
  const [toggle, setToggle] = useState(false);
  const toggleFunc = () => {
    setToggle(!toggle);
  };
  return (
    <>
      <div
        className="cursor-pointer flex max-w-max-content mb-4 mt-10 font-normal hover:text-black transition-colors duration-300"
        onClick={() => toggleFunc()}
      >
        <span>+</span>
        <span>Add New Job</span>
      </div>
      {toggle && (
        <Modal open={toggle} toggle={toggleFunc} centered>
          <ModalHeader>Header</ModalHeader>
          <ModalBody>👋 Hello there!</ModalBody>
        </Modal>
      )}
    </>
  );
}

export default NewJob;
