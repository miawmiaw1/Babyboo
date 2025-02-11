import React from 'react';
import OrderTable from './OrderTable';
import type { User } from '../../../FrontendRequests/Requests-Api/User';

interface Props {
  isadmin: boolean,
  Userprofile: User
}

const OrderPanel = ({ isadmin, Userprofile }: Props) => {
  return (
    <div className="container-fluid p-2">

      {/* Product list section */}
      <div className="mt-4 bg-white rounded shadow-lg" style={{ width: '73%', margin: '0 auto' }}>
        {isadmin ? (
          <OrderTable userid={null} isadmin={isadmin} />
        ) : (
          <OrderTable userid={Userprofile.userid.toString()} isadmin={isadmin} />
        )}
      </div>
    </div>
  );
};

export default OrderPanel;