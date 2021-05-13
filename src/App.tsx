import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useToggle, useAuth } from './utils/custom_hooks';
import { AppContext } from './utils/global_states/AppContext';
import type { IAppContext } from './utils/global_states/AppContext';
import * as Pages from './pages';
import './tailwind.css';
import { AppRouter, AppRoutes, AuthRoute } from './router';
import type { AuthRoutes } from './router';

function App() {
  const useAuthState = useAuth();
  const intialAppContext: IAppContext = {
    useSideNavToggle: useToggle(),
    useAuth: useAuthState,
    // more to come, like theme, auth, etc
  };

  return (
    <>
      <AppContext.Provider value={intialAppContext}>
        <AppRouter routes={AppRoutes} rootComponent={Pages.HomePage} />
      </AppContext.Provider>
    </>
  );
}

export default App;
