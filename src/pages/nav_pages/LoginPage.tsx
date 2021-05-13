import React, { useContext, useState } from 'react';
import { FormBuilder, IForm } from '../../components';
import type { IUser } from '../../utils/interfaces';
import { AppContext } from '../../utils/global_states/AppContext';
import { Redirect } from 'react-router';
import { AuthRoutes } from '../../router';

export function LoginPage(props: any) {
  type LoginCredentials = Pick<IUser, 'username' | 'password'>;

  const {
    useAuth: { user, login },
  } = useContext(AppContext);

  console.log(
    'Take me to where I was going before: ',
    props?.location?.state?.requestedPath,
  );

  function onSubmit({ username, password }: LoginCredentials) {
    login(username, password, props?.location?.state?.requestedPath);
  }

  const loginForm: IForm<LoginCredentials> = {
    id: 'loginForm',
    onSubmit,
    sections: [
      {
        fields: [
          {
            id: 'username',
            name: 'username',
            error: 'username',
            label: 'Username',
            component: 'input',
            type: 'email',
            className: 'col-span-full',
            fieldOptions: {
              required: 'This field is required',
            },
          },
          {
            id: 'password',
            name: 'password',
            error: 'password',
            label: 'Password',
            component: 'input',
            className: 'col-span-full',
            type: 'password',
            fieldOptions: {
              required: 'This field is required',
            },
          },
        ],
      },
    ],
    submitButtonValue: 'Login',
  };

  return user ? (
    <Redirect to={AuthRoutes.home} />
  ) : (
    <div className="grid h-screen px-6 py-12 place-items-center md:px-48 bg-gray-50 ">
      <FormBuilder {...loginForm} />
    </div>
  );
}
