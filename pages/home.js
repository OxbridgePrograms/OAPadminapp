import React, { Component } from 'react';
import {
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom'

import {connect} from 'react-redux';

import * as firebase from 'firebase';

// Import Navbar
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import SvgIcon from 'react-icons-kit';

// Import Icons
import { ic_home } from 'react-icons-kit/md/ic_home';
import { ic_announcement } from 'react-icons-kit/md/ic_announcement';
import { ic_today } from 'react-icons-kit/md/ic_today';
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app';

import ProgramScheduleContent from './programScheduleContent';
import Dashboard from './dashboard';
import Profile from './profile';
import SettingComponent from './../components/settingComponent';
import SettingCSVComponent from './../components/settingCSVComponent';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {program: state.program,
    userData: state.userData,
	pageData: state.pageData};
}

class Home extends Component {

	previousLocation = this.props.location;

	constructor(props) {
      super(props);
      this.state = {'logout': false};
      this._logOut = this._logOut.bind(this);
    }

    shouldComponentUpdate(nextProps) {
    	const { location } = this.props;
	    // set previousLocation if props.location is not modal
	    if ( nextProps.history.action !== "POP" &&
	      (!location.state || !location.state.modal) ) {
	      this.previousLocation = this.props.location;
	    }
	    return true;
    }

    _logOut(history) {
    	firebase.auth().signOut().then(function() {
		  console.log('Sign-out Successful');
		  history.push('/');
		}, function(error) {
		  console.log(error);
		});
    }

  render() {
  	const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render
  	var user = firebase.auth().currentUser;
      if (user) {
	    return (
	    	<Route render={({ location, history }) => (
	                      <React.Fragment>
	                          <div className="App-container">
	                            <SideNav
	                                onSelect={(selected) => {
	                                    const to = '/' + selected;
	                                    if (selected == 'logout') {
	                                    	this._logOut(history);
	                                    } else if (location.pathname !== to) {
	                                        history.push(to);
	                                    }
	                                }}
	                            >
	                                <SideNav.Toggle />
	                                <SideNav.Nav defaultSelected="home">
	                                    <NavItem eventKey="home">
	                                        <NavIcon>
	                                          <div className="SideNav-button">
	                                            <SvgIcon size={25} icon={ic_home}/>
	                                          </div>
	                                        </NavIcon>
	                                        <NavText>Overview</NavText>
	                                    </NavItem>
	                                    <NavItem eventKey="home/announcements">
	                                        <NavIcon>
	                                          <div className="SideNav-button">
	                                            <SvgIcon size={25} icon={ic_announcement}/>
	                                          </div>
	                                        </NavIcon>
	                                        <NavText>Announcements</NavText>
	                                    </NavItem>
	                                    <NavItem eventKey="home/schedule">
	                                        <NavIcon>
	                                          <div className="SideNav-button">
	                                            <SvgIcon size={25} icon={ic_today}/>
	                                          </div>
	                                        </NavIcon>
	                                        <NavText>Home</NavText>
	                                    </NavItem>
	                                    <NavItem eventKey="home/profile">
	                                        <NavIcon>
	                                          <div className="SideNav-button">
	                                            <SvgIcon size={25} icon={ic_account_box}/>
	                                          </div>
	                                        </NavIcon>
	                                        <NavText>Profile</NavText>
	                                    </NavItem>
	                                    <NavItem eventKey="logout">
	                                        <NavIcon>
	                                          <div className="SideNav-button">
	                                            <SvgIcon size={25} icon={ic_exit_to_app}/>
	                                          </div>
	                                        </NavIcon>
	                                        <NavText>Log Out</NavText>
	                                    </NavItem>
	                                </SideNav.Nav>
	                            </SideNav>
	                          <div className="Content-container">
	                          	<Switch location={isModal ? this.previousLocation : location}>
		                          	<Route exact path="/home" component={Dashboard} />
		                          	<Route path="/home/schedule" component={ProgramScheduleContent} />
		                          	<Route path="/home/profile" component={Profile} />
	                          	</Switch>
	                          	{isModal ? <Route path="/home/edit" render={ (props) => <SettingComponent  {...props} inputKey={location.state.inputKey} 
	                          		inputValues={location.state.inputValues}
	                          		header={location.state.header}/> } /> : null}
	                          	{isModal ? <Route path="/home/editCSV" render={ (props) => <SettingCSVComponent  {...props} inputKey={location.state.inputKey} 
	                          		inputValues={location.state.inputValues}
	                          		header={location.state.header}/> } /> : null}
	                          </div>
	                        </div>
	                      </React.Fragment>
	                  )}
	                  />);
	    } else {
        return(
        	<Redirect to="/" />
        	);
    	}
      }
  }

export default connect(mapStateToProps)(Home);
