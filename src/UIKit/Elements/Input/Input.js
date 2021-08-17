import './Input.css';
import { Line, Icon } from 'UIKit';

const Input = (props) => {
    return (
        <div className="Input">
            {props.label ? <div><label className="label">{props.label}</label></div> : undefined}
            <Line>
                <input
                    type={props.type || 'text'}
                    name={props.name || undefined}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                />
                {props.i ? <Icon i={props.i} /> : ''}
            </Line>
        </div>
    )
}

export default Input;