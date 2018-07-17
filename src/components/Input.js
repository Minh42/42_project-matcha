import React from 'react';

const Input = (props) => {
	return (
	<div className="field">
		<label className="label">{props.title}</label>
		<div className="control">
			<input 
				className="input"
				id={props.name}
				name={props.name}
				type={props.type}
				value={props.value}
				onChange={props.handleChange}				
				placeholder= {props.placeholder}
			/>
		</div>
	</div>
	);
}

export default Input;