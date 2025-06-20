import { Navigate, useLocation } from 'react-router-dom';
import { selectUser } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
