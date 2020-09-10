import React from "react"
import DragNDrop from "../components/DragNDrop"
import Navbar from "../components/Navbar"
import { Fade } from "shards-react"
import Global from "../state/Global"
import SEO from "../components/seo"
import { navigate } from "gatsby"
import { useAuth } from "react-use-auth"

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"

function App() {
  const { isAuthenticated } = useAuth()
  const isBrowser = typeof window !== `undefined`

  if (!isAuthenticated() && isBrowser) {
    // need to check if Window Object is defined when calling navigate() or build will fail
    navigate("/")
    return null
  } else {
    return (
      <Global.Provider>
        <Fade>
          <SEO title="Board" />
          <div className="p-4">
            <Navbar />
            <DragNDrop />
          </div>
        </Fade>
      </Global.Provider>
    )
  }
}

export default App
