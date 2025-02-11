import React, { useState, useEffect, type JSX } from 'react';
import ShoppingCart from './cart/shoppingCart';
import Logud from '../components/profile/logud';
import Dashboard from './store/dashboard';
import ProductPanel from './products/productspanel';
import Addproduct from '../components/products/addproduct';
import EditProduct from '../components/products/editProduct';
import CategoryTable from '../components/category/categoryTable';
import AddCategory from '../components/category/addCategory';
import OrderPanel from './order/orderPanel';
import UserTable from './profile/userTable';
import EditUser from './profile/profile';
import PromoEdit from './promo/promocomponent';
import Toolnavbar from './tools/toolsnavbar';
import {type User, IsLoggedIn, fetchUserById} from "../../FrontendRequests/Requests-Api/User"
import { UserRoles } from '../../FrontendRequests/Enums/Usertypes';

interface Link {
  text: string;
  icon: string;
  component?: string;
  badge?: string;
  submenu?: Link[];
}

interface Props {
  links: Link[];
}

type ComponentMap = {
  [key: string]: (props?: any) => JSX.Element;
};

const components: ComponentMap = {
  EditUser,
  ShoppingCart,
  Logud,
  Dashboard,
  ProductPanel,
  Addproduct,
  EditProduct,
  CategoryTable,
  AddCategory,
  OrderPanel,
  UserTable,
  PromoEdit,
  Toolnavbar
};

const Sidebar = ({ links }: Props) => {
  const [activeIndex, setActiveIndex] = useState<{ mainIndex: number | null; subIndex: number | null }>({ mainIndex: null, subIndex: null });
  const [activeComponent, setActiveComponent] = useState<JSX.Element | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [LoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [User, SetUser] = useState<User | null>(null);
  const [loginChecked, setLoginChecked] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const result = await IsLoggedIn();
      setIsLoggedIn(result.result);
      if (result.result) {
        const userresult = await fetchUserById(result.data.user.userid)
        SetUser(userresult.data)
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkLoginStatus();
      setLoginChecked(true);
    };
  
    initialize();
  }, []); // Empty dependency array to ensure this only runs once on mount

  useEffect(() => {
    if (loginChecked && User !== null) {
      setActiveComponent(<EditUser Userprofile={User} isadmin={false} />)
      setActiveIndex({ mainIndex: 0, subIndex: null }); // Set active index to the first link
    }
  }, [loginChecked, User]); // This only triggers once both conditions are met

  const handleMainClick = (component: string | undefined, index: number) => {
    if (component) {
      const ComponentElement = components[component];

      if (ComponentElement === EditUser) {
        if (User !== null) {
          setActiveComponent(<EditUser Userprofile={User} isadmin={false} />)
        }
      } else if (ComponentElement === UserTable) {
        if (User !== null) {
          setActiveComponent(<UserTable Userprofile={User} />)
        }
      } else if (ComponentElement === ShoppingCart) {
          setActiveComponent(<ShoppingCart />);
      } else if (ComponentElement === Dashboard) {
        if (User !== null) {
          setActiveComponent(<Dashboard Userprofile={User} />);
        }
      } else if (ComponentElement === OrderPanel) {
        if (User !== null) {
          if (User.membertypeid == UserRoles.ADMIN || User.membertypeid == UserRoles.WORKER) {
            setActiveComponent(<OrderPanel isadmin={true} Userprofile={User} />);
          } else {
            setActiveComponent(<OrderPanel isadmin={false} Userprofile={User} />);
          }
        }
      } else if (ComponentElement == Logud) {
        setActiveComponent(<Logud/>);
      } else if (ComponentElement === PromoEdit) {
        setActiveComponent(<PromoEdit />);
      } else if (ComponentElement === Toolnavbar) {
        setActiveComponent(<Toolnavbar />);
      }
    }

    setActiveIndex({ mainIndex: index, subIndex: null });
  };

  const handleSubClick = (component: string | undefined, mainIndex: number, subIndex: number) => {
    if (component) {
      const ComponentElement = components[component];
      setActiveComponent(<ComponentElement />);
    }

    setActiveIndex({ mainIndex, subIndex });
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <div>
      <style>{`
        .sidebar {
          background-color: #343a40;
          color: #ffffff;
          width: 250px;
          padding-top: 1rem;
          top: 0;
          position: fixed; /* Make the sidebar fixed */
          height: 100vh; /* Full height */
        }
        .sidebar .nav-link {
          padding: 10px;
          font-size: 14px;
          border-radius: 10px;
        }
        .sidebar .nav-link:not(.active) {
          color: #ffffff;
        }
        .sidebar .nav-link.active {
          background-color: ${import.meta.env.LIGHT_BLUE};
          color: #ffffff;
        }
        .sidebar .nav-link i {
          font-size: 18px;
          color: #ffffff;
        }
        .submenu {
          padding-left: 20px;
          background-color: #2e3b4e;
        }
        .submenu .nav-link.active {
          background-color: ${import.meta.env.LIGHT_RED};
          color: #ffffff;
        }
      `}</style>

      {LoggedIn ? (
      <>
        <nav className="sidebar">
          <div className="d-flex align-items-center p-3">
            <img src="images/avatar.jpg" alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
            <div>
              <div className="text-white fw-bold">{User?.username}</div>
              <div className="text-muted">@{User?.member_type}</div>
            </div>
          </div>

          <ul className="nav flex-column">
            {links.map((link, index) => (
              <li className="nav-item" key={index}>
                {link.submenu ? (
                  <>
                    <a
                      href="#"
                      className={`nav-link d-flex justify-content-between align-items-center px-3 ${activeIndex.mainIndex === index ? 'active' : ''}`}
                      onClick={() => {
                        toggleDropdown(index);
                        handleMainClick(link.component, index);
                      }}
                    >
                      <span>
                        <i className={`mdi ${link.icon} me-2`} />
                        {link.text}
                      </span>
                      <i className={`mdi mdi-chevron-${openDropdownIndex === index ? 'up' : 'down'}`} />
                    </a>
                    {openDropdownIndex === index && (
                      <ul className="nav flex-column submenu">
                        {link.submenu.map((sublink, subindex) => (
                          <li className="nav-item" key={subindex}>
                            <a
                              href="#"
                              className={`nav-link ${activeIndex.mainIndex === index && activeIndex.subIndex === subindex ? 'active' : ''} text-white`}
                              onClick={() => handleSubClick(sublink.component, index, subindex)}
                            >
                              <i className={`mdi ${sublink.icon} me-2`} />
                              {sublink.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href="#"
                    className={`nav-link d-flex justify-content-between align-items-center px-3 ${activeIndex.mainIndex === index ? 'active' : ''}`}
                    onClick={() => handleMainClick(link.component, index)}
                  >
                    <span>
                      <i className={`mdi ${link.icon} me-2`} />
                      {link.text}
                    </span>
                    {link.badge && <span className="badge">{link.badge}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginLeft: "250px", padding: "20px" }}>
          {activeComponent}
        </div>
      </>
    ) : (
      <div>
        <nav className="sidebar">
          <div className="d-flex align-items-center p-3">
            <img src="images/avatar.jpg" alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
          </div>
        </nav>
        <div className='text-center' style={{ marginLeft: "250px", padding: "20px" }}>
          Unathorized
        </div>
      </div>
    )}
  </div>
);
}

export default Sidebar;