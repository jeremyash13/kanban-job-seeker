import React from "react";
// import  { Redirect } from 'react-router-dom'

import Layout from "../components/layout";

function auth0_callback() {

  window.location = window.location.origin + "/app"
  return (
    <Layout>
      <h1>
        Redirecting ...
      </h1>
    </Layout>
  )
}

export default auth0_callback
