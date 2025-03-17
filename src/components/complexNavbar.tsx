'use client';

import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NotificationBasket } from './NotifcationSystem/NotificationBasket';
import { NavbarLogin } from './profile/navbarlogin';
import { Folders, Identifier } from '../../FrontendRequests/Enums/Images';

const ComplexNavbar = () => {
  // Define styles with the correct type
  const navButtonStyle: { base: React.CSSProperties; hover: React.CSSProperties } = {
    base: {
      backgroundSize: '200% 200%',
      color: '#333',
      fontSize: '1rem',
      padding: '0.5rem 0.8rem',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      position: 'relative',
      transition: 'background-position 0.4s ease, color 0.4s ease',
    },
    hover: {
      backgroundPosition: 'right center',
      color: `${import.meta.env.LIGHT_PURPLE}`,
    },
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom"
      style={{
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/" style={{ textDecoration: 'none' }}>
          <img
            src={`https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.NAVBAR}.jpg`}
            alt="Navbar Logo"
            width={120}
            height={70}
            style={{ objectFit: 'contain' }}
          />
        </Navbar.Brand>

        {/* Center Navigation */}
        <Nav className="w-100 justify-content-center text-center">
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            {[
              { label: 'Butik', link: '/Butik' },
              { label: 'Kategorier', link: '/Kategorier' },
              { label: 'Privatpolitik', link: '/Privatpolitik' },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <a
                  href={item.link}
                  style={navButtonStyle.base}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, navButtonStyle.hover)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, navButtonStyle.base)
                  }
                >
                  {item.label}
                </a>
                {index < 4 && (
                  <span className="mx-1 text-dark d-none d-md-inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </Nav>

        {/* Right Icons */}
        <Nav className="ms-auto">
          <NotificationBasket />
          <NavbarLogin />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default ComplexNavbar;
