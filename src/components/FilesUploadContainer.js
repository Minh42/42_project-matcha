import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlashMessagesList from './FlashMessagesList';
import { addFlashMessage } from '../actions/actionMessages';

class FilesUploadContainer extends Component {
    constructor() {
      super()
      this.state = { 
        uploadStatus: false,
        files: [] 
      }
    }
  
    onDrop = async (files) => {
      var count = Object.keys(this.state.files).length;
      if (count < 5) {
        const data = new FormData();
        data.append('file', files[0]);
        data.append('filename', files[0].name);
  
        const res = await axios.post('/api/upload', data);
        if (res.data.file) {
          this.setState({
            uploadStatus: true,
            files: this.state.files.concat(`http://localhost:8080/${res.data.file}`),
          });
        } else {
          this.props.addFlashMessage({
            type: '',
            text: res.data.error
          });
        }
      }
      else {
        this.props.addFlashMessage({
					type: '',
					text: 'You can upload only 5 photos'
				});
      }
    }

    renderProfilePic() {
      var count = Object.keys(this.state.files).length;
      if (count > 0) {
        return (
          <div className="card-image">
            <figure className="image is-4by3">
              <img src={this.state.files[0]} alt="Placeholder image"/>
            </figure>
          </div>
        )
      } else {
        return;
      }
    }
  
    render() {
      const style = {
        display: 'inline',
        width: 100,
        height: 100,
        border : "1px solid black"
      };

      return (
        <div className="card">
            <FlashMessagesList />
            { this.renderProfilePic() }
          <div className="card-content">
              <div className="content">
               {this.state.files.map((file) => (
                <img
                  alt="Preview"
                  key={file}
                  src={file}
                  style={style}
                />
              ))}
              </div>
          </div>
          <div className="dropzone">
                  <Dropzone accept="image/*" onDrop={this.onDrop.bind(this)}>
                    <p>Try dropping some files here, or click to select files to upload.</p>
                  </Dropzone>
                </div>
        </div>
   
      );
    }
}

FilesUploadContainer.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addFlashMessage: addFlashMessage}, dispatch);
}
  
export default connect(null, mapDispatchToProps)(FilesUploadContainer);