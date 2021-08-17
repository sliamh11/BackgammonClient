import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { GameView, LoginView, ContactView, ChatView, SignupView } from 'Views';
import { Main, Navbar } from 'UIKit'
import { useDispatch, useSelector } from 'react-redux';
import { setUserState } from 'State/Actions';
import axios from 'axios';

const App = (props) => {

  // ------ States ------
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.userState);
  const api_auth = useSelector((state) => state.apiUrls.auth);

  const checkIsTokenExists = async () => {
    // Check if token exists, if so - send it to the server and login automatically.
    try {
      const tokenRaw = sessionStorage.getItem("access-token")
      if (tokenRaw !== null) {
        const { data } = await axios.post(api_auth, { token: tokenRaw });
        dispatch(setUserState(data));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Check for the token.
  checkIsTokenExists();

  if (!userState) {
    return (
      <Main>
        <Navbar></Navbar>
        <div>
          <Route path="/login" component={LoginView}></Route>
          <Route path="/signup" component={SignupView}></Route>
          <Redirect to="/login" />
        </div>
      </Main>
    );
  }
  else {
    return (
      <Main>
        <Navbar></Navbar>
        <Switch>
          <Route exact path="/" component={ContactView}></Route>
          <Route exact path="/chat" component={ChatView}></Route>
          <Route exact path="/game" component={GameView}></Route>
          <Redirect to="/" />
        </Switch>
      </Main>
    );
  }
}

export default App;
