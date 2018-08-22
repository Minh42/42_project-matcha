import React, {Component} from 'react';
import Slider from 'react-slick';

class CarouselContainer extends Component {
  
  renderPhotos() {
    return this.props.photos.map(photo => {
      const uuidv4 = require('uuid/v4');
      var id = uuidv4();
      return (
        <div>
          <img key={id} src={photo.image_path}/>
        </div>
      );
    })
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