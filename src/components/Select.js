import React from 'react';

const Select = (props) => {
    return (
        <div className="field">
            <label className="label">{props.title}</label>
            <div className="control">
            <div className="select">
                <select
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                >
                <option value="" disabled>{props.placeholder}</option>
                {props.options.map(option => {
                    return (
                    <option
                        key={option}
                        value={option}
                        label={option}>{option}
                    </option>
                    );
                })}
                </select>
            </div>
            </div>
        </div>
    );
}

export default Select;