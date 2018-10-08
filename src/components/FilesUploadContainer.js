import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import ImageList from './ImageList';
import izitoast from 'izitoast';

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
      if (res.data[0]) {
        var user = this.props;        
        if (res.data[0].image_path === null) {
          if (user.user.imageProfile_path.includes('cloudinary')) {
            this.setState({
              files: this.state.files.concat(user.user.imageProfile_path),
            });
          } else {
            this.setState({
              files: this.state.files.concat(`http://localhost:8080/${user.user.imageProfile_path}`),
            });
          }
        } else {
          res.data.map((file) => {
            this.setState({
              files: this.state.files.concat(`http://localhost:8080/${file.image_path}`),
            });
          })
        }
        if (this.state.files[0]) {
          if (document.getElementById("next")) {
            document.getElementById("next").disabled = false;
          }
        }
        else {
          if (document.getElementById("next")) {
            document.getElementById("next").disabled = true;
          }
        }
      } else {
        return;
      }
    }

    async componentDidUpdate() {
      if (this.state.files[0]) {
        var file = this.state.files[0];
        const res = await axios.post('/api/savePicture', {picture: file});
        if (document.getElementById("next")) {
          document.getElementById("next").disabled = false;
        }
      }
      else {
        if (document.getElementById("next")) {
          document.getElementById("next").disabled = true;
        }
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
          izitoast.show({
            message: res.data.error,
            position: 'topRight'
          });
        }
      }
      else {
        izitoast.show({
          message: 'You can upload only 5 photos',
          position: 'topRight'
        });
      }
    }

    renderProfilePic() {
      var count = Object.keys(this.state.files).length;
      if (count > 0) {
        if (this.state.files[0].includes("cloudinary")) {
          var path = this.state.files[0];
        } else if (this.state.files[0].includes("localhost")) {
          var path = this.state.files[0];
        } else {
          var path = 'http://localhost:8080/' + this.state.files[0];
        }
        return (
          <div className="columns">
            <div className="column is-6 is-offset-3">
                <img src={path} alt="Placeholder image"/>
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
          izitoast.show({
            message: res.data.error,
            position: 'topRight'
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
      if (this.state.files.length > 0) {
        if (this.state.files.includes('cloudinary')) {
          return (
            <ImageList
            src={this.state.files}
            style={style}
            alt="preview"
            removePicture={this.removePicture.bind(this)} 
          />
          )
        } else {
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
      }
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

export default FilesUploadContainer;