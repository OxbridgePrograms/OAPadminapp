// Import react components
import React from 'react';
import {
  Link
} from 'react-router-dom'

// Import custom scripts
import './../css/styles.css';
// import './../css/style.scss';

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

class ProgramRosterComponent extends React.Component {

    constructor(props) {
      super(props);
      this.state ={
        fields: [
          { name: 'image', displayName: 'Image', inputFilterable: false, sortable: false, render: this.UserImage},
          { name: 'firstName', displayName: 'First Name', inputFilterable: true, sortable: true},
          { name: 'lastName', displayName: 'Last Name', inputFilterable: true, sortable: true},
          { name: 'permission', displayName: 'Role', exactFilterable: true, inputFilterable: true, sortable: true},
          { name: 'status', displayName: 'Status', exactFilterable: true, inputFilterable: true, sortable: true}
        ]
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
                namespace="People"
                initialSort="firstName"
                data={ Object.values(this.props.userList) }
                fields={this.state.fields}
                noRecordsMessage="There are no people to display"
                noFilteredRecordsMessage="No people match your filters!"
            />
          </div>
        );
    }
}

export default connect(mapStateToProps)(ProgramRosterComponent);
