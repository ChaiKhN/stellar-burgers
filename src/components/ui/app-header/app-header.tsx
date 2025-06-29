import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation().pathname;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? clsx(styles.link_active, styles.link)
                  : clsx(styles.link)
              }
              to={'/'}
            >
              <BurgerIcon type={location === '/' ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </NavLink>
          </>
          <>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? clsx(styles.link_active, styles.link)
                  : clsx(styles.link)
              }
              to={'/feed'}
            >
              <ListIcon type={location === '/feed' ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лист заказов</p>
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <NavLink to={'/'}>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon
            type={
              location === '/profile' ||
              '/profile/orders' ||
              '/profile/orders/:number'
                ? 'primary'
                : 'secondary'
            }
          />
          <NavLink
            className={({ isActive }) =>
              isActive
                ? clsx(styles.link_active, styles.link)
                : clsx(styles.link)
            }
            to={'/profile'}
          >
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
