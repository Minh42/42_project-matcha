import React from 'react';

const Button = (props) => {
    return (
		<button 
		id={props.id}
		className={props.class}
		aria-label={props.ariaLabel}
		style= {props.style} 
		onClick= {props.action}>
		{props.title}
		</button>
	)
}

export default Button;