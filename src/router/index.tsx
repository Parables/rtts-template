import React, { useContext } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { AppContext } from '../utils/global_states/AppContext';
import * as Pages from '../pages';
import {
  ChartIcon,
  DoubleCheckIcon,
  GridIcon,
  GroupIcon,
  RunIcon,
  SettingsIcon,
  SupportIcon,
  TrophyIcon,
} from '../assets/icons';

export enum UserRole {
  superAdmin = 'superAdmin',
  admin = 'admin',
  staff = 'staff',
  trainer = 'trainer',
  trainee = 'trainee',
  guest = 'guest',
}

export const UserGroups = {
  admins: [String(UserRole.superAdmin), String(UserRole.admin)],
  management: [String(UserRole.staff), String(UserRole.trainer)],
  users: [
    String(UserRole.superAdmin),
    String(UserRole.admin),
    String(UserRole.staff),
    String(UserRole.trainer),
    String(UserRole.trainee),
  ],
  guest: [String(UserRole.guest)],
  all: [
    String(UserRole.superAdmin),
    String(UserRole.admin),
    String(UserRole.staff),
    String(UserRole.trainer),
    String(UserRole.trainee),
    String(UserRole.guest),
  ],
};

export interface IAppRouteProps {
  /** group NavMenus in various sections on SideNav */
  sectionTitle?: string;
  /** if true, will render on the SideNav */
  navRoute?: boolean;
  /** this will be used to order the routes on the SideNav */
  navOrder?: number;
  /** if true, route will not apper on SideNav */
  hidden?: boolean;
  /** a label for the NavMenu on the SideNav */
  label?: string;
  /** an SVG Component Icon generated by SVGR or any JSX Element */
  navIcon?: React.SFC<React.SVGProps<SVGSVGElement>>; //| JSX.Element;
  /** apply TailwindCSS classes to the navIcon Components */
  navIconClass?: string;
  /** className for the navMenu when it is/matches with the active route */
  activeClassName?: string;
  /** className for the navMenu */
  navClassName?: string;
  /**if true, make the NavMenu the active one on the SideNav . 
   *
   *  Conditions: 
   *  1. Must be a navRoute `navRotue:true`
   *  2. must not be hidden `hidden:undefined`
   *  3. Must have a label `label: "not empt string"`
   *  4. Use on only one route in the array
   */
  initialActiveMenu?: boolean
  /** add accessibility support to NavMenu with notes about what is available on the Route.
   * 
   * Fallback to `label` or use 'go to `path`'
   */
  description?: string
  /** add a title to NavMenu on hover 
   * 
   * Fallback to `label` or an empty string
  */
  title?: string
  // component to be rendered by the Route
  component: React.FC<RouteComponentProps>;
  // the path to the Route
  path: string;
  /** when provided, the route will redirect to the path provided */
  redirect?: string;
  // if true, the path must be exact to the location.path
  exact?: boolean;
  // if true, add strict match to the route
  strict?: boolean;
  /** if true, the user must be authenticated and authorised to access the route */
  protected?: boolean;
  // specifies with roles can access a given route
  requiredRoles?: string[];
  /** used to filter routes that are subRoutes of a route */
  parentRoute?: string[];
}

export function AppRouter({
  routes,
  routerName,
  rootComponent
}: {
  routes: IAppRouteProps[];
  routerName?: string,
  rootComponent: IAppRouteProps["component"]
}) {
  return (
    <Switch>
      {routes.slice()
        // get all routes that don't have parent routes excluding the index route
        // TODO: assign routes names so that DynamicRouter can filter children where parentRoute === route.name
        .filter((route) => routerName ? route.parentRoute?.includes(routerName) : route.parentRoute === undefined && route.path !== '/')
        .map((route, i) => (
          <AuthRoute
            key={routerName ?? '' + '-route' + route.label + i}
            {...route}
          />
        ))}
      {/* Hint: all routes can be generated dynamically except the index("/") route which must be explictly present in the Switch */}
      <Route path="/" component={rootComponent} />
    </Switch>
  );
}


export function AuthRoute({
  component: Component,
  path,
  exact = true,
  strict = true,
  requiredRoles,
  protected: requiresAuth,
}: IAppRouteProps) {
  //  useAuth Hook
  const {
    useAuth: { user },
  } = useContext(AppContext);

  const userHasRequiredRole = user && requiredRoles?.includes(user.role);
  return (
    <Route
      path={path}
      exact={exact}
      strict={strict}
      render={(props: RouteComponentProps) =>
        requiresAuth && requiresAuth ? (
          user && userHasRequiredRole ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: NonAuthRoutes.login, // TODO: Determine where to redirect to based on userHasRequiredRole
                state: {
                  message: userHasRequiredRole
                    ? 'Please login to view this page'
                    : 'Access denied... Please contact an Administrator for assistance',
                  requestedPath: path,
                },
              }}
            />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

export enum AuthRoutes {
  home = '/',
  dashboard = '/dashboard',
  leaderboard = '/leaderboard',
  tracks = '/tracks',
  batches = '/batches',
  assessment = '/assessment',
  report = '/report',
  settings = '/settings',
  account = '/account',
}

export enum NonAuthRoutes {
  login = '/login',
  support = '/support',
  unauthorized = '/unauthorized',
}

export const AppRoutes: IAppRouteProps[] = [
  {
    path: NonAuthRoutes.login,
    component: Pages.LoginPage,
  },
  {
    path: AuthRoutes.home,
    // redirect: AuthRoutes.dashboard,
    component: Pages.HomePage,
  },
  {
    path: AuthRoutes.dashboard,
    component: Pages.DashboardPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    initialActiveMenu: true,
    navIcon: GridIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Dashboard',
  },
  {
    path: AuthRoutes.leaderboard,
    component: Pages.LeaderboardPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: TrophyIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Leaderboard',
  },
  {
    path: AuthRoutes.tracks,
    component: Pages.TracksPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: RunIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Tracks',
  },
  {
    path: AuthRoutes.batches,
    component: Pages.BatchesPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: GroupIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Batches',
  },
  {
    path: AuthRoutes.assessment,
    component: Pages.AssessmentPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: DoubleCheckIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Assessment',
  },
  {
    path: AuthRoutes.report,
    component: Pages.ReportPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: ChartIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Main',
    label: 'Reports',
  },

  {
    path: AuthRoutes.settings,
    component: Pages.SettingsPage,
    protected: true,
    requiredRoles: UserGroups.users,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: SettingsIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Extras',
    label: 'Settings',
  },
  {
    path: NonAuthRoutes.support,
    component: Pages.SupportPage,
    parentRoute: ['home'],
    navRoute: true,
    navIcon: SupportIcon,
    navIconClass: 'mr-4',
    sectionTitle: 'Extras',
    label: 'Support',
  },
  {
    path: AuthRoutes.home,
    component: Pages.DashboardPage,
    parentRoute: ['home'],
  },
  {
    path: '',
    component: Pages.NotFoundPage,
    parentRoute: ['home'],
  },
];