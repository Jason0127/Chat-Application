import React, {useState} from 'react';
import MyInput from '../widgetUi/input';
import { Typography, Button } from '@material-ui/core';
import {login} from '../../actions/action'

export default function Login(props){
    const userName = useFormInput('')
    const password = useFormInput('')


    const handleSubmit = (e)=>{
        e.preventDefault()
        const data = {
            userName: userName.value,
            password: password.value
        }

        login(data).then(res =>{
            if(res.payload.isAuth){
                props.history.push('/')
            }else{
                
            }
        })
        
    }

    return(
        <div className="login">
            <div className="log-container">
                <Typography variant="h4" align="center">
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div className="login-text">
                        <MyInput 
                            value={userName.value}
                            onChange={userName.onChange}
                            label="Username"
                            type="text"
                        />
                    </div>
                    <div className="login-text">
                        <MyInput 
                            value={password.value}
                            onChange={password.onChange}
                            label="Password"
                            type="password"
                        />
                    </div>
                    <Button color="primary" type="submit">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}

function useFormInput(val){
    const [value, setValue] = useState(val)

    const handleChange =(e) =>{
        setValue(e.target.value)
    }

    return{
        value,
        onChange: handleChange
    }
}