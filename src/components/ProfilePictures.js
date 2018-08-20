import React, { Component } from 'react';

class ProfilePictures extends Component {

    renderProfilePic() {
        console.log(this.props.photos);
        // var count = Object.keys(this.state.userPhotos).length;
        // if (count > 0) {
        //   return (
        //     <div class="columns">
        //       <div class="column is-6 is-offset-3">
        //           <img src={this.state.files[0]} alt="Placeholder image"/>
        //       </div>
        //     </div>
        //   )
        // } else {
        //   return;
        // }
    }

    render() {
        return (
            <div>
                { this.renderProfilePic() }
                {/* <div>
                    <div className="columns is-multiline has-text-centered">
                        { this.renderList() }
                    </div>
                </div> */}
            </div>
        );
    }



}

export default ProfilePictures;