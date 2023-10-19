import React from "react";
import { Container } from "react-bootstrap";

const NotFound = () => {

    return (
    <Container className="text-center p-5" style={{marginTop: 30}}>
        <h1 style={{color:'#ff7454', fontSize:60}}>Oops!</h1>
        <br/>
        <h4 className="text-danger">Page not found!</h4>
    </Container>
    )
}
export default NotFound 