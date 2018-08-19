import React from 'react'

const renderField = ({ input, label, type, className, meta: { touched, error } }) => (
  className= `input ${touched && error ? 'is-danger' : ''}`,
  <div className="field">
    <label className="label labelOnboarding">{label}</label>
    <div className="control">
      <input 
      {...input} 
      placeholder={label} 
      type={type} 
      className={className}
      />
      {touched && error && <span className="help is-danger">{error}</span>}
    </div>
  </div>
)

export default renderField