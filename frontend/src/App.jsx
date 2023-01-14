import { Routes, Route } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

import "./assets/css/animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery-nice-select/css/nice-select.css";
import "./assets/css/bootstrap-icons.css";
import "tiny-slider/dist/tiny-slider.css";
import "./assets/scss/style.scss";

import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeOne from "./pages/HomeOne";
import ConnectWallet from './pages/ConnectWallet'
import CreateNew from './pages/CreateNew'
import LiveBidding from './pages/LiveBidding'
import LiveAuctionDetails from "./components/liveAuction/LiveAuctionDetails";

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" index element={<HomeOne />} />
        <Route path="/home1" element={<HomeOne />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/create-new" element={<CreateNew />} />
        <Route path="/live-bidding" element={<LiveBidding />} />
        <Route path="/live-bid/:BIDSID" element={<LiveAuctionDetails />} />

       
      </Routes>
      <ScrollToTop
        id="scrollTopButton"
        width="14"
        height="14"
        component={<i className="bi bi-arrow-up-short" />}
        color="white"
        smooth
        top={200}
      />
      
    </div>
  );
}

export default App;
