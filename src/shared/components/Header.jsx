import React from 'react';
import PropTypes from 'prop-types';
import browserHistory from 'react-router/lib/browserHistory';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const push = pathname => (e) => {
  e.preventDefault();
  browserHistory.push({ pathname });
};

const Header = ({ user, signOut }) => (
  <Navbar inverse fixedTop>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="" onClick={push('/')}>
          <i className="fa fa-mixcloud" /> React Universal
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={2} onClick={push('/board')}>
          <span><i className="fa fa-board" /> Board</span>
        </NavItem>
      </Nav>

      {user.signedInfo && (
        <Nav pullRight>
          <NavDropdown
            id="basic-nav-dropdown"
            eventKey={9}
            title={
              <span>
                {user.signedInfo.photo && (
                  <img src={user.signedInfo.photo} className="profile img-circle" alt="uesr profile" />
                )}
                {user.signedInfo.name}
              </span>
            }
          >
            <MenuItem eventKey={9.1} onClick={push('/setting')}>
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
          <NavItem eventKey={1} onClick={push('/signIn')}>
            <span><i className="fa fa-sign-in" /> Sign In</span>
          </NavItem>
          <NavItem eventKey={1} onClick={push('/signUp')}>
            <span><i className="fa fa-users" /> Sign Up</span>
          </NavItem>
        </Nav>
      )}
    </Navbar.Collapse>
  </Navbar>
);

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
  signOut: PropTypes.func.isRequired,
};

export default Header;
