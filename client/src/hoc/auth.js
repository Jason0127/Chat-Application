import React, {useEffect, useState} from 'react';
import {auth} from '../actions/action'

export default function Auth(ComposeFunction, props, condition){
    const [loader, setLoader] = useState(true)
    const [userInfo, setUserInfo] = useState('')
    console.log(props)
    useEffect(()=>{
        auth().then(res =>{
            setLoader(false)
            setUserInfo(res)
            if(res.error && condition){
                props.history.push('/login')
            }else if(!condition && !res.error){
                props.history.push('/')
            }
        })
    }, [props.history, condition])

    if(loader){
        return(
            <div>
                loading...
            </div>
        )
    }

    return(
        <div>
            <ComposeFunction {...props} userInfo={userInfo} />
        </div>
    )

}