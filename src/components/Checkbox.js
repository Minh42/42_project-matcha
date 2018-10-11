import React from 'react';

const Checkbox = (props) => {
    return (
        <div class="field">
            <label class="label">{props.title}</label>
            <div class="control">
                <label class="checkbox">
                <input type="checkbox"/>
                I agree to the terms and conditions
                </label>
            </div>
        </div>
    );
}


export default CheckBox;