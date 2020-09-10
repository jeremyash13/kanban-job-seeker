import React, { useState } from "react"
import {
  Nav,
  NavItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  NavLink,
} from "shards-react"
import { useAuth } from "react-use-auth"
import SimpleSeekLogoApp from "./SimpleSeekLogoApp"

const LogoutIcon = () => {
  return (
    <div className="my-auto">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        className="bi bi-power"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M5.578 4.437a5 5 0 1 0 4.922.044l.5-.866a6 6 0 1 1-5.908-.053l.486.875z"
        />
        <path fillRule="evenodd" d="M7.5 8V1h1v7h-1z" />
      </svg>
    </div>
  )
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [toggle, setToggle] = useState(false)
  return (
    <div className="flex">
      <div className="mr-auto">
        <SimpleSeekLogoApp />
      </div>
      <Nav>
        <NavItem>
          {isAuthenticated() && (
            <Fade>
              <Dropdown
                open={toggle}
                toggle={() => setToggle(!toggle)}
                size="md"
                className="mr-2"
              >
                <DropdownToggle nav caret>{`Hi, ${user.email}`}</DropdownToggle>
                <DropdownMenu small right>
                  <DropdownItem onClick={() => logout()}>
                    <div className="flex align-bottom">
                      <LogoutIcon />
                      <span className="ml-2">Log Out</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Fade>
          )}
        </NavItem>
      </Nav>
    </div>
  )
}

export default Navbar
