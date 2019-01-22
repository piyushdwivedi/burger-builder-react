import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let ele = null;
    const inputClasses = [classes.element];

    if(props.invalid && props.shouldValidate && props.changedVal) {
        inputClasses.push(classes.Invalid);
    }
    switch (props.type) {
        case('input'):
            ele = <input className={inputClasses.join(' ')} onChange={props.changed}  onChange={props.changed}{...props.config} value={props.value}/>
            break;
        case('textarea'):
            ele = <textarea className={inputClasses.join(' ')} onChange={props.changed} {...props.config} value={props.value}/>
            break;
        case('select'):
            ele = (
                <select 
                    className={classes.element}  onChange={props.changed}
                    value={props.value}>
                    {props.config.options.map(item => (
                        <option value={item.value} key={item.value}>{item.displayVal}</option>
                    ))}
                </select>
            );
            break;
        default: 
            ele = <input className={inputClasses.join(' ')} onChange={props.changed} {...props.config} value={props.value}/>
    }
    return (
        <div className={classes.Input} >
            <label className={classes.Label}>{props.label}</label>
            {ele}
        </div>
    )
}
export default input;