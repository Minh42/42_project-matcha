import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageList from './ImageList';
import FlashMessagesList from './FlashMessagesList';
import { addFlashMessage } from '../actions/actionMessages';

class FilesUploadContainer extends Component {
    constructor(props) {
      super(props)

      this.state = { 
        uploadStatus: false,
        files: [] 
      }
    }

    async componentDidMount() {
      const res = await axios.get('/api/displayPicture');
      if (res.data) {
        res.data.map((file) => {
          this.setState({
            files: this.state.files.concat(`http://localhost:8080/${file.image_path}`),
          });
        })
        if (this.state.files[0])
          document.getElementById("next").disabled = false;
        else 
          document.getElementById("next").disabled = true;
      } else {
        return;
      }
    }

    async componentDidUpdate() {
      if (this.state.files[0]) {
        var file = this.state.files[0];
        const res = await axios.post('/api/savePicture', {picture: file});
        document.getElementById("next").disabled = false; 
      }
      else 
        document.getElementById("next").disabled = true;
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
          <div className="columns">
            <div className="column is-6 is-offset-3">
                <img src={this.state.files[0]} alt="Placeholder image"/>
            </div>
          </div>
        )
      } else {
        return;
      }
    }

    async removePicture(src) {
      if (src) {
        const res = await axios.post('/api/deletePicture', {picture: src});
        if(res.data === "Record deleted") {
          const newState = this.state;
          const index = newState.files.indexOf(src);
          if (index >= 0) {
            newState.files.splice(index, 1);
          } else {
            return;
          }
          this.setState(newState); 
        } else {
          this.props.addFlashMessage({
					  type: '',
					  text: res.data.error
				  });
        }
      }
    }

    renderList() {
      const style = {
        display: 'inline',
        width: 100,
        height: 100,
        border: "8px solid rgba(255,255,255,.5)",
        borderRadius: 20
      };
      return this.state.files.map((file) => {
        const uuidv4 = require('uuid/v4');
        var id = uuidv4();
        return (
            <ImageList
                key={id}
                src={file}
                style={style}
                alt="preview"
                removePicture={this.removePicture.bind(this)} 
            />
        );
    });
    }

    render() {
      const dropzoneStyle = {
        width: 100,
        height: 100,
        borderRadius: 20,
        border: "8px solid rgba(255,255,255, 1)",
      };
      return (
          <div>
            <FlashMessagesList />
            <br/>
            { this.renderProfilePic() }
            <div>
              <div className="columns is-multiline has-text-centered">
                { this.renderList() }
              </div>
            </div>
            <div>
              <div className="dropzone">
                <Dropzone accept="image/*" onDrop={this.onDrop.bind(this)} style={dropzoneStyle}>
                  <div className="is-overlay is-clipped has-text-centered">
                    <span className="icon is-small"><i className="fas fa-plus-circle"></i></span>
                    <p className="help">Drag &amp; drop or upload files</p>
                  </div>
                </Dropzone>
              </div>
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