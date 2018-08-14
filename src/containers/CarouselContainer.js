import React, {Component} from 'react';
import Slider from 'react-slick';

class CarouselContainer extends Component {
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
        <div>
          <img src={step3}/>
        </div>
        <div>
          <img src={australie}/>
        </div>
        <div>
          <img src={step3}/>
        </div>
        <div>
          <img src={step3}/>
        </div>
        <div>
          <img src={step3}/>
        </div>
      </Slider>
    );
  }
}

export default CarouselContainer;