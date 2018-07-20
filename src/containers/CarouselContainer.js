import React, {Component} from 'react';
import Slider from 'react-slick';
import step1 from '../../assets/img/step1.jpg'
import australie from '../../assets/img/australie.jpg'
import step3 from '../../assets/img/step3.png'

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
      </Slider>
    );
  }
}

export default CarouselContainer;