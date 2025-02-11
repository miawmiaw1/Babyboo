import React from 'react';

interface BillingInfoProps {
  sameAsShipping: boolean;
  setSameAsShipping: (value: boolean) => void;
}

export default function BillingInfo({
  sameAsShipping,
  setSameAsShipping,
}: BillingInfoProps) {
  return (
    <>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={sameAsShipping}
          onChange={() => setSameAsShipping(!sameAsShipping)}
        />
        <label className="custom-control-label"><strong>Samme som leveringsadresse</strong></label>
      </div>
    </>
  );
}
