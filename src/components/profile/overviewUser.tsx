import React from "react";
import { Row, Col, Card } from 'react-bootstrap';
import OrderTable from '../order/OrderTable';
import { type User} from "../../../FrontendRequests/Requests-Api/User"
interface Props {
  Userprofile: User;
  TotalPrice: Number;
}

const OverviewUser = ({ Userprofile, TotalPrice }: Props) => {

  return (
    <>
      <style>
        {`
          .dashboard-card {
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: none;
          }

          .icon-wrapper {
            display: inline-block;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
          }

          .account-icon-placeholder::before {
            content: '💰'; /* Replace with a relevant icon */
            font-size: 24px;
          }

          .loyalty-icon-placeholder::before {
            content: '🎁'; /* Replace with a relevant icon */
            font-size: 24px;
          }

          .wishlist-icon-placeholder::before {
            content: '⭐'; /* Replace with a relevant icon */
            font-size: 24px;
          }

          .coupon-icon-placeholder::before {
            content: '🏷'; /* Replace with a relevant icon */
            font-size: 24px;
          }

          .text-muted {
            color: #6c757d !important;
          }

          .text-primary {
            color: #5f63f2 !important;
          }

          .text-warning {
            color: #f2994a !important;
          }

          .icon-wrapper.account-icon-placeholder {
            background-color: #EAE6FB;
          }

          .icon-wrapper.loyalty-icon-placeholder {
            background-color: #EAF7E6;
          }

          .icon-wrapper.wishlist-icon-placeholder {
            background-color: #FFF3E6;
          }

          .icon-wrapper.coupon-icon-placeholder {
            background-color: #E6F4FF;
          }

          p {
            margin-bottom: 0;
          }
        `}
      </style>

      <Row>
        {/* Account Balance Card */}
        <Col md={6}>
          <Card className="dashboard-card p-3 mb-3">
            <p className="icon-wrapper account-icon-placeholder">
              <i className="account-icon"></i>
            </p>
            <h6>Total spent</h6>
            <h5 className="text-primary">{TotalPrice.toLocaleString()} Kr. <span className="text-muted">Spent</span></h5>
            <p className="text-muted">On products purchased</p>
          </Card>
        </Col>

        {/* Loyalty Program Card */}
        <Col md={6}>
          <Card className="dashboard-card p-3 mb-3">
            <p className="icon-wrapper loyalty-icon-placeholder">
              <i className="loyalty-icon"></i>
            </p>
            <h6>Loyalty Program</h6>
            <span
              className={`badge bg-success`}
              style={{
                color: `${import.meta.env.LIGHT_PURPLE}`,
                minWidth: '150px', // Set a minimum width to ensure it's wider than the text
              }}
            >
              {Userprofile.member_type}
            </span>
          </Card>
        </Col>
        <div>
          <OrderTable userid={Userprofile.userid.toString()} />
        </div>
      </Row>
    </>
  );
};

export default OverviewUser;