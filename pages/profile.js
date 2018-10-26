// Import react components
import React from 'react';
import {
  Link
} from 'react-router-dom';

// Import custom scripts
import './../css/styles.css';

// Import Firebase
import * as firebase from 'firebase';

import {connect} from 'react-redux';
import ActionList from './../redux/actions/ActionList';
import settingsList from './../assets/pageData/settingsList';

// Import custom components
import InfoComponent from './../components/infoComponent';
import ProgramRosterComponent from './../components/programRosterComponent';

//Graph functions
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    pageData : state.pageData,
    userList : state.userList
  };
}

class Profile extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        userCount : [
          {name:"students", value:0},
          {name:"faculty", value:0},
          {name:"admin", value:0}]
      };
    }

    componentDidMount () {
      let studentCount = 0;
      let facultyCount = 0;
      let adminCount = 0;
      for (let user of Object.values(this.props.userList) ) {
        switch (user.permission) {
          case "student": {
            studentCount++;
            break;
          } case "faculty": {
            facultyCount++;
            break;
          } case "admin": {
            adminCount++;
            break;
          }
        }
      }
      console.log({name:"students", value:studentCount},
          {name:"faculty", value:facultyCount},
          {name:"admin", value:adminCount});

      this.setState({
        userCount : [
          {name:"students", value:studentCount},
          {name:"faculty", value:facultyCount},
          {name:"admin", value:adminCount}]
      });
    }

  	render() {
        return (
        	<div className="App-container">
            	<InfoComponent />
            	<div className="Page-content-container"> 
         		
            	<div className="Card-container Card-width-three-quarters">
	              <p className="Card-header">Program Roster</p>
	              <div className="Card-white-bg">
	                <ProgramRosterComponent  />
	              </div>
	            </div>


 				<Link className="Submit-link"
                        to={{ pathname: '/home/edit/addEvent', state: { 
                        inputKey: "addEvent",
                        modal: true,
                        header: 'Add Event'} }}>
                          <div className="Submit-button Floating-button">
                            +
                          </div>
            	</Link>
         		</div>
        	</div>
        );
    }
}
// 
            	// <div className="Card-container Card-width-quarter">
	            //   <p className="Card-header">Program Statistics</p>
	            //   <div className="Card-white-bg">
		           //  <BarChart width={250} height={200} data={this.state.userCount}>
	            //         <CartesianGrid strokeDasharray="3 3" />
	            //         <XAxis dataKey="name" />
	            //         <YAxis />
	            //         <Tooltip />
	            //         <Bar dataKey="value" fill="#8884d8" />
	            //     </BarChart>
	            //   </div>
             //    </div>

export default connect(mapStateToProps)(Profile);
