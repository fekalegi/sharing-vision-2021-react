import DashboardLayout from "components/Layouts/DashboardLayout";
import LoadingScreen from "components/LoadingScreen";
import { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loadable = (Component: LazyExoticComponent<FC>) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// authentication pages
const Login = Loadable(lazy(() => import("./pages/authentication/Login")));
const Register = Loadable(
  lazy(() => import("./pages/authentication/Register"))
);
const ForgetPassword = Loadable(
  lazy(() => import("./pages/authentication/ForgetPassword"))
);

// Dashboard pages
const DashboardSaaS = Loadable(lazy(() => import("./pages/dashboards/SaaS")));

// user profile
const UserProfile = Loadable(lazy(() => import("./pages/UserProfile")));

const UserGrid = Loadable(
  lazy(() => import("./pages/userManagement/UserGrid"))
);

// Post
const PostList = Loadable(
  lazy(() => import("./pages/post/PostList"))
);

const AddNewPost = Loadable(
  lazy(() => import("./pages/post/AddNewPost"))
);

const EditPost = Loadable(
  lazy(() => import("./pages/post/EditPost"))
);

// Blog
const BlogView = Loadable(
  lazy(() => import("./pages/BlogView"))
);

// error
const Error = Loadable(lazy(() => import("./pages/404")));

// routes
const routes = [
  {
    path: "/",
    element: <Navigate to="dashboard/blog" />,
  },
  {
    path: "dashboard",
    element: (
      <DashboardLayout />
    ),
    children: [
      {
        path: "post-list",
        element: <PostList />,
      },
      {
        path: "add-post",
        element: <AddNewPost />,
      },
      {
        path: "edit-post/:id",
        element: <EditPost />,
      },
      {
        path: "blog",
        element: <BlogView />,
      }
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
];

export default routes;
