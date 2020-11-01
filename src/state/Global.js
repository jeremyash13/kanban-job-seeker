import { useState } from "react"
import { createContainer } from "unstated-next"

const useGlobal = () => {
  // DEV URLS
  // const [updateItemUrl] = useState("http://localhost:4000/updateitem")
  // const [deleteItemUrl] = useState("http://localhost:4000/deleteitem")
  // const [newJobItemUrl] = useState("http://localhost:4000/newitem")
  // const [getItemsUrl] = useState("http://localhost:4000/items")

  //   PROD URLS
  const [updateItemUrl] = useState("https://6gy4adv3v1.execute-api.us-east-1.amazonaws.com/production/updateitem");
  const [deleteItemUrl] = useState("https://6gy4adv3v1.execute-api.us-east-1.amazonaws.com/production/deleteitem");
  const [newJobItemUrl] = useState("https://6gy4adv3v1.execute-api.us-east-1.amazonaws.com/production/newitem");
  const [getItemsUrl] = useState("https://6gy4adv3v1.execute-api.us-east-1.amazonaws.com/production/items");


  return {
    updateItemUrl,
    deleteItemUrl,
    newJobItemUrl,
    getItemsUrl,
  }
}

const Global = createContainer(useGlobal)
export default Global
