import './Line.css';

const Line = (props) => {
    return(
        <div className={`Line ${props.className || ""}`} justify={props.justify}>
            {props.children}
        </div>
    )
}

export default Line;