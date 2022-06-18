import './App.css';
import { GoogleLogin } from 'react-google-login';
import { useHttp } from './http.hook';

function App() {
  const { loading, request, error, clearError } = useHttp();

  const responseGoogle = (response) => {
    console.log(response);
  }

  const loginOAuthHandler = async (response) => {
    try {

      console.log(response.code);
      //const data = await request("http://localhost:5000/auth/sign-in/oauth2", 'POST', { code: response.code });
    } catch (e) { 
      console.log(e);
    }
  };

  return (
    <div className="App">
      <GoogleLogin
        clientId="796264274228-pip5alik5285bbqo0mnhj9h0kimknv7e.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={loginOAuthHandler}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        responseType='code'
        accessType='offline'
        redirectUri='http://localhost:5000/auth/sign-in/oauth2'
      />
    </div>
  );
}

export default App;
