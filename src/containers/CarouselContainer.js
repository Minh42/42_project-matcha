import React, {Component} from 'react';
import Slider from 'react-slick';

class CarouselContainer extends Component {
  
  renderPhotos() {
    if (this.props.photos[0].image_path === null || this.props.photos === undefined || this.props.photos === '' || this.props.photos.length <= 0) {
      var src = this.props.user.imageProfile_path;
      return (
        <div>
          <img src={src}/>
        </div>
      );
    } else {
      return this.props.photos.map(photo => {
        const uuidv4 = require('uuid/v4');
        var id = uuidv4();
        var src = 'http://localhost:8080/' + photo.image_path;
        return (
          <div key={id}>
            <img src={src}/>
          </div>
        );
      })
    }
  }
  
  render() {
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <Slider {...settings}>
          {this.renderPhotos()}
      </Slider>
    );
  }
}

export default CarouselContainer;