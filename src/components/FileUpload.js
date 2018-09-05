import React, { Component } from 'react'
import axios from 'axios'

class FileUpload extends Component {

  constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        imageURL: null
      }
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  async handleUploadImage(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);

    const res = await axios.post('http://localhost:8080/upload', data)
   
    this.setState({ imageURL: `http://localhost:8080/${res.data.file}`, uploadStatus: true });

  }

  render() {
   return(
     <div className="container">
    
       <form>
        <img src={this.state.imageURL}/>

         <div className="form-group">
           <input className="form-control"  ref={(ref) => { this.uploadInput = ref; }} type="file" />
         </div>

         <div className="form-group">
           <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" />
         </div>

         <div onClick={this.handleUploadImage}>Upload</div>
      

       </form>
     </div>
   )
 }
}

export default FileUpload;