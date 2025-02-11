import React from 'react';
import { useNotifications } from './NotificationContext';

export const NotificationDropdown = () => {
  const { notifications } = useNotifications();

  return (
    <li className="nav-item dropdown pe-2 d-flex align-items-center">
    <a href="#" className="p-0 nav-link" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
      <i className="mdi mdi-bell-outline"
        style={{ 
          fontSize: '24px', 
          color: 'currentColor', 
          transition: 'color 0.3s ease' 
        }} 
        onMouseEnter={(e) => e.currentTarget.style.color = 'orange'} 
        onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
      ></i>
    </a>
    <ul className="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4" aria-labelledby="dropdownMenuButton">
        {notifications.map((note) => 
            <li className='mb-2'>
                <a className="dropdown-item border-radius-md" href="#">
                    <div className="py-1 d-flex">
                        <div className="my-auto">
                        <img src={`images/message.png`} className="avatar avatar-sm  me-3 " alt="user image" />
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-1 text-sm font-weight-normal">
                            <span className="font-weight-bold">{note.title}</span> {note.message}
                        </h6>
                        <p className="mb-0 text-xs text-secondary">
                            <i className="fa fa-clock me-1" aria-hidden="true"></i>
                            {note.date}
                        </p>
                        </div>
                    </div>
                </a>
            </li>
        )}
    </ul>
  </li>
  );
};