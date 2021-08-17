import './Dice.css';
import { Icon } from 'UIKit';
import { faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons';

// This component displays the dice which the player rolled.
const Dice = (props) => {

    const chooseDice = () => {
        switch (props.dice) {
            case "1":
                return <Icon i={faDiceOne} />

            case "2":
                return <Icon i={faDiceTwo} />

            case "3":
                return <Icon i={faDiceThree} />

            case "4":
                return <Icon i={faDiceFour} />

            case "5":
                return <Icon i={faDiceFive} />

            case "6":
                return <Icon i={faDiceSix} />

            default:
                return <> </>
        }
    }
    return(
        <div className="dice-container">
            {chooseDice()}
        </div>
    );
}

export default Dice;