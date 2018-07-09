import React from 'react';

const Button = (props) => {
    return (
		<button 
		type={props.type}
		id={props.id}
		className={props.className}
		aria-label={props.ariaLabel}
		style= {props.style} 
		onClick= {props.action}>
		{props.title}
		</button>
	)
}

export default Button;