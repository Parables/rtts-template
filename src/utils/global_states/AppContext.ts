import { createContext, Dispatch, SetStateAction } from 'react'
// import type { IDriver } from '../interfaces'
import type { IAuth } from '../custom_hooks/useAuth'
export interface IAppContext {
  useSideNavToggle: [boolean, () => void],
  // useMapContainerWidthState: Size
  useAuth: IAuth,
  // useCurrentDriverState: [IDriver | undefined, Dispatch<SetStateAction<IDriver | undefined>>]
  // more to come, like theme, auth, etc
}


const intialAppContext: IAppContext = {
  useSideNavToggle: [false, () => null],
  useAuth: {
    user: undefined,
    login: (username: string, password: string) => null,
    signup: (username: string, password: string) => null,
    logout: () => null,
    // sendPasswordResetEmail: (username: string) => null,
    // confirmPasswordReset: (code: string, password: string) => boolean,
  },
  // useMapContainerWidthState: {width: undefined, height: undefined},
  // useCurrentDriverState: [undefined, () => { }],
}

export const AppContext = createContext<IAppContext>(intialAppContext)