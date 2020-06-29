import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'lnr lnr-home',
    link: '/dashboard',
    home: true,
  },
  {
    title: ' ',
    group: true,
  },
  /*{
    title: 'Settings',
    icon: 'eva eva-settings-2-outline',
    link: '/setting',
  },*/
  /*{
    title: 'Reports',
    icon: 'eva eva-edit-2-outline',
    children: [
      {
        title: 'All',
        link: '/reports/all',
      },
      {
        title: 'New',
        link: '/reports/new',
      }
    ]
  },*/
  {
    title: 'Help',
    icon: 'lnr lnr-question-circle',
    link: '/tour',
  },
  {
    title: 'Auth',
    icon: 'lnr lnr-lock',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
