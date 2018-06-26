import React from 'react'

const TextArea = (props) => { 
    return (
        <div className="field">
            <label className="label">{props.title}</label>
            <div class="control">
                <textarea 
                    className="textarea" 
                    name={props.name}
                    rows={props.rows}
                    cols = {props.cols}
                    value={props.value}
                    onChange={props.handleChange}
                    placeholder={props.placeholder}
                >               
                </textarea>
            </div>
        </div>
    );
}


export default TextArea;