import React from 'react'

const Review = (props) => {
	return (
        <div className="card medium">
            <div className="card-image">
                <figure className="image">
                    <img src={props.src} alt={props.alt}/>
                </figure>
            </div>
            <div className="card-content">
                <div className="content">
                {props.value}
                </div>
            </div>
        </div>
	);
}

export default Review;