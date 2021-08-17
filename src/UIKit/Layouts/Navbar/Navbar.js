import './Navbar.css';
import { Line } from 'UIKit';
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'UIKit';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserState } from 'State/Actions';

const Navbar = (props) => {

    // ------ States ------
    const [isOpen, setIsOpen] = useState(false); // Dropdown component state.
    const dropdownContainer = useRef(); // Dropdown container.
    const username = useSelector((state) => state.userState);
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket);

    // ------ useEffects ------
    useEffect(() => {
        window.addEventListener('click', onCloseIfOpen);

        return () => {
            window.removeEventListener('click', onCloseIfOpen);
        }
    }, []);

    // ------ Helpers ------
    const onCloseIfOpen = (e) => {
        // if the clicke wasn't inside the dropdownContainer's boundries, close it.
        if (!(dropdownContainer?.current?.contains(e.target))) {
            setIsOpen(false);
        }
    }

    const handleDropdownClick = () => {
        setIsOpen(!isOpen);
    }

    const loadDropdown = () => {
        // If user isn't logged in
        if (!username) {
            return (
                <div className="dropdown">
                    <div className="item first">
                        <NavLink exact to="/login">Login</NavLink>
                    </div>
                    <div className="seperator"></div>
                    <div className="item last">
                        <NavLink exact to="/signup">Sign Up</NavLink>
                    </div>
                </div>
            )
        } else {
            // <a> because I want the site to refresh it's states.
            return (
                <div className="dropdown">
                    <div className="item first">
                        <a href="/">Home</a>
                    </div>
                    <div className="seperator"></div>
                    <div className="item last" onClick={handleSignOut}>
                        <a href="/login">Sign Out</a>
                    </div>
                </div>
            )
        }
    }

    const handleSignOut = () => {
        // On signout, delete the token, reset the userState and disconnect from socket. 
        sessionStorage.removeItem("access-token");
        dispatch(setUserState(null));
        socket.disconnect();
    }

    return (
        <nav className="Navbar">
            <div className="dropdown-container" ref={dropdownContainer}>
                <div className="menu-icon" onClick={handleDropdownClick}>
                    <Icon i={faCaretSquareDown} />
                </div>
                {isOpen
                    ? loadDropdown()
                    : ''}
            </div>
            <Line className="title">Sela Talkback</Line>
        </nav>
    )
}

export default Navbar;