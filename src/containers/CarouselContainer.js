import React, {Component} from "react";
import Slider from "react-slick";

class Carousel extends Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
        <Slider {...settings}>
        <div>
          <img src="src/img/1.jpeg"/>
        </div>
        <div>
          <img src="src/img/1.jpeg"/>
        </div>
        <div>
          <img src="src/img/1.jpeg"/>
        </div>
      </Slider>
    );
  }
}

export default Carousel;