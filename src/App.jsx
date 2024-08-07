import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import PublicHeader from '../src/components/headers/publicHeader/publicHeader.jsx';
import UsersHeader from '../src/components/headers/usersHeader/usersHeader.jsx';
import Footer from '../src/components/footer/footer.jsx';
import Home from '../src/components/homePage/home.jsx';
import LoginForm from '../src/components/publicForms/loginForm/loginForm.jsx';
import RegisterForm from '../src/components/publicForms/registerForm/registerForm.jsx';
import NewProjectForm from '../src/components/project/newProjectForm/newProjectForm.jsx';
import ProjectList from './components/project/projectList/projectList.jsx';
import PrivacyPolicy from '../src//components/privacyPolicy/privacyPolicy.jsx'
import ProjectDetails from './components/project/projectDetails/projectDetails.jsx';
import Tchat from './components/project/projectTchat/tchat.jsx';
import NewProjectMember from './components/project/newProjectMember/newProjectMember.jsx';
import UserIsProjectMember from './components/userIsProjectMember/userIsProjectMember.jsx';
import NewProjectTask from './components/project/newProjectTask/newProjectTask.jsx';
import UserProfile from './components/userProfile/userProfile.jsx';
import './assets/css/main.css';

function App() {
  const [connected, setConnected] = useState(false); // State hook
  const onConnectChangeHandler = (value) => setConnected(value); // Update the state hook
  const [userData, setUserData] = useState(Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null);
  const [jwt, setJwt] = useState(Cookies.get('jwt') ? Cookies.get('jwt') : null);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if(token){
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, []);

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
          element: <NewProjectForm jwt={jwt} userData={userData} />
        },
        {
          path: '/mes-projets',
          element: <ProjectList jwt={jwt} />
        },
        {
          path: '/detail-projet/',
          element: <ProjectDetails jwt={jwt} userData={userData} />
        },
        {
          path: '/politique-de-confidentialite',
          element: <PrivacyPolicy />
        },
        {
          path: '/projet/tchat/',
          element: <Tchat jwt={jwt} userData={userData} />
        },
        {
          path: '/projet/nouveau-membre',
          element: <NewProjectMember />
        },
        {
          path: '/projets/participations',
          element: <UserIsProjectMember jwt={jwt} userData={userData} />
        },
        {
          path: '/projet/nouvelle-tache',
          element: <NewProjectTask jwt={jwt} userData={userData} />
        },
        {
          path: '/utilisateur/:pseudo',
          element: <UserProfile jwt={jwt} userData={userData} setUserData={setUserData} />
        }
      ]
    }
  ]);

  function ErrorPage() {
    const error = useRouteError();
    if (error?.status === 404) {
      return (
        <div className='error-page'>
          <h2>404 - Page non trouvée!</h2>
          <p>La page que vous cherchez n'existe pas.</p>
          <Link to='/' className='return-home'>Retour à l'accueil</Link>
        </div>
      );
    }
    return (
      <div className='error-page'>
        <h2>Une erreur est survenue!</h2>
        <p>{error?.error?.toString() ?? error?.toString()}</p>
      </div>
    );
  }

  function Root() {
    return (
      <>
        {connected ? <UsersHeader onConnect={onConnectChangeHandler} userData={userData} /> : <PublicHeader />}
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