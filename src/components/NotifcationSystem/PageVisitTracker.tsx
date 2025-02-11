import { useEffect } from 'react';
import {AddVisitor} from "../../../FrontendRequests/Requests-Api/visitors"
const PageVisitTracker = () => {
  useEffect(() => {

    if (!sessionStorage.getItem('visited')) {
      // Optionally, send this information to a server or logging service
      AddVisitor().then((result) => {
      })
            
      sessionStorage.setItem('visited', 'true');
    }
  }, []);

  return null;
};

export default PageVisitTracker;