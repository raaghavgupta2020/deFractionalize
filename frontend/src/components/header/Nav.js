import { NavLink } from "react-router-dom";

export default function FuntoNavbar() {
  return (
    <div className="navbar-nav navbar-nav-scroll my-2 my-lg-0">
      <NavLink to="/home1" className="ft-dd" title="Home" id="Home">
        Home
      </NavLink>
      <NavLink to="/farm" className="ft-dd" title="Home" id="Home">Farm NFTs</NavLink>
      <NavLink to="/create-new" className="ft-dd" title="Home" id="Home">
        Mint NFT
      </NavLink>
      <NavLink to="/live-bidding" className="ft-dd" title="Home" id="Home">Current Listings</NavLink>
    </div>
  );
}
