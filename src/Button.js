import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const Button = ( { text, onClick }) => {
  
  return (
    <button 
      onClick={onClick}
    >
      {text}
    </button>
  )
}

Button.defaultProps = {
    color: 'steelblue'
}

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
}

export default Button
