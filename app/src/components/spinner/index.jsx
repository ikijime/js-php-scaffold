import React from 'react';
import { Spinner } from 'react-bootstrap';

const EditorSpinner = ({active, style = "panel-spinner"}) => {
    return (
        <div className={active ? "active " + style : style}>
            <Spinner animation="border"/>
        </div>
    )
}

export default EditorSpinner;