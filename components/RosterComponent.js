// Import react components
import React from 'react';
import {
  Link
} from 'react-router-dom'

// Import custom scripts
import './../css/styles.css';

// Import Firebase
import * as firebase from 'firebase';

import {connect} from 'react-redux';
import ActionList from './../redux/actions/ActionList';
import settingsList from './../assets/pageData/settingsList';

import FilterableTable from 'react-filterable-table';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    focusedEvent: state.focusedEvent,
    userList: state.userList
  };
}

class RosterComponent extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        userList : Object.values(this.props.program.events[this.props.eventId].attendees),
        fields: []
      };
      this.state.userList = this.state.userList.map(e => e.uid);
      this.state.fields = [
          { name: 'image', displayName: 'Image', inputFilterable: false, sortable: false, render: this.UserImage},
          { name: 'firstName', displayName: 'First Name', inputFilterable: true, sortable: true},
          { name: 'lastName', displayName: 'Last Name', inputFilterable: true, sortable: true},
          { name: 'permission', displayName: 'Role', exactFilterable: true, inputFilterable: true, sortable: true},
          { name: 'status', displayName: 'Status', exactFilterable: true, inputFilterable: true, sortable: true}
        ];
    }
    
    componentDidUpdate(prevProps) {
      if (prevProps != this.props) {
        this.setState({
          userList : Object.values(this.props.program.events[this.props.eventId].attendees).map(e => e.uid)
        });
      }
    }

    // Need to make the case when there are no user image
    UserImage = (props) => {
      var imgComponent = [];
      if (props.value) {
        imgComponent = (<img className="User-image" src={props.value} />);
      }

      return (
        <td className="User-td">
          {imgComponent}
        </td>
      );
    }

    render() {
        return (
          <div className="Roster-container">
            <FilterableTable
                namespace="EventRoster"
                initialSort="firstName"
                data={ this.state.userList.map(uid => this.props.userList[uid]) }
                fields={this.state.fields}
                noRecordsMessage="There are no people to display"
                noFilteredRecordsMessage="No people match your filters!"
                topPagerVisible={false}
                pageSizes={null}
                pageSize={20}
                recordCountName="Participant"
                recordCountNamePlural="Participants"
            />
          </div>
        );
    }
}

export default connect(mapStateToProps)(RosterComponent);
