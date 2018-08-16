import React, { Component } from 'react';
import Review from '../components/Review';
import portugal from '../../public/img/portugal.jpg'
import australie from '../../public/img/australie.jpg' 
import japon from '../../public/img/japon.jpg'

const ReviewsContainer = () => {
	return (
        <div className="row columns">
            <div className="column is-one-third">
                <Review 
                    src={portugal} 
                    alt="Portugal" 
                    value="Portugal" 
                />
            </div>
            <div className="column is-one-third">
                <Review 
                    src={australie}
                    alt="Australie" 
                    value="Australie" 
                />
            </div>
            <div className="column is-one-third">
                <Review
                    src={japon}
                    alt="Japon" 
                    value="Japon" 
                />
            </div>
        </div>
	);
}

export default ReviewsContainer;