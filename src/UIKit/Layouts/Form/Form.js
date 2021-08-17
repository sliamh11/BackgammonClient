import './Form.css';

const Form = (props) => {
    return (
        <div className="Form">
            <h1>{props.header}</h1>
            <h3>{props.info}</h3>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}

export default Form;