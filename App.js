// Import react components
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

// Import custom scripts
import Home from './pages/home';
import Splash from './pages/splash';
import Authentication from './pages/authentication';
import './css/styles.css';
import './css/sideNav.css';

// Import react-redux
import {Provider} from 'react-redux';
import configureStore from './redux/configureStore';
import ActionList from './redux/actions/ActionList';

// Import alert system
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// Import Firebase
import * as firebase from 'firebase';

//Use this store for all redux manipulations
export const store = configureStore();

class App extends React.Component {

    constructor() {
      super();
    }

    render() {
        return (
            <Provider store={store}>
              <AlertProvider template={AlertTemplate} >
                <Router>
                  <div className="Fullscreen">
                    <Switch>
                      <Route exact path='/' component={Splash} />
                      <Route path='/login' component={Authentication} />
                      <Route path='/home' component={Home} />
                      {/* Add in a NoMatch Route*/}
                    </Switch>
                </div>
              </Router>
            </AlertProvider>
          </Provider>
        );
    }
}

export default App;
