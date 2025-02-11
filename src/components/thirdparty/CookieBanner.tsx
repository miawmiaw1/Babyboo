import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Tabs, Tab, Form, Button } from 'react-bootstrap';

export interface Settings {
  isvisible: boolean;
  CookieSettings: CookieSettings
}

interface CookieSettings {
  Nødvendig: boolean;
  Præferencer: boolean;
  Statistik: boolean;
  Markedsføring: boolean;
}

const CookieBannerModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('samtykke');
  const [settings, setSettings] = useState<CookieSettings>({
    Nødvendig: true,
    Præferencer: false,
    Statistik: false,
    Markedsføring: false,
  });
  const [loading, setLoading] = useState(true);

  const handleAllowAll = () => {
    const preferences : Settings = {
      isvisible : false,
      CookieSettings: {
        Nødvendig: true,
        Præferencer: true,
        Statistik: true,
        Markedsføring: true,
      } as CookieSettings

    }
    localStorage.setItem('CookieSettings', JSON.stringify(preferences));
    setIsVisible(preferences.isvisible);
  };

  const handleAllowSelected = () => {

    const preferences : Settings = {
      isvisible : false,
      CookieSettings: settings

    }

    localStorage.setItem('CookieSettings', JSON.stringify(preferences));
    setIsVisible(preferences.isvisible);
  };

  const handleReject = () => {
    const preferences : Settings = {
      isvisible : false,
      CookieSettings: {
        Nødvendig: true,
        Præferencer: false,
        Statistik: false,
        Markedsføring: false,
      } as CookieSettings

    }

    localStorage.setItem('CookieSettings', JSON.stringify(preferences));
    setIsVisible(preferences.isvisible);
  };

    useEffect(() => {
      const cookiesettings = localStorage.getItem("CookieSettings");
      if (cookiesettings !== null) {
        const preferences = JSON.parse(localStorage.getItem("CookieSettings") as string) as Settings
        if (preferences.isvisible) {
          setSettings(preferences.CookieSettings)
          setIsVisible(preferences.isvisible)
        } else {
          setSettings(preferences.CookieSettings)
          setIsVisible(preferences.isvisible)
        }
      } else {
      }
      setLoading(false);
    }, []);

  if (loading) return null;
  if (!isVisible) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed-top fixed-bottom fixed-left fixed-right bg-opacity-50 d-flex align-items-center justify-content-center">
      <div className="bg-white rounded-lg shadow-lg" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div className="fw-bold fs-5">{import.meta.env.STORENAME}</div>
          <div className="text-muted small">Powered by {import.meta.env.STORENAME}</div>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'samtykke')}
          className="mb-3"
        >
          <Tab eventKey="samtykke" title="Samtykke">
            <div className="p-4">
              <h2 className="fs-4 fw-semibold mb-3">Denne hjemmeside bruger cookies</h2>
              <p className="text-muted small mb-4">
                Vi ønsker dit samtykke til at anvende cookies og indsamle persondata om IP-adresse, ID og din browser til statistik og marketingformål. Disse oplysninger videregives til vores samarbejdspartnere, der opbevarer og tilgår oplysninger på din enhed for at vise dig målrettede annoncer, levere tilpasset indhold, foretage annonce- og indholdsmåling, lave produktudvikling og opnå målgruppeindsigt. Se mere information under indstillinger og i vores persondatapolitik.
              </p>

              <h3 className="fs-6 text-muted mb-2">Du kan altid:</h3>
              <p className="text-muted small mb-4">Ændre dine valg i bunden af hjemmesiden ved at klikke på <strong>Cookie indstillinger</strong></p>

              <div className="row mb-4">
                {['Nødvendig', 'Præferencer', 'Statistik', 'Markedsføring'].map((label, index) => (
                  <div key={label} className="col-3 text-center">
                <style>
                    {`
                    .custom-switch .form-check-input:checked {
                        background-color: ${import.meta.env.LIGHT_PURPLE};
                        border-color: ${import.meta.env.LIGHT_PURPLE};
                    }
                    `}
                </style>
                    <Form.Check
                      type="switch"
                      id={`cookie-switch-${index}`}
                      label={label}
                      checked={settings[label as keyof CookieSettings]}
                      onChange={(e) => setSettings(prev => ({ ...prev, [label]: e.target.checked }))}
                      disabled={label === 'Nødvendig'}
                      className="custom-switch"
                    />
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={handleReject} className="flex-grow-1">
                  Afvis
                </Button>
                <Button variant="outline-primary" onClick={handleAllowSelected} className="flex-grow-1">
                  Tillad valgte
                </Button>
                <Button variant="primary" onClick={handleAllowAll} className="flex-grow-1">
                  Tillad alle
                </Button>
              </div>
            </div>
          </Tab>
          <Tab eventKey="Cookiepolitik" title="Cookie-Politik">
            <div className="p-4">
              <h3 className="fs-6 text-muted mb-2">Nødvendig</h3>
              <p className="text-muted small mb-4">Sikrer webshoppen fungerer korrekt, fx ved login og betaling</p>

              <h3 className="fs-6 text-muted mb-2">Præferencer</h3>
              <p className="text-muted small mb-4">Husker dine valg, fx sprog og valutaindstillinger</p>

              <h3 className="fs-6 text-muted mb-2">Statistik</h3>
              <p className="text-muted small mb-4">Indsamler anonym data til at forbedre brugeroplevelsen</p>

              <h3 className="fs-6 text-muted mb-2">Markedsføring</h3>
              <p className="text-muted small mb-4">Bruges til målrettet reklame og tilbud</p>

            </div>
          </Tab>
          <Tab eventKey="Privatpolitik" title="Privat-Politik">
            <div className="p-4">
            <p className="text-muted small mb-4">Du kan altid læse om vores privatpolitik ved at klikke på: </p>
            <h3 className="fs-6 text-muted mb-2">
              <a href="/Privatpolitik" className="text-muted text-decoration-none">Privatpolitik</a>
            </h3>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>,
    document.body
  );
};

export default CookieBannerModal;
