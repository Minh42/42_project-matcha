import React, { Component } from 'react';

class ImageList extends Component {

    render() {
        const { src, style, alt, removePicture } = this.props;
        return (
            <div className="column is-one-fifth">
                <div className="card-image">
                    <img src={src} style={style} alt={alt}/>
                    <div className="is-overlay is-clipped has-text-right">
                        <a className="delete is-medium" onClick={() => removePicture(src)}></a>     
                    </div>
                </div>
            </div>
        )
    }


}

export default ImageList;