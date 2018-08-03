import React from 'react'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div className= "field">
    <label className="label">{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

export default renderField