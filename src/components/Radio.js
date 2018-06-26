import React from 'react'

const Checkbox = (props) => {
    return (
        <div className="field">
            <label className="label">{props.title}</label>
            <div className="control">
                <label className="radio">
                <input type="radio" name="question"/>
                Yes
                </label>
                <label className="radio">
                <input type="radio" name="question"/>
                No
                </label>
            </div>
        </div>
    );
}

export default Checkbox;