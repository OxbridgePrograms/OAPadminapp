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

import SvgIcon from 'react-icons-kit';
import { ic_email } from 'react-icons-kit/md/ic_email';
import { ic_vpn_key } from 'react-icons-kit/md/ic_vpn_key';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData : state.userData,
    userList : state.userList};
}

class InfoComponent extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {
      let imgComponent = [];
      if (this.props.userData.image)
        imgComponent = (<img className="User-image-large" src={this.props.userData.image} />);
        return (
                    <div className="Info-container">
                      {imgComponent}
                      <p className="Info-title">{this.props.userData.firstName} {this.props.userData.lastName}</p>
                      <p className="Info-description">{this.props.userData.title}</p>
                      
                      <table>
                        <tbody>
                          <tr>
                            <th><SvgIcon size={15} icon={ic_email}/></th>
                            <th><p className="Info-description">{this.props.userData.email}</p></th>
                          </tr>
                          <tr>
                            <th><SvgIcon size={15} icon={ic_vpn_key}/></th>
                            <th><p className="Info-description">{this.props.userData.permission}</p></th>
                          </tr>
                        </tbody>
                      </table>

                      <Link 
                        className="Submit-link"
                        to={{ pathname: '/home/editCSV/addUser', state: { 
                        inputKey: "addUser",
                        modal: true,
                        header: 'Add Multiple Users'} }}>
                          <div className="Submit-button">
                            Add Users
                          </div>
                      </Link>

                      <Link className="Submit-link"
                        to={{ pathname: '/home/edit/addCourse', state: { 
                        inputKey: "addCourse",
                        modal: true,
                        header: 'Add Course'} }}>
                          <div className="Submit-button">
                            Add Course
                          </div>
                      </Link>

                    </div>

        );
    }
}

export default connect(mapStateToProps)(InfoComponent);
