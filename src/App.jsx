import { useState } from 'react'
import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer, Link} from 'react-router-dom'
import PublicHeader from '../src/components/publicHeader/publicHeader.jsx';
import UsersHeader from '../src/components/usersHeader/usersHeader.jsx';
import Footer from '../src/components/footer/footer.jsx';
import Home from '../src/components/homePage/home.jsx'
import LoginForm from '../src/components/loginForm/loginForm.jsx'
import RegisterForm from '../src/components/registerForm/registerForm.jsx'
import NewProjectForm from '../src/components/newProjectForm/newProjectForm.jsx'
import ProjectList from './components/projectList/projectList.jsx';
import PrivacyPolicy from '../src/components/privacyPolicy/privacyPolicy.jsx'
import './assets/css/main.css'

function App() {
  const [connected, setConnected] = useState(true); // Déclaration du hook d'état

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
          element: <LoginForm />
        },
        {
          path: '/inscription',
          element: <RegisterForm />
        },
        {
          path: '/nouveau-projet',
          element: <NewProjectForm />
        },
        {
          path: '/mes-projets',
          element: <ProjectList />
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
        <h2 className='error-page'>Une erreur est survenue !</h2>
        <p>{error?.error?.toString() ?? error?.toString()}</p>
      </div>
    );
  }

  function Root() {
    return (
      <>
        {connected ? <UsersHeader /> : <PublicHeader />}
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