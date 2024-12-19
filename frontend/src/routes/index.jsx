// All components mapping with path for internal routes

import { lazy } from "react";
// const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);

const Users = lazy(() => import("../pages/protected/admin/Users"));

// Admin Routes
const Admin = lazy(() => import("../pages/protected/admin/Admin"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  // Admin Routes
  {
    path: "/admin",
    component: Admin,
  },
  {
    path: "/admin/users",
    component: Users,
  },
  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
