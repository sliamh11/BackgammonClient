import './Dialog.css';
import { Box, Button } from 'UIKit';
import { useEffect, useRef } from 'react';

const Dialog = (props) => {
    // ------ States ------
    const dialogContainer = useRef();

    // ------ useEffects ------
    useEffect(() => {
        window.addEventListener('click', isClickBlocked);
        return () => {
            window.removeEventListener('click', isClickBlocked)
        }
    }, []);

    // ------ Helpers ------
    const isClickBlocked = (e) => {
        // If clicked outside the dialog box - cancel the click event.
        if (!(dialogContainer?.current?.contains(e?.target))) {
            e.preventDefault();
        }
    }

    return (
        <div className="Dialog">
            <div className="dialog-container">
                <Box>
                    <h1 className="header">{props.header}</h1>
                    <div className="content">
                        {props.content}
                    </div>
                    <div className="button-container">
                        {props.children}
                    </div>
                </Box>
            </div>
        </div>
    )
}

export const ConfirmDialog = (props) => {
    const handleRequestDeclined = () => {
        props.setResult({isDeclined: true});
    }

    const handleRequestAccepted = () => {
        props.setResult({isAccepted: true});
    }
    return (
        <Dialog {...props}>
            <Button onClick={handleRequestAccepted}>Accept</Button>
            <Button onClick={handleRequestDeclined}>Decline</Button>
        </Dialog>
    )
}

export const AlertDialog = (props) => {

    const handleOkClicked = () => {
        props.setResult({isClosed: true});
    }

    return (
        <Dialog {...props}>
            <Button onClick={handleOkClicked}>Ok</Button>
        </Dialog>
    )
}

export default AlertDialog;