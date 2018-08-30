import React from 'react';
import axios from'axios';

class ImagesUploader extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			ImageURL : '',
		}
		this.handleUploadImage = this.handleUploadImage.bind(this);
	}

	async handleUploadImage() {
		// var formData = {
		// 	name: 	this.uploadInput.files[0].name,
		// 	type:	this.uploadInput.files[0].type
		// }

		const data = new FormData();
		data.append('file', this.uploadInput.files[0]);
		const res = await axios.post('/api/uploadProfilePicture', data)
	}

	render() {
		return (
			<div>
			<form>
				<div>
					<input ref={(ref) => { this.uploadInput = ref; }} type="file" />
				</div>
				<div onClick={this.handleUploadImage} >Upload</div>
			</form>
			</div>
		)
	}

}

export default ImagesUploader