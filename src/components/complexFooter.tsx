import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import type { Settings } from './thirdparty/CookieBanner';
import { useEffect, useState, type SetStateAction } from "react";

export default function ComplexFooter() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    // Dynamically load the Trustpilot script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <footer className="w-full py-5 bg-white">
      <Container>
        {/* Footer Columns */}
        <Row className="mb-4">
          {/* Gallery Column */}
          <Col md={6} lg={3} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kontakt os</h3>
            <ul className="list-unstyled">
              <li>
                <a className="text-gray-600 hover:text-gray-900">
                  <strong>E-mail: </strong>
                  <a>{import.meta.env.STOREEMAIL}</a>
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900">
                  <strong>TLF: </strong>
                  <a>{import.meta.env.STOREPHONE}</a>
                  <br></br>
                  <br></br>
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900">
                  <strong>Telefonåbningstider: </strong>
                  <br></br>
                  <a>Mandag - Fredag: 10:00 - 15:00</a>
                </a>
              </li>
            </ul>
          </Col>

          {/* Marketplace Column */}
          <Col md={6} lg={3} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Godt at vide</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/Privatpolitik" className="text-blue-500 hover:text-blue-600">
                  Information
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="#"
                  className="text-gray-600 hover:text-gray-900" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation if needed

                    const cookiesettings = localStorage.getItem("CookieSettings");

                    if (cookiesettings !== null) {
                      const preferences = JSON.parse(localStorage.getItem("CookieSettings") as string) as Settings
                      preferences.isvisible = true;
                      localStorage.setItem('CookieSettings', JSON.stringify(preferences));
                
                      window.location.href = "/"
                    }
                  }}
                >
                  Cookie indstillinger
                </a>
              </li>
              <li className="mb-2">
                <a href="/Privatpolitik" className="text-blue-500 hover:text-blue-600">
                  Privatpolitik
                </a>
              </li>
            </ul>
          </Col>

          {/* Magazine Column */}
          <Col md={6} lg={3} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kunderservice</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/Privatpolitik" className="text-blue-500 hover:text-blue-600">
                  Fragt - og levering
                </a>
              </li>
              <li className="mb-2">
                <a href="/Privatpolitik" className="text-blue-500 hover:text-blue-600">
                  Handelsbetingelser
                </a>
              </li>
              <li className="mb-2">
                <a href="/Privatpolitik" className="text-blue-500 hover:text-blue-600">
                  Privatpolitik
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="pt-3 border-top">
          <Col className="d-flex justify-content-between flex-wrap">
            <div className="mb-2">
              <a href="/Privatpolitik" className="text-gray-600 hover:text-gray-900 me-3">
                <strong>Privatpolitik</strong>
              </a>
              <strong>|  </strong>
              <a 
                  href="#"
                  className="text-gray-600 hover:text-gray-900" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation if needed

                    const cookiesettings = localStorage.getItem("CookieSettings");

                    if (cookiesettings !== null) {
                      const preferences = JSON.parse(localStorage.getItem("CookieSettings") as string) as Settings
                      preferences.isvisible = true;
                      localStorage.setItem('CookieSettings', JSON.stringify(preferences));
                
                      window.location.href = "/"
                    }
                  }}
                >
                  <strong>Cookie indstillinger</strong>
                  <strong>|  </strong>
                  <strong>CVR: {import.meta.env.STORECVR}</strong>
                </a>
            </div>
            <div className="trustpilot-widget" data-locale="da-DK" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="67961ff417619e19c8e61c8f" data-style-height="52px" data-style-width="100%">
                  <a href="https://dk.trustpilot.com/review/trumpbuybutik.dk" target="_blank" rel="noopener">Trustpilot</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
