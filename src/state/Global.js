import { useState } from "react";
import { createContainer } from "unstated-next";

const useGlobal = () => {
  const [result, setResult] = useState({});
  return {
    result,
    setResult,
  };
};

const Global = createContainer(useGlobal);
export default Global;
