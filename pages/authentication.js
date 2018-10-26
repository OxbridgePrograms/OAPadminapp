// Import react components
import React from 'react';
import {
  Redirect
} from 'react-router-dom'

// Import custom scripts
import './../css/styles.css';

// Import Firebase
import * as firebase from 'firebase';

import {store} from './../App';
import ActionList from './../redux/actions/ActionList';

class Authentication extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        'username': '',
        'password': '',
        isLoggedIn: false
      };

      this.handleUsername = this.handleUsername.bind(this);
      this.handlePassword = this.handlePassword.bind(this);     
      this.userLogin = this.userLogin.bind(this);  
    }

    // initially check if logged in
    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({isLoggedIn: true});
        } else {
          console.log( user )
        }
      });
    }

    handleUsername = (event) => {
      this.setState( {'username': event.target.value} );
    }

    handlePassword = (event) => {
      this.setState( {'password': event.target.value} );
    }

    userLogin = (event) => {
      event.preventDefault();

      if (this.state.username != undefined && this.state.password != undefined) {
        console.log('Attempting to Log in');
        firebase.auth().signInWithEmailAndPassword(this.state.username,
          this.state.password).then( (user) => {
            console.log('Login Success: ' + this.state.username);
            this.setState({isLoggedIn: true});
          }).catch( (error) => {
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // if (errorCode == 'auth/invalid-email')
            //   // TODO : error message
            // else if (errorCode == 'auth/wrong-password')
            //   // TODO : error message
            // else if (errorCode == 'auth/user-not-found')
            //   // TODO : error message
            // else
            //   // TODO : error message
          });
      } else {
        // TODO : error message
      }
    }

    render() {
      console.log('User Logged in: ' + this.state.isLoggedIn);
      if (this.state.isLoggedIn) {
        return( <Redirect to="/" /> );
      } else {
        return (
                    <div>
                      <div id="message">
                        <h2>Oxbridge Admin Portal</h2>
                        <h1>[Oxbridge Logo Here]</h1>

                        <form onSubmit={this.userLogin}>
                        <input 
                          className="Text-input"
                          type="email" 
                          required="true"
                          value={this.state.username}
                          onChange={this.handleUsername}
                          placeholder="Username"></input><br/>
                        <input
                          className="Text-input"
                          type="password" 
                          required="true"
                          value={this.state.password}
                          onChange={this.handlePassword}
                          placeholder="Password"></input><br/>
                        <input type="Submit" readOnly value="Log In" className="Submit-button"/>
                      </form>
                      </div>
                      <p id="load">Forgot Password</p>
                    </div>
        );
      }
    }
}

export default Authentication;
