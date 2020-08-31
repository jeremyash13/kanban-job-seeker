import React from "react"
import { useAuth0 } from "@auth0/auth0-react"

function CallToAction() {
  const { loginWithRedirect } = useAuth0()
  return (
    <div
      className="px-3 py-2 border-2 inline-block border-white rounded-full text-whitewhite text-decoration-none cursor-pointer hover:bg-white hover:text-primary transition-colors duration-300 ease-in-out"
      onClick={() => {
        loginWithRedirect()
      }}
    >
      Get Started
    </div>
  )
}

export default CallToAction
