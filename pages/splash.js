import React, { Component } from 'react';
import {
  withRouter
} from 'react-router-dom';

import ActionList from './../redux/actions/ActionList';
import {store} from './../App';

import pageData from './../assets/pageData/data';

import * as firebase from 'firebase';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {loadingUser : true,
      loadingUserList: true,
      loadingProgram : true,
      loadingPage : true}
    this._getUserProfile = this._getUserProfile.bind(this);
    this._getUserMasterList = this._getUserMasterList.bind(this);
    this._getProgramData = this._getProgramData.bind(this);
    this._gotoHomepage = this._gotoHomepage.bind(this);
  }

	componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          store.dispatch({type: ActionList.SET_LOGIN, login: true});
          this._getUserProfile(user);
        } else {
          store.dispatch({type: ActionList.SET_LOGIN, login: false});
          this.props.history.push('/login');
        }
      });
    }

  componentDidUpdate(prevState) {
    if (this.state !== prevState)  {
      if (!this.state.loadingUser && this.state.loadingUserList)
        this._getUserMasterList();
      else if (!this.state.loadingUserList && this.state.loadingProgram)
        this._getProgramData();
      else if (!this.state.loadingProgram && this.state.loadingPage)
        this._getPageData();
      else if (!this.state.loadingUser && !this.state.loadingProgram && !this.state.loadingPage && !this.state.loadingUserList)
        this._gotoHomepage();
    }
  }
  
  // Get the user data from the database TODO!!! Add catch method
  _getUserProfile (user) {
    const db = firebase.database();
    db.ref('users/' + user.uid).once('value', (snapshot) => {
      console.log('User Firebase read Success');
      this.setState({ 'userData' : snapshot.val(),
        loadingUser: false });
    });
  }

  // Get the user data from the database TODO!!! Add catch method
  _getUserMasterList () {
    const db = firebase.database();
    db.ref('users').once('value', (snapshot) => {

      console.log('User Master Firebase read Success');
      var data = snapshot.val();

      // remove non-program related users
      for (let uid of Object.keys(data)) {
        if (data[uid].programId != this.state.userData.programId ||
          data[uid].programYear != this.state.userData.programYear) 
          delete data[uid];
      }

      this.setState({ 'userList' : data,
        loadingUserList: false });
    });
  }

  // With the user information get the program data TODO!!! Add catch method
  _getProgramData() {
    const db = firebase.database();
    db.ref('programs/' + this.state.userData.programId + '/' + this.state.userData.programYear).once('value', (snapshot) => {
      console.log('Program Firebase read Success');
      this.setState({ 'program' : snapshot.val(),
        loadingProgram: false });
    });
  }

  _getPageData() {
    this.setState({ 'pageData' : pageData,
        loadingPage: false });
  }

  // Save the data in storage and goto the homepage
  _gotoHomepage() {
    store.dispatch({type: ActionList.ADD_PROGRAM_DATA, program: this.state.program});
    store.dispatch({type: ActionList.ADD_USER_DATA, userData: this.state.userData});
    store.dispatch({type: ActionList.ADD_PAGE_DATA, pageData: this.state.pageData});
    store.dispatch({type: ActionList.ADD_USER_MASTER_LIST, userList: this.state.userList});
    console.log('Redux Read Success');

    this.props.history.push('/home');
  }

  render() {
    return (
    	<div>
	      <p> Loading... </p>
	    </div>
    );
  }
}

export default withRouter(Splash);
