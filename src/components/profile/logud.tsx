import React, { useEffect } from "react";
const Logudformular = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("jwtToken")
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className='d-flex justify-content-center'>
      <p>You will be redirected to the main page in 3 seconds...</p>
    </div>
  );
};

export default Logudformular;