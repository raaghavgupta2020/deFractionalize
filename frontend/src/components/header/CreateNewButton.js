import { Link } from "react-router-dom";
import wallet from './wallet.png'
export default function CreateNewButton(props) {
    const { buttonColor, buttonURL } = props;

    return (
        <Link className={`btn ${buttonColor} btn-sm rounded-pill`} to={buttonURL}>
            <img src={wallet} alt="wallet" style={{ "maxHeight": "20px" }} />
        </Link>
    )
}