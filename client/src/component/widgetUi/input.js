import React, {useState} from 'react';

export default function MyInput(props){
    const [isActive, setisActive] = useState(false)
    if(props.value !== ''){
        if(!isActive){
            setisActive(true)
        }
    }
    return(
        <div className="parent-input">
            {/* <i className="fas fa-user in-icon"></i> */}
            <input
                onClick={()=>{setisActive(true)}}
                onBlur={()=>{setisActive(false)}}
                type={props.type} 
                className="input-styles log-input"
                onChange={props.onChange}
            />
            <label className={`label ${isActive ? 'active' : ''}`}>{props.label}</label>
            <span className={`line ${isActive ? 'line-odd-active' : ''}`}></span>
            <span className={`line ${isActive ? 'line-even-active' : ''}`}></span>
            <span className={`line ${isActive ? 'line-odd-active' : ''}`}></span>
            <span className={`line ${isActive ? 'line-even-active' : ''}`}></span>
        </div>
    )
}