import './LoginView.css';
import { Box, Form, Input, Button } from "UIKit";
import { useInput } from 'Hooks';
import { useState } from 'react';
import { setUserState } from 'State/Actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import UserModel from 'models/UserModel';

const LoginView = (props) => {

    // --------- States ---------
    const api_login = useSelector((state) => `${state.apiUrls.auth}/login`);
    const username = useInput('');
    const password = useInput('');
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    // --------- Helpers ---------
    const isFormValid = () => {
        if (username.value.trim() === '') {
            setError("Username field is empty.");
            return false;
        }
        if (password.value.trim() === '') {
            setError("Password field is empty.");
            return false;
        }
        return true;
    }

    const handleOnClick = async () => {
        // If the form is valid, send the data to the server.
        try {
            if (isFormValid()) {
                const user = new UserModel(username, password);
                const result = await axios.post(api_login, user);
                if (result) {
                    console.log(result);
                    setError('');
                    const { token, username } = result.data;
                    sessionStorage.setItem("access-token", token);
                    dispatch(setUserState(username));
                } else {
                    setError("Wrong information provided.")
                }
            }
        } catch (error) {
            setError(error.response.data);
        }
    }

    return (
        <div className="login-container center">
            <Box>
                <Form header="Login">
                    {error ? <div className="error">{error}</div> : ""}
                    <Input {...username} label="Username:" name="username" />
                    <Input {...password} label="Password:" name="password" />
                    <div className="center">
                        <Button onClick={handleOnClick}>Login</Button>
                    </div>
                </Form>
            </Box>
        </div>
    )
}


export default LoginView;