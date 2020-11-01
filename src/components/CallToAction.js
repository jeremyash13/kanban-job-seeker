import { Link } from "gatsby"
import React from "react"
import { useAuth } from "react-use-auth"

function CallToAction() {
  // const { login } = useAuth()
  return (
    <Link
      to="/app"
      className="px-3 py-2 border-2 inline-block border-white rounded-full text-whitewhite text-decoration-none cursor-pointer hover:bg-white hover:text-primary transition-colors duration-300 ease-in-out"
    >
      Get Started
    </Link>
  )
}

export default CallToAction
