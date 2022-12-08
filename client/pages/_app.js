import 'bootstrap/dist/css/bootstrap.css';
import buildClient from './api/build-client';
import Nav from '../components/Nav';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Nav currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log('clicked once');
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log('user', data.currentUser);
  return {
    pageProps,
    currentUser: data.currentUser
  };
};

export default AppComponent;
