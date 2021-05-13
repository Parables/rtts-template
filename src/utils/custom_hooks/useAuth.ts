// Hook (use-auth.js)
import axios from 'axios';
import { useHistory } from 'react-router';
import { AuthRoutes } from '../../router/';
import { UserRole } from '../../router/';
import type { IUser } from '../interfaces';
import { useLocalStorage } from './useLocalStorage';

export interface IAuth {
  user: IUser | undefined;
  login: (username: string, password: string, requestedPath?: string) => void;
  signup: (username: string, password: string, requestedPath?: string) => void;
  logout: () => void;
  // sendPasswordResetEmail: (username: string) => void;
  // confirmPasswordReset: (code: string, password: string) => boolean;
}

// Provider hook that creates auth object and handles state
export function useAuth(): IAuth {
  const [user, setUser] = useLocalStorage<IUser | undefined>(
    'currentUser',
    undefined,
  );
  const history = useHistory();

  const login = (
    username: string,
    password: string,
    requestedPath?: string,
  ) => {
    // axios post and get the role of the user and take him  to the right route
    //... in this case, they will all have a dashboard view so I can take them there
    setUser({
      _id: 'lkdsmlsk',
      username: username,
      password: password,
      role: UserRole.admin,
      access_token: ',sanmdcams',
      profile: 'sdlmscsld',
    });
    history.push(requestedPath ? requestedPath : AuthRoutes.home);
  };

  const signup = (
    username: string,
    password: string,
    requestedPath?: string,
  ) => {
    //  TODO: Implent this later
  };

  const logout = () => {
    // do some server side logic here then
    return setUser(undefined);
  };

  const sendPasswordResetEmail = (username: string) => {
    // do some server side logic here then
    // redirect to login
  };

  const confirmPasswordReset = (code: string, password: string): boolean => {
    // returns true is succesful, false otherwise
    return false;
  };

  // Return the user object and auth methods
  return {
    user,
    login,
    signup,
    logout,
    // sendPasswordResetEmail,
    // confirmPasswordReset,
  };
}
