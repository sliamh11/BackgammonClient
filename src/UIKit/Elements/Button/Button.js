import './Button.css';
import { Icon, Line } from 'UIKit';

const Button = (props) => {
    return (
        <div className="Button" onClick={props.onClick}>
            <Line justify="between">
                <div>{props.children}</div>
                {props.i ? <Icon i={props.i} /> : undefined}
            </Line>
        </div>
    )
}

export default Button;