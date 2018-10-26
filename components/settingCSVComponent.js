import React, { Component } from 'react';

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

// Alerts
import { withAlert } from 'react-alert'

// Import firebase
import * as firebase from 'firebase';

import csv from 'csv';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';

//Function to feed Homepage with data as props
const mapStateToProps = (state) => {
  return {userData: state.userData,
    program: state.program};
}

class SettingCSVComponent extends Component {

    constructor(props) {
    	super(props);
    	this.state = {isUploading: false};
    	this.state.values = {};
      	this.state.inputs = settingsList[ this.props.inputKey ];
	      for (let k of Object.keys(this.state.inputs) ) {
	        if (this.props.inputValues &&
	          this.props.inputValues[k])
	          this.state.values[k] = this.props.inputValues[k];
	        else
	          this.state.values[k] = '';
	      }
      	this.state.data = [];
      	this.state.dataHeaders = []
      	this.state.isHeader = 1; //0 if no header
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

    // This function reads in (XLSX ->) CSV -> Array format and stores it in local state
    _onDrop = (e) => {
    	const reader = new FileReader();
    	let extention = e[0].name.split('.');
    	extention = extention[ extention.length - 1 ];
    	
    	reader.onload = (event) => {
    		let data = event.target.result;
    		console.log(extention);
    		if (extention == "xlsx"){			    
			    const wb = XLSX.read(data, {type:'binary'});
			    const wsname = wb.SheetNames[0];
			    const ws = wb.Sheets[wsname];
			    /* Convert array of arrays */
			    data = XLSX.utils.sheet_to_csv(ws, {header:this.state.isHeader});
    		}

    		// convert CSV data into data and header arrays
    		csv.parse(data, (err, data) => {
    			console.log(data[2]);
    			if (this.state.isHeader == 1) {
    				this.setState( (prevState) => {
    					prevState.data = data.splice(1);
    					prevState.dataHeaders = data[0];
    					return prevState;
    				});			
    			} else {
    				this.setState( (prevState) => {
    					prevState.data = data;
    					prevState.dataHeaders = data[0];
    					return prevState;
    				});			
    			}
    			
    		});
    	};

    	reader.readAsBinaryString(e[0]);
    }

    // Only set the state if the event value is valid, otherwise do nothing
    _onChange = (key, event) => {
      if (event) {
        var value = event;
        if (event.target)
          value = event.target.value;
        this.setState( (prevState) => {
          prevState.values[key] = value;
          return prevState;
        });
      }    
    }

    // Returns the field / dropdown menu pair appropriately
    _createField = (key, metaData, value, onChange) => {
      let header = metaData.header;
      if (metaData.required)
        header = header+'*';

      if (metaData.data)
      		return(<tr>
	              <th><p className="Data-header">{header}</p></th>
	              <th>
	              <select value={value} onChange={onChange}>
	              	<option value='' />
		            {metaData.data.map( (header) => { 
		            	return(<option value={header}>{header}</option>); 
		            })}
		          </select>
	            </th></tr>);
      else
	    	return(<tr>
	              <th><p className="Data-header">{header}</p></th>
	              <th>
	              <select value={value} onChange={onChange}>
	              	<option value='' />
		            {this.state.dataHeaders.map( (header, index) => { 
		            	return(<option value={header}>{header}</option>); 
		            })}
		          </select>
	            </th></tr>);
	}

	// Takes this.state.values and displays a snippet of a few fields
	_CSVPreview = () => {
		let numPreview = 5;
		let headRow = (<tr>{Object.keys(this.state.inputs).map( (head) => {
			return(<th><p className="Data-header">{this.state.inputs[head].header}</p></th>);
		})} </tr>);
		let dataRow = [];
		for (let i = 0; i < numPreview; i++) {
			dataRow.push(<tr>{Object.keys(this.state.inputs).map( (head) => {
				let datum = '';
				if (this.state.values[head] != '') {
					let index = this.state.dataHeaders.indexOf(this.state.values[head]);
					if (index < 0)
						datum = this.state.values[head];
					else
						datum = this.state.data[i][index];
				}
				return(<th><p className="Data-preview">{datum}</p></th>);
			})} </tr>);
		}

		return(
			<table>
                <tbody>
                {headRow}
                {dataRow}
            	</tbody>
             </table>    
		);
	}

	_RenderContent = () => {
		console.log(this.state.data.length);
		if (this.state.data.length == 0) {
			return (
				<Dropzone
	              className="Image-upload"
	              multiple={false}
	              onDrop={this._onDrop.bind(this)}>
	              <p>Select or drop a .csv or .xlsx file to upload.</p>
	            </Dropzone>
				);
		} else {
			return (
              <table>
                <tbody>
					{Object.keys(this.state.inputs).map( (k) =>
	                    this._createField(
	                    k,
	                    this.state.inputs[k],
	                    this.state.values[k],
	                    this._onChange.bind(this, k))
	                    )}
	                <tr>
	                	<th><p className="Data-header">Data Preview</p></th>
	                	<th><this._CSVPreview /></th>
	                </tr>
	                <tr>
		            	<th></th>
		              	<th>
		              	<button type="button" readOnly value={''} className="Submit-button" onClick={() => this.setState( (prevState) => {
		              			prevState.data = [];
		              			prevState.dataHeaders = [];
		              			for (let k of Object.keys(this.state.inputs) ) {
							          prevState.values[k] = '';
							      }
		              			return prevState;
		              	})}>Reset Data</button>
		            	</th>
		            </tr>
                </tbody>
              </table>
				);
			}
	}

    render() {

    	return(
    	<div className="Modal-bg" onClick={this._back} id="background-modal">
        <div className="Modal-container">
          <div className="Modal-container-scrollable" id="no-exit">
            <form className="Form-table">
              <p className="Content-bubble-title">
                {this.props.header}
              </p>
	        	<this._RenderContent />
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

export default connect(mapStateToProps)(  withAlert(SettingCSVComponent) );