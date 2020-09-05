import React, { useEffect } from "react"
import Layout from "../components/layout"
import { useAuth } from "react-use-auth"

function Auth0CallbackPage() {
  const { handleAuthentication } = useAuth()

  useEffect(() => {
    handleAuthentication({ postLoginRoute: "/app" })
  }, [])

  return (
    <Layout>
      <h1>Redirecting ...</h1>
    </Layout>
  )
}

export default Auth0CallbackPage