import './ContactsList.css';
import { useSelector } from 'react-redux';
import { User } from 'Components';

const ContactsList = (props) => {

    // ------ States ------
    const username = useSelector((state) => state.userState);
    const { users, status } = props;

    // ------ Helpers ------
    const loadContacts = () => {
        return users.map((value, index) => {
            if (value.username !== username) {
                return <User key={index} user={value.username || value} status={status} />;
            }
        });
    }

    return (
        <div className="contacts-list-container">
            {loadContacts()}
        </div>
    )
}

export default ContactsList;