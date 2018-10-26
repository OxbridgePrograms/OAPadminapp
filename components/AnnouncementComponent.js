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

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program,
    userList: state.userList
  };
}

class AnnouncementComponent extends React.Component {

    constructor(props) {
      super(props);
    }

    // Fetch the announcements in order
    _fetchAnnouncements = () => {
      let announcementStack = [];
      for (let d of Object.keys(this.props.program.announcements) ) {
        for (let uid of Object.keys(this.props.program.announcements[d]) ) {
          let a = this.props.program.announcements[d][uid];

          // Insert the announcement in the stack
          if (announcementStack.length == 0)
            announcementStack.push( Object.assign({}, a) );
          else {
            for (let i = 0; i < announcementStack.length; i++) {
              let a_stack = announcementStack[i];
              if ( Date(a_stack.time) <= Date(a.time) ) {
                announcementStack.splice(i, 0, Object.assign({}, a));
                break;
              } else if (i == announcementStack.length - 1) {
                announcementStack.push( Object.assign({}, a) );
                break;
              }
            }
          }
        }
      }
      console.log(announcementStack);
      return announcementStack;
    }

    AnnouncementBubble = (props) => {
      var imgComponent = [];

      let user = props.announcement.userId;
      if (this.props.userList[user].image)
        imgComponent = (<img className="User-image" src={this.props.userList[user].image} />);

      return (
        <div className="User-bubble" >
          {imgComponent}
          <div className="User-information">
            <p className="User-title">{props.announcement.title}</p>
            <p className="User-description">{props.announcement.description}</p>
          </div>
          <div className="User-information">
            <p className="User-description">September 7, 5:00 PM</p>
          </div>
        </div>
        );
    }

    render() {
      let aList = this._fetchAnnouncements();
        return (
          <div>
            {aList.map(a => <this.AnnouncementBubble announcement={a} />)}
          </div>
        );
    }
}

export default connect(mapStateToProps)(AnnouncementComponent);
