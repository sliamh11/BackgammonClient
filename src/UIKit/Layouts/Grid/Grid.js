import './Grid.css';

const Grid = (props) => {
    return (
        <div className={`Grid ${props.className}`}>
            {props.children}
        </div>
    )
}

export const Main = (props) => {
    return (
        <Grid className="main">
            {props.children}
        </Grid>
    )
}

export const Contact = (props) => {
    return (
        <Grid className="contact">
            {props.children}
        </Grid>
    )
}

export default Grid;