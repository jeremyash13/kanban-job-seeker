import React from "react"
import { Auth0Provider } from "@auth0/auth0-react"

// import { navigate } from "gatsby"

export const wrapRootElement = ({ element }) => (
  <Auth0Provider
    domain="dev-l1stdfne.us.auth0.com"
    clientId="qHGoa91ym1iXRSiC8QOZD1IoRRdsqCm2"
    redirectUri={window.location.origin + "/app"}
  >
    {element}
  </Auth0Provider>
)
