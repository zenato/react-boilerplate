import cookies from 'cookies-js';
import React, { PropTypes } from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

function signOut() {
  cookies.expire('accessToken');
  window.location.href = '/';
}

const Header = ({ user }) => (
  <Navbar inverse fixedTop>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">
          <i className="fa fa-mixcloud" /> React Universal
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavDropdown
          eventKey={1}
          title={<span><i className="fa fa-database" /> Data</span>}
          id="basic-nav-dropdown"
        >
          <MenuItem eventKey={1.1}><i className="fa fa-picture-o" /> SubMenu 1</MenuItem>
          <MenuItem eventKey={1.2}><i className="fa fa-picture-o" /> SubMenu 2</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={1.4}><i className="fa fa-picture-o" /> SubMenu 3</MenuItem>
        </NavDropdown>

        <NavItem href="/board" eventKey={2}>
          <span><i className="fa fa-board" /> Board</span>
        </NavItem>
      </Nav>

      {user.signedInfo && (
        <Nav pullRight>
          <NavDropdown
            eventKey={9}
            title={
              <span>
                {user.signedInfo.photo && (
                  <img
                    src={user.signedInfo.photo}
                    className="profile img-circle"
                    alt="uesr profile"
                  />
                )}
                {user.signedInfo.name}
              </span>
            } id="basic-nav-dropdown"
          >
            <MenuItem eventKey={9.1} href="/setting">
              <i className="fa fa-gear" /> Setting
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={9.2} onClick={signOut}>
              <i className="fa fa-sign-out" /> Sign Out
            </MenuItem>
          </NavDropdown>
        </Nav>
      )}

      {!user.signedInfo && (
        <Nav pullRight>
          <NavItem href="/signIn" eventKey={1}>
            <span><i className="fa fa-sign-in" /> Sign In</span>
          </NavItem>
          <NavItem href="/signUp" eventKey={1}>
            <span><i className="fa fa-users" /> Sign Up</span>
          </NavItem>
        </Nav>
      )}
    </Navbar.Collapse>
  </Navbar>
);

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Header;
