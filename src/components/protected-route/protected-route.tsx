import { Navigate, useLocation } from 'react-router-dom';
import {
  getIsInitUser,
  getProfile,
  getRequestUser
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader/preloader';

interface ProtectedRouteProps {
  children: JSX.Element;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector(getProfile);
  const request = useSelector(getRequestUser);
  const initUser = useSelector(getIsInitUser);

  if (request) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !initUser) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && initUser) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
