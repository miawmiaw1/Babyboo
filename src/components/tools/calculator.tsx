import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Calculator: React.FC = () => {
  const [number, setNumber] = useState<number | "">("");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = (percentage: number) => {
    if (number !== "") {
      const calculatedResult = number + (number * percentage) / 100;
      setResult(calculatedResult);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Percentage Calculator</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Enter a number:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter a number"
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    onClick={() => handleCalculate(20)}
                  >
                    Add 20%
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleCalculate(25)}
                  >
                    Add MOMS
                  </Button>
                </div>
              </Form>

              {result !== null && (
                <Card.Text className="mt-3 text-center">
                  Final Result: <strong>{result}</strong>
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Calculator;
