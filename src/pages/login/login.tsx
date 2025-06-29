import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  clearError,
  getError,
  getIsInitUser,
  setLoginUser
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sInitUser = useSelector(getIsInitUser);
  const error = useSelector(getError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setLoginUser({ email, password }));
    dispatch(clearError());

    if (sInitUser) {
      navigate('/');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
