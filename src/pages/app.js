import React, { useState, useEffect } from "react"
import DragNDrop from "../components/DragNDrop"
import Navbar from "../components/Navbar"
import { Fade } from "shards-react"
import Global from "../state/Global"
import SEO from "../components/seo"

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"

import useCookie from "../hooks/useCookie"

function App() {
  // const isBrowser = typeof window !== `undefined`
  const { isFound, newCookie, getUser } = useCookie()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (!isFound) {
      // create cookie
      newCookie()
    }

    setUserId(getUser())
  }, [])

  return (
    <Global.Provider>
      <Fade>
        <SEO title="Board" />
        <Navbar />
        <div className="p-4">
          <DragNDrop userId={userId} />
        </div>
      </Fade>
    </Global.Provider>
  )
}

export default App
