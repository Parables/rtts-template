import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppRouter, AppRoutes, AuthRoute, UserGroups } from '../../router';
import * as Pages from '../../pages';

export function ContentArea() {
  return (
    <main className="relative flex flex-col w-full h-full p-10 overflow-hidden bg-red-200">
      <AppRouter routes={AppRoutes} routerName="home" rootComponent={Pages.DashboardPage} />
    </main>
  );
}
