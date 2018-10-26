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
  };
}

class LocationComponent extends React.Component {

    constructor(props) {
      super(props);
    }

    MapBubble = (props) => {
      let optionalComponent = [];
      if (props.location.street2)
        optionalComponent = (<p className="User-description">{props.location.street2}</p>);

      return (
        <div className="Map-content">
          <img className="Map-image" src={props.location.mapURL} />
          <div className="User-information">
            <p className="User-title reverse-title">{props.location.title}</p>
            <p className="User-description reverse-description">{props.location.street1}</p>
            {optionalComponent}
            <p className="User-description reverse-description">{props.location.city} {props.location.postalCode}, {props.location.countryCode}</p>
          </div>
        </div>
        );
    }

    render() {
        return (
          <div className="Map-container">
            {Object.values(this.props.program.metaData.location).map(l => <this.MapBubble location={l} />)}
          </div>
        );
    }
}

export default connect(mapStateToProps)(LocationComponent);
