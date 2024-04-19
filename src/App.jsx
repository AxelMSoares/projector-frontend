import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer, Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import PublicHeader from '../src/components/publicHeader/publicHeader.jsx';
import UsersHeader from '../src/components/usersHeader/usersHeader.jsx';
import Footer from '../src/components/footer/footer.jsx';
import Home from '../src/components/homePage/home.jsx'
import LoginForm from '../src/components/loginForm/loginForm.jsx'
import RegisterForm from '../src/components/registerForm/registerForm.jsx'
import NewProjectForm from '../src/components/newProjectForm/newProjectForm.jsx'
import ProjectList from './components/projectList/projectList.jsx';
import PrivacyPolicy from '../src/components/privacyPolicy/privacyPolicy.jsx'
import ProjectDetails from './components/projectDetails/projectDetails.jsx';
import './assets/css/main.css'

function App() {
  const [connected, setConnected] = useState(false); // State hook
  const onConnectChangeHandler = (value) => setConnected(value); // Update the state hook
  const [userData, setUserData] = useState(Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null);
  const [jwt, setJwt] = useState(Cookies.get('jwt') ? Cookies.get('jwt') : null);

  useEffect(() => {
    setConnected(Cookies.get('jwt') ? true : false);
  }, [jwt]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/connexion',
          element: <LoginForm onConnect={onConnectChangeHandler} />
        },
        {
          path: '/inscription',
          element: <RegisterForm />
        },
        {
          path: '/nouveau-projet',
          element: <NewProjectForm jwt = { jwt } userData = { userData } />
        },
        {
          path: '/mes-projets',
          element: <ProjectList jwt = { jwt } />
        },
        {
          path: '/detail-projet/',
          element: <ProjectDetails jwt = { jwt } userData = { userData } />
        },
        {
          path: '/politique-de-confidentialite',
          element: <PrivacyPolicy />
        }
      ]
    }
  ]);

  function ErrorPage() {
    const error = useRouteError();
    console.log(error);
    return (
      <div>
        <h2 className='error-page'>Zut! Une erreur est survenue!</h2>
        <p>{error?.error?.toString() ?? error?.toString()}</p>
      </div>
    );
  }

  function Root() {


    return (
      <>
        {connected ? <UsersHeader onConnect={onConnectChangeHandler} /> : <PublicHeader />}
        <Outlet />
        <Footer />
      </>
    )
  }



  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;