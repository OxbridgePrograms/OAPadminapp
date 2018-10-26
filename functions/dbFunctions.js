
import * as firebase from 'firebase';
import {store} from './../App';
import ActionList from './../redux/actions/ActionList';

// Import custom functions
import {validDates,
  convertDate2String,
  convert2Date,
  changeDate,
  convertTime2DB} from './../functions/dateFunctions';

/******************************************************************
*	General Helper functions
******************************************************************/

// Simple Regex checker to see if it is in email format
// export validateEmail = (email) => {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

/******************************************************************
*	General Firebase functions
******************************************************************/
// Create an index on the db and add the UID to the data
export const addData = (databaseURL, updateArr, data) => {
	const db = firebase.database();

	// Determine if the child exists or we need to make a new node
	if (data.uid) {
		updateArr[databaseURL + '/' + data.uid] = data;
	} else {
		const key = db.ref(databaseURL).push().key;
		updateArr[databaseURL + '/' + key] = Object.assign({}, data, {uid: key});
	}
}

// Uploaded the image to the database, if successful store URL in DB, otherwise set false
export const handleFileUpload = (updateArr, file, key, storageURL, databaseURL, reduxURL, dataKey, action, history, alert) => {
      var storageRef = firebase.storage().ref(storageURL).put(file);
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
            storageRef.snapshot.ref.getDownloadURL().then( (downloadURL) => {
              
              	// If the upload was unsuccessful, set the file as false
              	alert.error('Image Upload Unsuccessful ' + error);
              	let ref = Object.keys(updateArr)[0];
              	updateArr[ref][key] = false;
              	pushData(databaseURL, reduxURL, updateArr, dataKey, action, history, alert);

            });
          }, () => {
            // Handle successful uploads on complete
            storageRef.snapshot.ref.getDownloadURL().then( (downloadURL) => {
              
              	// Replace the old data with the new data
              	let ref = Object.keys(updateArr)[0];
              	console.log(ref);
              	updateArr[ref][key] = downloadURL;
              	pushData(databaseURL, reduxURL, updateArr, dataKey, action, history, alert);

            });
        });
}

// Update the DB and display relevant errors
export const pushData = (databaseURL, reduxURL, updateArr, dataKey, action, history, alert) => {
	const databaseRef = firebase.database().ref();
	console.log(updateArr);
	databaseRef.update(updateArr, (error) => {
		if (error)
            console.log(error);
        else
        	refreshData(reduxURL, dataKey, action, history, alert);
	});
}

// Remove data from the DB
export const removeData = (databaseURL, reduxURL, dataKey, action, history, alert) => {
    firebase.database().ref(databaseURL).remove();
    refreshData(reduxURL, dataKey, action, history, alert);
}

// Reads data from the appropriate URL and updates the redux db
export const refreshData = (url, dataKey, action, history, alert) => {
    firebase.database().ref(url).once('value', (snapshot) => {
        store.dispatch({type: action, [dataKey]: snapshot.val()});
      	alert.success('Success');
      	history.goBack();
    });
}

// Deletes the file from storage
export const handleFileDeletion = (storageURL) => {
	// Create a reference to the file to delete
	var desertRef = firebase.storage().ref(storageURL);

	// Delete the file
	desertRef.delete().then(function() {
        console.log('Image Deleted Successfully');
	}).catch(function(error) {
        console.log('Error: ' + error);
	});
}

/******************************************************************
*	All the User Add/Edit functions
******************************************************************/
// Prepare raw data for upload
export const formatUserData = (data, programId, programYear, uid) => {
	let dataDB = {
		email : data.email,
		firstName : data.firstName,
		lastName : data.lastName,
		permission : data.permission,
		title : data.permission,
		image : false,
		programId : programId,
		programYear : programYear,
		status: "inactive"
	};
	return dataDB;
}

/******************************************************************
*	All the Event Add/Edit functions
******************************************************************/

// Prepare the raw data for the DB
export const formatEventData = (data) => {
    let dataDB = {
        title: data.title,
        location: data.location,
        description: data.description,
        startTime: (data.startTime instanceof Date) ? changeDate( data.date, data.startTime ) : convertTime2DB( data.date, data.startTime ),
        endTime: (data.endTime instanceof Date) ? changeDate( data.date, data.startTime ) : convertTime2DB(data.date, data.endTime )
    };
    
    if (data.attendees)
    	dataDB.attendees = data.attendees;

    if (data.uid)
    	dataDB.uid = data.uid;

    if (data.image == '')
        dataDB.image = false;
    else
    	dataDB.image = data.image;

	return dataDB;
}

// Admits only one data point
export const updateEventDB = (data, prevImage, programId, programYear, history, alert) => {

    // Ensure Data is valid
    if (!validDates(data.startTime, data.endTime)) {
            alert.error('Invalid Times: End Time must be less than equal to Start Time');
            return;
    }

    // Generate key for the data
	let updateArr = {};

    // Establish paths
    let databaseURL = 'programs/' + programId + '/' + programYear + '/events';
	let reduxURL = 'programs/' + programId + '/' + programYear;
	addData(databaseURL, updateArr, data);
	let storageURL = 'programs/' + programId + '/' + programYear + '/events/' + Object.values(updateArr)[0].uid + '/image';

	// If the new image is different from the old -- remove the old image
	if (data.image != prevImage && prevImage )
		handleFileDeletion(storageURL);

	// If the new image is null, simply add data to DB. If not, handle the upload first
	if (data.image == false || data.image == prevImage) {
        pushData(databaseURL, reduxURL, updateArr, "program", ActionList.ADD_PROGRAM_DATA, history, alert);

    } else {
        handleFileUpload(updateArr, data.image, 'image', storageURL, databaseURL, reduxURL, "program", ActionList.ADD_PROGRAM_DATA, history, alert);
    }
}

export const removeEvent = () => {
	// let date = convertDate2DB( this.state.values.date ).date;
	store.dispatch({type: ActionList.ADD_FOCUSED_EVENT, focusedEvent: undefined });
}