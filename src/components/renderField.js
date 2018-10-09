import React from 'react'

const renderField = ({ input, label, type, className, meta: { touched, error } }) => (
  className= `input is-small ${touched && error ? 'is-danger' : ''}`,
  <div className="field">
    <label className="label is-size-7 is-mobile labelOnboarding">{label}</label>
    <div className="control">
      <input 
      {...input} 
      placeholder={label} 
      type={type} 
      className={className}
      required/>
      {touched && error && <span className="help is-danger">{error}</span>}
    </div>
  </div>
)

export default renderField