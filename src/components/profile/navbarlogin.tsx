import React, { useEffect, useState } from 'react';
import { IsLoggedIn } from '../../../FrontendRequests/Requests-Api/User';
import { UserRoles } from '../../../FrontendRequests/Enums/Usertypes';

export const NavbarLogin = () => {
  const [LoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [UserType, setUserType] = useState<number | null>(null);

  const checkLoginStatus = async () => {
    try {
      const result = await IsLoggedIn();
      setIsLoggedIn(result.result);
      setUserType(result.data.user.membertypeid);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUserType(0);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      {LoggedIn ? (
        <li className="nav-item dropdown pe-2 d-flex align-items-center">
            <a href="#" className="p-0 nav-link" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="mdi mdi-shield-account-outline" style={{ 
                fontSize: '24px', 
                color: 'currentColor',
                marginBottom: "4px",
                transition: 'color 0.3s ease' 
                }} 
                onMouseEnter={(e) => e.currentTarget.style.color = 'orange'} 
                onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                ></i>
            </a>
            {UserType === UserRoles.USER && (
                <div className="position-relative">
                    <ul className="px-2 py-3 dropdown-menu dropdown-menu-end w-auto" 
                        aria-labelledby="dropdownMenuButton" 
                        data-bs-popper="static">
                        <li className="mb-2">
                            <a className="dropdown-item border-radius-md" href="Brugerpanel">
                                <div className="py-1 d-flex">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                    <div className="d-flex flex-column justify-content-center">
                                        <span className="font-weight-bold ps-2 fg-dark">Brugerpanel-Panel</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className="dropdown-item border-radius-md" href="/Logud">
                                <div className="py-1 d-flex">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    <div className="d-flex flex-column justify-content-center">
                                        <span className="font-weight-bold ps-2 fg-dark">Logud</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>

            )}
            {UserType === UserRoles.WORKER && (
                <div className="position-relative">
                    <ul className="px-2 py-3 dropdown-menu dropdown-menu-end w-auto" 
                        aria-labelledby="dropdownMenuButton" 
                        data-bs-popper="static">
                        <li className="mb-2">
                            <a className="dropdown-item border-radius-md" href="Medarbejderpanel">
                                <div className="py-1 d-flex">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                    <div className="d-flex flex-column justify-content-center">
                                        <span className="font-weight-bold ps-2 fg-dark">Medarbejder-Panel</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className="dropdown-item border-radius-md" href="/Logud">
                                <div className="py-1 d-flex">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    <div className="d-flex flex-column justify-content-center">
                                        <span className="font-weight-bold ps-2 fg-dark">Logud</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>

            )}
            {UserType === UserRoles.ADMIN && (
                <ul className="px-2 py-3 dropdown-menu dropdown-menu-end w-auto" 
                aria-labelledby="dropdownMenuButton" 
                data-bs-popper="static">
                <li className="mb-2">
                    <a className="dropdown-item border-radius-md" href="Adminstratorpanel">
                        <div className="py-1 d-flex">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                            <div className="d-flex flex-column justify-content-center">
                                <span className="font-weight-bold ps-2 fg-dark">Adminstrator-Panel</span>
                            </div>
                        </div>
                    </a>
                </li>
                <li className="mb-2">
                    <a className="dropdown-item border-radius-md" href="/Logud">
                        <div className="py-1 d-flex">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <div className="d-flex flex-column justify-content-center">
                                <span className="font-weight-bold ps-2 fg-dark">Logud</span>
                            </div>
                        </div>
                    </a>
                </li>
                </ul>
            )}
        </li>
      ) : (
        <a href="Login" className="p-0 nav-link" id="dropdownMenuButton" aria-expanded="false">
            <a style={{ 
                fontSize: '15px', 
                transition: 'color 0.3s ease' 
                }} 
                onMouseEnter={(e) => e.currentTarget.style.color = 'orange'} 
                onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                >Login</a>
            </a>
      )}
    </>
  );
};
