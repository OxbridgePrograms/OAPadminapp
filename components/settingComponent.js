import React, { Component } from 'react';

// Import external input components
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import Dropzone from 'react-dropzone';

// Throttle for the buttons
import {throttle} from 'lodash';

// Fix for calendar
import 'airbnb-js-shims';

// Import custom css and data
import './../css/styles.css';
import settingsList from './../assets/pageData/settingsList';

// Import icons
import SvgIcon from 'react-icons-kit';
import { ic_highlight_off } from 'react-icons-kit/md/ic_highlight_off';

// Import Redux
import {store} from './../App';
import {connect} from 'react-redux';
import ActionList from './../redux/actions/ActionList';

// Import custom functions
import {validDates,
  convertDate2String,
  convert2Date,
  convertTime2DB} from './../functions/dateFunctions';
import {formatEventData,
  handleFileDeletion,
  updateEventDB} from './../functions/dbFunctions';


// Alerts
import { withAlert } from 'react-alert'

// Import firebase
import * as firebase from 'firebase';


//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program};
}

class SettingComponent extends Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.state.values = {};
      this.state.inputs = settingsList[ this.props.inputKey ];
      for (let k of Object.keys(this.state.inputs) ) {
        if (this.props.inputValues &&
          this.props.inputValues[k])
          this.state.values[k] = this.props.inputValues[k];
        else
          this.state.values[k] = '';
      }

      //Throttle all the submit buttons
      this._backButton = throttle(this._backButton, 2000, {leading:true, trailing:false});
      this._onSubmit = throttle(this._onSubmit, 2000, {leading:true, trailing:false});
    }

    // id dependent back button
    _back = (e) => {
      if (e.target.id != 'background-modal' &&
        e.target.id != 'exit-modal')
        return;
      e.stopPropagation();
      this.props.history.goBack();
    }

    // id independent back button
    _backButton = (e) => {
      e.stopPropagation();
      this.props.history.goBack();
    }

    // Takes the data saved in this.state[k] and submits them to the appropriate db location
    _onSubmit = (e) => {
      e.preventDefault();
      // Alert error if the required fields are not filled out
        for (let k of Object.keys(this.state.inputs)) {
            if (this.state.values[k] == '' && this.state.inputs[k].required){
              this.props.alert.error('Please fill out the required* fields');
              return;
          }
        }

      // Go through each different case
      switch (this.props.inputKey) {
        case 'addEvent': {

          // Format data for the DB
          let data = formatEventData( 
            Object.assign({}, this.state.values, {
              date: this.state.values.date,
              image: this.state.values.image
              })
            );

          // Push Updates
          updateEventDB(data, this.props.inputValues.image, this.props.userData.programId, this.props.userData.programYear, this.props.history, this.props.alert);

          break;

        } case 'editEvent': {

          let data = formatEventData( 
            Object.assign({}, this.state.values, {
              date: this.state.values.date,
              image: this.state.values.image,
              uid: this.props.inputValues.uid, 
              attendees: this.props.inputValues.attendees
              })
            );

          // Push Updates
          updateEventDB(data, this.props.inputValues.image, this.props.userData.programId, this.props.userData.programYear, this.props.history, this.props.alert);

          break;
        } case 'addCourse' : {

          // Establish paths
          let pathDatabase = 'programs/' + this.props.userData.programId + '/' + this.props.userData.programYear + '/courses';
          let pathRedux = 'programs/' + this.props.userData.programId + '/' + this.props.userData.programYear;

          // push the new data
          let newEventRef = firebase.database().ref(pathDatabase).push();
          firebase.database().ref(pathDatabase + '/' + newEventRef.key).update(
            Object.assign({}, this.state.values, {uid : newEventRef.key}), (error) => {
                if (error)
                  this.props.alert.error( error );
                else
                  this._refreshData(pathRedux, "program", ActionList.ADD_PROGRAM_DATA);
            });
          break;

        } case 'editCourse' : {

          // Establish paths
          let pathDatabase = 'programs/' + this.props.userData.programId + '/' + this.props.userData.programYear + '/courses/' + this.state.values.uid;
          let pathRedux = 'programs/' + this.props.userData.programId + '/' + this.props.userData.programYear;

          // push the new data
          let newEventRef = firebase.database().ref(pathDatabase).push(this.state.values, (error) => {
                if (error)
                  this.props.alert.error( error );
                else
                  this._refreshData(pathRedux, "program", ActionList.ADD_PROGRAM_DATA);
            });
          break;
        }
      }
    }

    // Takes the data saved in this.state[k] and submits them to the appropriate db location
    _onDelete = (e) => {
      e.preventDefault();
      // switch (this.props.inputKey) {
      //   case 'editEvent': {
      //     let date = convertDate2DB( this.state.values.date ).date;
      //     firebase.database().ref('programs/' + this.props.userData.programId + '/' + this.props.userData.programYear + '/events/' + date + '/' + this.props.inputValues.uid).remove();
      //     this._refreshData('programs/' + this.props.userData.programId + '/' + this.props.userData.programYear, "program", ActionList.ADD_PROGRAM_DATA);
      //     store.dispatch({type: ActionList.ADD_FOCUSED_EVENT, focusedEvent: undefined });
      //     break;
      //   }
      // }
    }

    // Reads data from the appropriate URL and updates the redux db
    _refreshData = (url, dataKey, action) => {
      const db = firebase.database();
      db.ref(url).once('value', (snapshot) => {
        store.dispatch({type: action, [dataKey]: snapshot.val()});
        this.props.alert.success('Success');
        this.props.history.goBack();
      });
    }

    // Uploaded the image to the database
    handleFileUpload = (data, file, key, pathStorage, pathFirebase, pathRedux) => {
      var storageRef = firebase.storage().ref(pathStorage).put(file);
      storageRef.on('state_changed', (snapshot) => {

        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
            }
          }, (error) => {
            // Handle unsuccessful uploads
          }, () => {
            // Handle successful uploads on complete
            storageRef.snapshot.ref.getDownloadURL().then( (downloadURL) => {
              
              // Replace the old data with the new data
              data[key] = downloadURL;
              firebase.database().ref(pathFirebase).update(data, (error) => {
                  if (error)
                    this.props.alert.error( error );
                  else {
                    console.log('finished upload');
                    this._refreshData(pathRedux, "program", ActionList.ADD_PROGRAM_DATA);
                  }
              });

            });
        });
      }

    // For file uploads
    onImageDrop(key, files) {
      this.setState( (prevState) => {
          prevState.values[key] = files[0];
          return prevState;
        });
    }

    // Handles general input events (except for files)
    // Only set the state if the event value is valid, otherwise do nothing
    _onChange = (key, event) => {
      if (event) {
        var value = event;
        if (event.target)
          value = event.target.value;
        console.log(value);

        this.setState( (prevState) => {
          prevState.values[key] = value;
          return prevState;
        });
      }    
    }

    // Returns the field corresponding to the 
    _createField = (key, type, value, header, req, onChange) => {
      if (req)
        header = header+'*';
      
      switch(type) {
        case 'long': {
          return(<tr>
            <th><p>{header}</p></th>
            <th><textarea
            className="Text-input"
            type="text"
            rows="6"
            value={value}
            onChange={onChange}/></th>
            </tr>);
        } 

        case 'short': {
          return( <tr>
          <th><p>{header}</p></th>
            <th><input 
            className="Text-input"
            type="text"
            value={value}
            onChange={onChange}/></th>
            </tr>);
        } 

        case 'time': {
          return( <tr>
          <th><p>{header}</p></th>
            <th><TimePicker 
            value={value}
            disableClock={true}
            clockIcon={null}
            onChange={onChange}/></th>
            </tr>);
        } 

        case 'date': {
          return( <tr>
          <th><p>{header}</p></th>
            <th><DatePicker 
            value={value}
            onChange={onChange}/></th>
            </tr>);
        } 

        case 'image' : {
          let imagePreview = [];
          if (value && value.preview != undefined) {
            imagePreview = (<tr>
              <th><p>{header}</p></th>
              <th>
              <div>
                <p>Current Image</p>
                <img className="Image-preview" src={value.preview} />
              </div>
              <button type="button" readOnly value={''} className="Submit-button" onClick={onChange}>Remove Image</button>
            </th></tr>);
          } else if (value)
            imagePreview = (<tr>
              <th><p>{header}</p></th>
              <th>
              <div>
                <p>Current Image</p>
                <img className="Image-preview" src={value} />
              </div>
              <button type="button" readOnly value={''} className="Submit-button" onClick={onChange}>Remove Image</button>
            </th></tr>);
          else
            imagePreview = (<tr>
              <th><p>{header}</p></th>
              <th>
              <Dropzone
              className="Image-upload"
              multiple={false}
              accept="image/*"
              onDrop={this.onImageDrop.bind(this, key)}>
              <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
            </th></tr>
          );

          return imagePreview;
        }

        case 'delete' : {
          return( <tr><th></th>
            <th>
            <input type="Submit" readOnly value={header} className="Submit-button" name="delete" onClick={this._onDelete.bind(this)}/>
            </th>
            </tr>);
        } 

        case 'submit' : {
          return( <tr><th></th>
            <th>
            <input type="Submit" readOnly value={header} className="Submit-button" name="submit" onClick={this._onSubmit.bind(this)}/>
            </th>
            </tr>);
        } 

        default:{}
      }
    }

    render() {
      return (
        <div className="Modal-bg" onClick={this._back} id="background-modal">
        <div className="Modal-container">
          <div className="Modal-container-scrollable" id="no-exit">
            <form className="Form-table">
              <p className="Content-bubble-title">
                {this.props.header}
              </p>
              <table>
                <tbody>
                  { Object.keys(this.state.inputs).map( (k) =>
                    this._createField(
                    k,
                    this.state.inputs[k].type,
                    this.state.values[k],
                    this.state.inputs[k].header,
                    this.state.inputs[k].required,
                    this._onChange.bind(this, k))
                    ) }
                </tbody>
              </table>
            </form>
          </div>
        <div className="Modal-close-button" onClick={this._backButton}>
            <SvgIcon size={25} icon={ic_highlight_off}/>
        </div>
        </div>
      </div>
      );
    }
  }

export default connect(mapStateToProps)(  withAlert(SettingComponent) );