import React, { useState, useRef } from 'react';
import { IconButton,  } from '@material-ui/core'

export default function ContenEditaBle(props){
    const blinkCarret = useSetClasses('')
    const labelProp = useSetClasses('');
    const messageBox = useRef(null);

    const handleInput = (e)=>{
        props.onChange(e)
        // console.log(e.currentTarget.textContent)
        if(e.currentTarget.textContent !== ''){
            labelProp.handleChange('hide')
            return blinkCarret.handleChange('')
        }
        labelProp.handleChange('show')
        return blinkCarret.handleChange('blink')
    }

    const handleClick = ()=>{
        props.onClick()
        if(props.value !== ''){
            return '';
        }
        labelProp.handleChange('show')
        return blinkCarret.handleChange('blink');
    }

    const handleEnter = (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            handleSendMessge(e);
        }
        return false
    }

    const handleSendMessge = (e)=>{
        if(messageBox.current.textContent !== ''){
            props.handeSendMessage()
            messageBox.current.textContent = '';
            labelProp.handleChange('show')
            return true;
        }
        return false;
    }


    // console.log(props.ariaLabel)

    return(
        <React.Fragment>
            <div className="text-box d-inline-block p-relative">
                <span className={`carret ${blinkCarret.value}`}></span>
                <span className={`label ${labelProp.value}`}>{props.ariaLabel}</span>
                <div className="r-input">
                    <div 
                        className="contentable-text"
                        suppressContentEditableWarning={true} 
                        contentEditable 
                        onInput={(e)=>handleInput(e)}
                        onClick={()=>handleClick()}
                        onBlur={()=>blinkCarret.handleChange('')}
                        onKeyPress={(e)=>handleEnter(e)}
                        ref={messageBox}
                    >
                    </div>
                </div>
            </div>
            <IconButton
                onClick={(e)=>handleSendMessge(e)}
            >
                <i className="far fa-paper-plane"></i>
            </IconButton>
        </React.Fragment>
    )
}

function useSetClasses(initialValue){
    const [value, setValue] = useState(initialValue);

    function handleChange(value){
        setValue(value);
    }

    return {
        value,
        handleChange
    }

}