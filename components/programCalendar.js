import React from 'react';
import {
  withRouter
} from 'react-router-dom';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import {connect} from 'react-redux';

import {store} from './../App';
import './../css/react-big-calendar.css';
import ActionList from './../redux/actions/ActionList';

import {convert2CalendarArray,
  convertDate2String} from './../functions/dateFunctions';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    pageData : state.pageData,
    focusedEvent: state.focusedEvent
  };
}

class Calendar extends React.Component {

  localizer = BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelect = ({ start, end }) => {
    this.props.history.push( '/home/edit/addEvent', { 
                        inputKey: "addEvent",
                        modal: true,
                        inputValues: {
                          startTime: start,
                          endTime: end,
                          date: start
                        },
                        header: 'Add Event'});
  }

  handleFocus = (event) => {
    var data = {
      uid: event.id
    };

    store.dispatch({type: ActionList.ADD_FOCUSED_EVENT, focusedEvent: data});
  }

  render() {
    return(
      <div className="Content-bubble-calendar">
        <BigCalendar
          events={convert2CalendarArray( this.props.program.events )}
          step={60}
          showMultiDayTimes
          selectable
          onSelectEvent={event => this.handleFocus(event)}
          onSelectSlot={this.handleSelect}
          localizer={this.localizer}
        />
      </div>
      );
  }
}

export default withRouter(connect(mapStateToProps)(Calendar));