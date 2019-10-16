import React from 'react';
import Header from '../component/header/header';


export default function Layout(props) {
    console.log(props)
    return(
        <div>
            <Header />
            <div>
                {props.children}
            </div>
        </div>
    )
}