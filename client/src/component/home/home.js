import React, {useState, useEffect} from 'react';
import { Container } from '@material-ui/core';
import Messages from './messages';
import {HomeContext} from '../../context/context';
import {getContactAndMessageReq} from '../../actions/action'
import Layout from '../../hoc/layout';
import MessageRequest from './message_request';

export default function Home(){
    const [togle, setTogle] = useState(false);
    const [contact, setContact] = useState([]);
    const [messageReq, setMessageReq] = useState([]);


    const updateStateContact = ()=>{
        getContactAndMessageReq(contact.length).then(res =>{
            if(res.payload.error){
                return
            }
            let forContact = [];
            let forMessageReq = [];
            for(let p of res.payload){
                if(p.messagereq){
                    forMessageReq.push(p.messagereq)
                }else if(p.contact){
                    forContact.push(p.contact)
                }
            }
            setContact([
                ...contact,
                ...sort(forContact)
            ])
            setMessageReq([
                ...messageReq,
                ...sort(forMessageReq)
            ])
        })
    }

    console.log(contact)
    console.log(messageReq)

    const sort = (dataToSort)=>{
        
        const sorted = dataToSort.sort((a, b) =>{
            let dateA = Date.parse(new Date(a.createdAt))
            let dateB = Date.parse(new Date(b.createdAt))

            if(dateA < dateB){
                return 1
            }
            if(dateA > dateB){
                return -1
            }
            return 0
        })
        
        return sorted

    }

    useEffect(updateStateContact, [])

    const toggleMessageReqPage = ()=>{
        setTogle(true)
    }

    return(
        <HomeContext.Provider
            value={{
                contact: contact,
                messageReq: messageReq,
                togglePageMessageReq: toggleMessageReqPage
            }}
        >
            <Layout>
                <Container
                    maxWidth="sm"
                >
                    <div className="form-input mt-1-5">
                        <i className="fas fa-search"></i>
                        <input className="input-styles" placeholder="Search"/>
                        <span className="sline"></span>
                    </div>
                    {!togle ? <Messages /> : <MessageRequest />}
                </Container>
            </Layout>
        </HomeContext.Provider>
    )
}

function useMessageState(initialValue){
    const [value, setValue] = useState(initialValue);

    const handleChangeState = (val)=>{
        setValue(val)
    }

    return{
        value,
        handleChangeState
    }
}