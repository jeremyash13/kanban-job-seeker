import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "shards-react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button pill size="sm" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
};

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth0();
  const [toggle, setToggle] = useState(false);
  return (
    <div className="flex">
      <Nav className="w-max-content ml-auto">
        <NavItem>
          {isAuthenticated ? (
            <NavItem>
              <Dropdown
                open={toggle}
                toggle={() => setToggle(!toggle)}
                size="md"
                className="mr-2"
              >
                <DropdownToggle nav caret>{`Hi, ${user.email}`}</DropdownToggle>
                <DropdownMenu small right>
                  <DropdownItem
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          ) : (
            <LoginButton />
          )}
        </NavItem>
      </Nav>
    </div>
  );
}

export default Navbar;
