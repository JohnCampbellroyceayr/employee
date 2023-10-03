import React, { Component } from 'react';
import './styling/button.css'

class Button extends Component {
    render() { 
        const btn = this.props.button;
        const disabled = (btn.disabled === true) ? true : false;
        return (
            <button onClick={btn.onclick} className={btn.class} disabled={disabled}>{btn.text}</button>
        );
    }
}
 
export default Button;