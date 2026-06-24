import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RequireAuth from '@/auth/RequireAuth';
import RequireAdmin from '@/auth/RequireAdmin';

const Home = lazy(() => import('../pages/home/page'));
const Shop = lazy(() => import('../pages/shop/page'));
const Product = lazy(() => import('../pages/product/page'));
const Cart = lazy(() => import('../pages/cart/page'));
const Checkout = lazy(() => import('../pages/checkout/page'));
const CheckoutSuccess = lazy(() => import('../pages/checkout/success'));
const CheckoutCancel = lazy(() => import('../pages/checkout/cancel'));
const BlogDetail = lazy(() => import('../pages/blog/detail'));
const Blog = lazy(() => import('../pages/blog/page'));
const About = lazy(() => import('../pages/about/page'));
const Admin = lazy(() => import('../pages/admin/page'));
const Recipes = lazy(() => import('../pages/recipes/page'));
const Recipe = lazy(() => import('../pages/recipe/page'));
const Giveaway = lazy(() => import('../pages/giveaway/page'));
const Bundles = lazy(() => import('../pages/bundles/page'));
const Subscription = lazy(() => import('../pages/subscription/page'));
const Learn = lazy(() => import('../pages/learn/page'));
const Vouchers = lazy(() => import('../pages/vouchers/page'));
const Profile = lazy(() => import('../pages/profile/page'));
const Maintenance = lazy(() => import('../pages/maintenance/page'));
const Login = lazy(() => import('../pages/auth/login'));
const Register = lazy(() => import('../pages/auth/register'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/shop', element: <Shop /> },
  { path: '/product', element: <Product /> },
  { path: '/product/:id', element: <Product /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout/success', element: <CheckoutSuccess /> },
  { path: '/checkout/cancel', element: <CheckoutCancel /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/detail', element: <BlogDetail /> },
  { path: '/about', element: <About /> },
  { path: '/recipes', element: <Recipes /> },
  { path: '/recipe', element: <Recipe /> },
  { path: '/giveaway', element: <Giveaway /> },
  { path: '/bundles', element: <Bundles /> },
  { path: '/subscription', element: <Subscription /> },
  { path: '/learn', element: <Learn /> },
  { path: '/vouchers', element: <Vouchers /> },
  { path: '/maintenance', element: <Maintenance /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/profile', element: <Profile /> },
      { path: '/checkout', element: <Checkout /> },
    ],
  },
  {
    element: <RequireAdmin />,
    children: [
      { path: '/admin', element: <Admin /> },
      { path: '/admin/:section', element: <Admin /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <NotFound /> },
];

export default routes;