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
import {convert2Date,
  convertDate2String} from './../functions/dateFunctions';

// Import custom components
import InfoComponent from './../components/infoComponent';
import Calendar from './../components/programCalendar';
import SettingComponent from './../components/settingComponent';
import RosterComponent from './../components/RosterComponent';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    pageData : state.pageData,
    focusedEvent: state.focusedEvent
  };
}

class ProgramScheduleContent extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    // Display container for the event
    DisplayEvent = (props) => {
        let event = Object.assign({}, this.props.program.events[props.event.uid]);

        var img = [];
        if (event.image) {
          img = (<img src={event.image} className="Event-img"/>);
        }

        event.startTime = (event.startTime instanceof Date) ? event.startTime : convert2Date(event.startTime);
        event.endTime = (event.endTime instanceof Date) ? event.endTime : convert2Date(event.endTime);
        event.date = event.startTime;
      
        return (
              <div className="Event-bubble">
                <div>
                  {img}
                  <p className="Info-title">{event.title}</p>
                  <p className="Info-description">{event.location} | {convertDate2String(event.startTime).time} - {convertDate2String(event.endTime).time}</p>
                  <p className="Info-description">{event.description}</p>
                </div>
                      <Link 
                        className="Submit-link"
                        to={{ pathname: '/home/edit/editEvent', state: { 
                        inputKey: "editEvent",
                        modal: true,
                        inputValues: event,
                        header: 'Edit Event'} }}>
                          <div className="Submit-button">
                            Edit Event
                          </div>
                      </Link>
              </div>
        );
    }

    render() {
      var focusedEventDisplay = [];
      var focusedEventRoster = [];
      if (this.props.focusedEvent != undefined) {

        let focusedEvent = this.props.program.events[this.props.focusedEvent.uid];

        focusedEventDisplay = ( 
          <div className="Card-container Card-width-quarter">
            <p className="Card-header">Event Preview</p>
            <div className="Card-white-bg">
              <this.DisplayEvent event={this.props.focusedEvent} />
            </div>
          </div>);

        if (focusedEvent.attendees != undefined)
          focusedEventRoster = (
            <div className="Card-container Card-width-three-quarters">
              <p className="Card-header">Event Roster</p>
              <div className="Card-white-bg">
                <RosterComponent eventDate={this.props.focusedEvent.date} eventId={this.props.focusedEvent.uid} />
              </div>
            </div>);
      } 

        return (
          <div className="App-container">
            <InfoComponent />
            <div className="Page-content-container"> 

              <div className="Card-container Card-width-half">
                <p className="Card-header">Program Calendar</p>
                <div className="Card-white-bg">
                  <Calendar />
                </div>
              </div>

              {focusedEventDisplay}

              {focusedEventRoster}      

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

export default connect(mapStateToProps)(ProgramScheduleContent);
