import React, { useState, type JSX } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Privatpolitiks = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderSection = (section: string, title: string, content: string | JSX.Element) => {
    return (
      <Card className="mb-4">
        <Card.Header as="h5" onClick={() => handleToggle(section)} style={{ cursor: 'pointer' }}>
          {title}
        </Card.Header>
        {openSection === section && (
          <Card.Body>
            {/* Check if content is a string or JSX.Element */}
            {typeof content === 'string' ? (
              <p dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              content
            )}
          </Card.Body>
        )}
      </Card>
    );
  };

  return (
    <Container className="my-5">
      <Row className="text-center mb-4">
        <Col>
          <h1>Privatlivspolitik for {import.meta.env.COMPANYNAME}</h1>
        </Col>
      </Row>

      {renderSection(
        'section1',
        'Introduktion',
        `Hos ${import.meta.env.STORENAME} tager vi beskyttelsen af dine personlige oplysninger meget alvorligt. Denne
        privatlivspolitik beskriver, hvordan vi indsamler, bruger, opbevarer og beskytter dine personlige data,
        når du interagerer med vores hjemmeside, kontakter os, eller benytter vores bygge- og murertjenester. Vi
        sikrer, at dine personlige data behandles i overensstemmelse med gældende lovgivning, herunder EU's General
        Data Protection Regulation (GDPR).`
      )}

      {renderSection(
        'section2',
        'Hvilke personoplysninger indsamler vi?',
        `Vi indsamler personoplysninger som navn, adresse, telefonnummer, e-mailadresse, personnummer (ved behov),
        oplysninger om byggeprojekter og betalingsoplysninger for at kunne tilbyde vores tjenester.`
      )}

      {renderSection(
        'section3',
        'Hvordan indsamler vi dine personoplysninger?',
        `Dine personoplysninger indsamles direkte fra dig, automatisk via vores hjemmeside (f.eks. cookies og
        IP-adresser), samt fra tredjeparter som samarbejdspartnere eller sociale platforme.`
      )}

      {renderSection(
        'section4',
        'Hvorfor indsamler vi dine personoplysninger?',
        `Vi bruger dine oplysninger til at opfylde kontraktlige forpligtelser, kommunikere med dig, overholde
        lovgivningen og forbedre vores service.`
      )}

      {renderSection(
        'section5',
        'Hvem deler vi dine personoplysninger med?',
        `Vi deler kun dine data med vores ansatte, samarbejdspartnere, leverandører, offentlige myndigheder (hvis
        nødvendigt) og forsikringsselskaber ved skader eller forsikringskrav. Vi sælger aldrig dine personoplysninger
        til tredjepart.`
      )}

      {renderSection(
        'section6',
        'Hvordan beskytter vi dine personoplysninger?',
        `Vi beskytter dine oplysninger med sikre servere, kryptering, begrænset adgang for medarbejdere og regelmæssige
        sikkerhedsvurderinger.`
      )}

      {renderSection(
        'section7',
        'Hvor længe opbevarer vi dine personoplysninger?',
        `Vi opbevarer dine data, så længe det er nødvendigt for formålet med indsamlingen og for at overholde
        lovgivningen. Når dataene ikke længere er nødvendige, sletter vi dem.`
      )}

      {renderSection(
        'section8',
        'Dine rettigheder',
        `Du har ret til indsigt i, berigtigelse af, sletning af og begrænsning af behandlingen af dine personoplysninger.
        Du har også ret til dataportabilitet og indsigelse.`
      )}

      {renderSection(
        'section9',
        'Cookies og sporingsteknologier',
        `Vores hjemmeside bruger cookies for at forbedre din oplevelse og levere relevante tjenester. Vi anvender
        nødvendige cookies, præference-cookies, statistik-cookies og marketing-cookies. Du kan administrere eller
        slette cookies via Cookie-indstillinger i bunden af siden.`
      )}

      {renderSection(
        'section10',
        'Ændringer i privatlivspolitikken',
        `Vi forbeholder os retten til at opdatere denne politik. Eventuelle ændringer offentliggøres på vores hjemmeside.`
      )}

      {renderSection(
        'section11',
        'Kontaktoplysninger',
        `Har du spørgsmål, kontakt os venligst på: <br />
        <strong>${import.meta.env.STORENAME}</strong>
        <br />
        <strong>${import.meta.env.STOREADDRESS}</strong>
        <br />
        <strong>${import.meta.env.STOREPHONE}</strong>
        <br />
        <strong>${import.meta.env.STOREEMAIL}</strong>`
      )}

      {renderSection(
        'section12',
        'Returret',
        `I henhold til dansk lovgivning har du som forbruger 14 dages fortrydelsesret ved køb af varer online. Hvis du ønsker at returnere en vare, skal den være i ubrugt og ubeskadiget stand. Kontakt os inden for de 14 dage for at arrangere en returnering. Fragtomkostninger i forbindelse med returnering afholdes af kunden.`
      )}
      
      {renderSection(
        'section13',
        'Reklamation',
        `Som forbruger har du ifølge dansk købelov en reklamationsret på 2 år. Det betyder, at du kan få en defekt vare repareret, ombyttet eller få pengene tilbage afhængigt af situationen. Hvis du opdager en fejl eller mangel ved din vare, bedes du kontakte os hurtigst muligt med dokumentation for fejlen.`
      )}
    </Container>
  );
};

export default Privatpolitiks;
