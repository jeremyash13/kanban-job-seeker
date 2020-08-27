import { useState } from "react";
import { createContainer } from "unstated-next";

const useGlobal = () => {
    // DEV URLS
  const [updateItemUrl] = useState("http://localhost:4000/updateitem");
  const [deleteItemUrl] = useState("http://localhost:4000/deleteitem");
  const [newJobItemUrl] = useState("http://localhost:4000/items");
  const [getItemsUrl] = useState("http://localhost:4000/items");

//   PROD URLS
//   const [updateItemUrl] = useState("/updateitem");
//   const [deleteItemUrl] = useState("/deleteitem");
//   const [newJobItemUrl] = useState("/items");
//   const [getItemsUrl] = useState("/items");

  return {
    updateItemUrl,
    deleteItemUrl,
    newJobItemUrl,
    getItemsUrl,
  };
};

const Global = createContainer(useGlobal);
export default Global;
