import React, { useEffect, useState } from 'react';
import { UpdateOrder, type Order } from '../../../FrontendRequests/Requests-Api/Order';
import { statusenum } from '../../../FrontendRequests/Enums/status';
import { Button } from 'react-bootstrap';

interface Props {
  order: Order;
}

export default function Editorder({ order }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<number>(); // Change to number

  useEffect(() => {
    setSelectedStatus(order.statusid)
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(Number(event.target.value)); // Ensure the value is parsed as a number
  };

  const handlePrintStatus = () => {
    if (selectedStatus !== null) {
      // Find the key corresponding to the selected status value
      const statusKey = Object.keys(statusenum).find(
        (key) => statusenum[key as keyof typeof statusenum] === selectedStatus
      );
      
      if (statusKey) {
        order.statusid = statusenum[statusKey as keyof typeof statusenum];

        UpdateOrder(order.orderid, order).then((result) => {
          if (result.result) {
            alert(`Status Ændret til: ${statusKey}`);
          } else {
            alert("Status kunne ikke ændres");
          }
        });
      }
    } else {
      alert('No status selected!');
    }
  };

  return (
    <>
      <div className="edit-order-container">
        <div className="form-group">
          <label htmlFor="status-select" className="form-label">
            Ændre status
          </label>
          <select
            id="status-select"
            className="form-control"
            value={selectedStatus ?? ''} // Ensure selectedStatus is matched with value
            onChange={handleSelectChange}
          >
            <option value="" disabled>Select status</option>
            {Object.entries(statusenum).map(([key, value], index) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <Button className="print-button" onClick={handlePrintStatus}>
          Change
        </Button>
      </div>

      {/* Inline styles */}
      <style>{`
        .edit-order-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .form-group {
          width: 300px;
          margin-bottom: 20px;
          text-align: center; /* Center-align text in the group */
        }

        .form-label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 1.2rem;
          text-align: center; /* Center-align the label */
        }

        .form-control {
          width: 100%;
          font-size: 1rem;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .print-button {
          background-color: purple;
          border-color: purple;
          color: white;
          margin-top: 10px;
        }

        .print-button:hover {
          background-color: darkviolet;
          border-color: darkviolet;
        }
      `}</style>
    </>
  );
}
