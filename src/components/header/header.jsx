import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../authprovider'; 
import { Link as ScrollLink } from 'react-scroll'; 

const navLinks = [
  { display: 'Home', url: '/' },
  { display: 'Courses', url: 'courses' }, 
  { display: 'About Us', url: 'about' }, 
  { display: 'Contact Us', url: '/contact' },
];

const Header = () => {
  const { currentUser, logout } = useAuth(); 
  const location = useLocation(); 

  const handleLogout = async () => {
    try {
      await logout(); 
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="ri-pantone-line"></i> Learners.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navLinks.map((item, index) => (
              location.pathname === '/' && (item.url === 'about' || item.url === 'courses') ? (
                <ScrollLink 
                  key={index} 
                  to={item.url} 
                  smooth={true} 
                  duration={500} 
                  className="navbar-link"
                  style={{ 
                    color: '#3D3D3DF3', 
                    padding: '0.5rem 1rem', 
                    textDecoration: 'none', 
                    fontSize: '1rem', 
                    cursor: 'pointer',
                  }}
                  aria-label={`Go to ${item.display}`}
                >
                  {item.display}
                </ScrollLink>
              ) : (
                <Nav.Link key={index} as={Link} to={item.url}>
                  {item.display}
                </Nav.Link>
              )
            ))}
          </Nav>
          <Nav>
            {currentUser ? (
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">View Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>                
              <Nav.Link as={Link} to="/login">
                  <Button variant='success' style={{ backgroundColor: '#17bf9e', borderColor: '#17bf9e', color: '#fff' }}>Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  <Button variant="success" style={{ backgroundColor: '#17bf9e', borderColor: '#17bf9e', color: '#fff' }}>SignUp</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
