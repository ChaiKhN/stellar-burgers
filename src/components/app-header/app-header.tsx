import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getProfile } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const profile = useSelector(getProfile);
  return <AppHeaderUI userName={profile?.name ?? ''} />;
};
