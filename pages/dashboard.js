// Import react components
import React from 'react';
import {throttle} from 'lodash';

// Import custom scripts
import './../css/styles.css';

// Import Firebase
import * as firebase from 'firebase';

import {connect} from 'react-redux';
import {store} from './../App';
import ActionList from './../redux/actions/ActionList';

// Import custom components
import InfoComponent from './../components/infoComponent';
import AnnouncementComponent from './../components/AnnouncementComponent';
import LocationComponent from './../components/locationComponent';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    pageData : state.pageData};
}

class Dashboard extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    programDatesFormatted = () => {
      let dateObj = {};
      dateObj.startDate = monthNames[this.props.program.programDates.startDate.month - 1] + ' ' + this.props.program.programDates.startDate.day + ', ' + this.props.program.programDates.startDate.year;
      dateObj.endDate = monthNames[this.props.program.programDates.endDate.month - 1] + ' ' + this.props.program.programDates.endDate.day + ', ' + this.props.program.programDates.endDate.year;

      return dateObj;
    }

    render() {
        var formattedDates = this.programDatesFormatted();
        return (
          <div className="App-container">
            <div className="Page-content-container Red-bg">

              <div className="Content-bubble Red-bg">
                  <div className="Content-bubble-inner-quarter">
                    <p className="Content-bubble-title">dashboard/</p>
                    <p className="Dashboard-title">{this.props.program.metaData.name} {this.props.program.metaData.year}</p>
                    <p className="Dashboard-description">Start: {formattedDates.startDate}</p>
                    <p className="Dashboard-description">End: {formattedDates.endDate}</p>
                </div>
              </div>

              <div className="Content-bubble Red-bg">
                <div className="Content-bubble-inner-half">
                  <LocationComponent />
                </div>
              </div>

              <div className="Content-bubble">
                <div className="Content-bubble-inner-half">
                  <p className="Content-bubble-title">Announcements</p>
                  <AnnouncementComponent />
                </div>
              </div>
              
              <div className="Content-bubble">
                <div className="Content-bubble-inner-quarter">
                  <p className="Content-bubble-title">Upcoming Events (or Upcoming Messages)</p>
                </div>
              </div>

            </div>
          </div>
        );
    }
}

export default connect(mapStateToProps)(Dashboard);
