import './SignupView.css';
import { useInput } from 'Hooks';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignupModel from 'models/SignupModel';
import { Box, Form, Input, Button } from 'UIKit';
import axios from 'axios';
import { setUserState } from 'State/Actions';

const SignupView = (props) => {

    // ------ States ------
    const api_signup = useSelector((state) => `${state.apiUrls.auth}/signup`);
    const dispatch = useDispatch();
    const username = useInput('');
    const password = useInput('');
    const password_validation = useInput('');
    const [error, setError] = useState(null);

    // ------ Helpers ------
    const handleSignupClick = async () => {
        // If input is valid, signup and then login.
        try {
            setError('');
            if (isInputsValid()) {
                const result = await signup();
                if (result) {
                    login(result.data);
                }
            }
        } catch (error) {
            setError(error.response.data);
        }
    }

    const isInputsValid = () => {
        if (username.value.trim() === '') {
            setError("Username field is empty.");
            return false;
        }
        if (password.value.trim() === '') {
            setError("Password field is empty.");
            return false;
        }
        if (password.value !== password_validation.value) {
            setError("Passwords doesn't match.");
            return false;
        }
        return true;
    }

    const signup = async () => {
        const user = new SignupModel(username, password, password_validation);
        return await axios.post(api_signup, user);
    }

    const login = ({ token, username }) => {
        // Add the token to the user's session storage and update userState.
        sessionStorage.setItem("access-token", token);
        dispatch(setUserState(username));
    }

    return (
        <div className="signup-container center">
            <Box>
                <Form header="Signup">
                    {error ? <div className="error">{error}</div> : ""}
                    <Input {...username} label="Username:" />
                    <Input {...password} label="Password:" />
                    <Input {...password_validation} label="Validate Password:" />
                    <div className="center">
                        <Button onClick={handleSignupClick}>Sign Up</Button>
                    </div>
                </Form>
            </Box>
        </div>
    )
}

export default SignupView;