import React from 'react'
import "./loader.css";

const Loader = () => {
    return ( 
        <div className='loading'>
        <div className='container-loading'>
            <div className='ring'></div>
            <div className='ring'></div>
            <div className='ring'></div>
            <span className='loading-text'>Wait....</span>
        </div>
        </div>
     );
}
 
export default Loader;