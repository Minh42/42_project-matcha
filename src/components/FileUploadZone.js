import React, { Component } from 'react';
import Dropzone from 'react-dropzone'

class FileUploadZone extends Component {
    constructor() {
      super()
      this.state = { files: [] }
    }
  
    onPreviewDrop = (files) => {
      this.setState({
        files: this.state.files.concat(files),
       });
    }
  
    render() {
      const previewStyle = {
        display: 'inline',
        width: 100,
        height: 100,
        border : "1px solid black"
      };
      return (
        <section>

          <div className="card-image">
            <figure className="image is-4by3">
              <img src={this.state.files[0].preview} style={previewStyle} alt="Placeholder image"/>
            </figure>
          </div>
          {/* <div className="card-content">
              <div className="content">
 
              </div>
          </div> */}

          <div className="dropzone">
            <Dropzone accept="image/*" onDrop={this.onPreviewDrop}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>

        </section>
      );
    }
}
  
export default FileUploadZone;