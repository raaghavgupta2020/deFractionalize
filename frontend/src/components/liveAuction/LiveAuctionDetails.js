import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import TinySlider from "tiny-slider-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress } from "../../blockchain/config";
import NFTContract from "../../blockchain/artifacts/contracts/NFTContract.sol/NFTContract.json";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import Divider from "../divider/Divider";
import CTA from "../cta/CTA";
import Swap from "../swap/swap";
import LiveAuctionData from "../../data/liveAuction/live-auction.json";

const LiveAuctionDetails = () => {
  const bidID = parseInt(useParams().BIDSID, 10);
  const bidDetailsData = LiveAuctionData.filter((is) => is.id === bidID);
  const bidsdata = bidDetailsData[0];
  console.log(typeof bidsdata);
  const [TokenIds, setTokenIds] = useState(0);
  const [poolId, setPoolId] = useState(0);
  const data = [];
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
    //const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(nftAddress, NFTContract.abi, provider);
    const TokenIds = await contract.lastTokenId();
    const poolId = await contract.tokenToPoolMap(TokenIds.toNumber());

    console.log("TokenIds", TokenIds.toNumber());
    console.log("poolId", poolId.toNumber());
    for (var i = 1; i <= TokenIds; i++) {
      console.log(i);
      data.push(i);
    }
    console.log("data", data);
    setPoolId(poolId.toNumber());

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (candidate) => {
        const tokenUri = await contract.tokenURI(candidate);
        const meta = await axios.get(tokenUri);
        // let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          // price,
          tokenId: candidate,
          owner: await contract.ownerOf(candidate),
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          nftstorage: meta.data.nftstorage,
          nftstoragedata: meta.data.nftstoragedata,
        };
        return item;
      })
    );
    console.log(items);
    setNfts(items);
    setLoadingState("loaded");
  }
  const nftData = nfts.filter((i) => i.tokenId == bidID);
  console.log("nftData type", typeof nftData);
  console.log("nftData", nftData);
  var nftdata = {
    tokenId: "",
    owner: "",
    image: "",
    name: "",
    description: "",
    nftstorage: "",
    nftstoragedata: "",
    price: "",
  };
  if (nftData.length == 0) {
    nftdata = {
      tokenId: "",
      owner: "",
      image: "",
      name: "",
      description: "",
      nftstorage: "",
      nftstoragedata: "",
      price: "",
    };
  } else {
    nftdata = nftData[0];
    console.log("nftdata ", nftdata.owner);
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, NFTContract.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  const clockTime = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="bid-ends">
        <div>
          <span className="days">{days}</span>
          <span>Days</span>
        </div>
        <div>
          <span className="hours">{hours}</span>
          <span>Hours</span>
        </div>
        <div>
          <span className="minutes">{minutes}</span>
          <span>Min</span>
        </div>
        <div>
          <span className="seconds">{seconds}</span>
          <span>Sec</span>
        </div>
      </div>
    );
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);

  const socialData = [
    {
      path: "#",
      icon: "img/core-img/icons8-facebook.svg",
    },
    {
      path: "#",
      icon: "img/core-img/icons8-twitter.svg",
    },
    {
      path: "#",
      icon: "img/core-img/icons8-instagram.svg",
    },
    {
      path: "#",
      icon: "img/core-img/icons8-slack.svg",
    },
    {
      path: "#",
      icon: "img/core-img/icons8-player.svg",
    },
  ];

  function ShareModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="shareModalLabel"
        centered
        className="share-modal"
      >
        <Modal.Body>
          <h5 id="shareModalLabel" className="text-center mb-3">
            Share this item
          </h5>
          <div className="d-flex align-items-center justify-content-center">
            {socialData.map((item, index) => (
              <a key={index} className="mx-2" href={item.path}>
                <img
                  src={`${process.env.PUBLIC_URL}/${item.icon}`}
                  alt="Social"
                />
              </a>
            ))}
          </div>
          <button
            onClick={props.onHide}
            className="btn btn-close-style btn-danger btn-sm rounded-pill"
            type="button"
          >
            <i className="bi bi-x-lg" />
          </button>
        </Modal.Body>
      </Modal>
    );
  }

  function CopyLink(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="CopyLinkLabel"
        centered
        className="share-modal"
      >
        <Modal.Body>
          <h5 id="CopyLinkLabel" className="text-center mb-3">
            Copy item link
          </h5>
          <p className="user-select-all mb-0 border border-2 p-3 rounded">
            {window.location.href}
          </p>

          <button
            onClick={props.onHide}
            className="btn btn-close-style btn-danger btn-sm rounded-pill"
            type="button"
          >
            <i className="bi bi-x-lg" />
          </button>
        </Modal.Body>
      </Modal>
    );
  }

  function Report(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="ReportLabel"
        centered
        className="share-modal"
      >
        <Modal.Body>
          <h5 id="ReportLabel" className="text-center mb-3">
            Why are you reporting?
          </h5>

          <form>
            <textarea
              className="form-control mb-3"
              id="reportText"
              name="reportMessage"
              placeholder="Write your complaint."
            />
            <button
              className="btn btn-primary btn-sm rounded-pill w-100"
              type="submit"
            >
              Report
            </button>
          </form>

          <button
            onClick={props.onHide}
            className="btn btn-close-style btn-danger btn-sm rounded-pill"
            type="button"
          >
            <i className="bi bi-x-lg" />
          </button>
        </Modal.Body>
      </Modal>
    );
  }

  const [key, setKey] = useState("details");

  const relatedProjectSlides = {
    items: 4,
    gutter: 24,
    slideBy: 1,
    autoplay: true,
    autoplayButtonOutput: false,
    autoplayTimeout: 5000,
    speed: 750,
    loop: true,
    mouseDrag: true,
    controls: true,
    nav: false,
    controlsText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsive: {
      320: {
        items: 1,
      },
      480: {
        items: 1.3,
      },
      576: {
        items: 2,
      },
      768: {
        items: 2.4,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 3.5,
      },
      1400: {
        items: 4,
      },
    },
  };

  const LiveAuctionsCards = nfts.map((elem, index) => (
    <div key={index}>
      <div className="nft-card card shadow-sm">
        <div className="card-body">
          <div className="img-wrap">
            {/* Image */}
            <img src={elem.image} alt={elem.name} />

            {/* Badge */}
            <div className={`badge bg-dark position-absolute section-`}>
              {/* <img
                src={`${process.env.PUBLIC_URL}/${elem.badgeInfo[0].icon}`}
                alt={elem.badgeInfo[0].text}
              /> */}
              Current Bid
            </div>

            {/* Bid End */}
            <Countdown
              date="April 24, 2023 00:00:00"
              intervalDelay={0}
              renderer={clockTime}
            />
          </div>

          {/* Others Info */}
          <div className="row gx-2 align-items-center mt-3">
            <div className="col-8">
              <span className="d-block fz-12">
                <i className={`bi bi-bag me-1`} />3 stocks available
              </span>
            </div>
            <div className="col-4 text-end">
              <button className="wishlist-btn" type="button">
                <i className="bi" />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="row gx-2 align-items-center mt-2">
            <div className="col-8">
              <div className="name-info d-flex align-items-center">
                <div className="author-img position-relative">
                  <img
                    className="shadow"
                    src="../img/bg-img/u4.jpg"
                    alt={elem.owner}
                  />
                  <i
                    className={`bi bi-check position-absolute bg-success true`}
                  />
                </div>

                <div className="name-author">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id={`liveAuctionNFT${elem.tokenId}`}>
                        {elem.name}
                      </Tooltip>
                    }
                  >
                    <Link
                      className="name d-block hover-primary text-truncate"
                      to={`/live-bid/${elem.tokenId}`}
                    >
                      {elem.name}
                    </Link>
                  </OverlayTrigger>
                  <Link
                    className="author d-block fz-12 hover-primary text-truncate"
                    to={`/author/${elem.owner}`}
                  >
                    ...{elem.owner.substring(30, 42)}
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="price text-end">
                <span className="fz-12 d-block">Current Bid</span>
                <h6 className="mb-0">{elem.price}</h6>
              </div>
            </div>

            <div className="col-12">
              <Link
                className={`btn btn-primary rounded-pill btn-sm mt-3 w-100`}
                to={`/live-bid/${elem.tokenId}`}
              >
                {/* <i className={`bi ${elem.buttonInfo[0].icon} me-1`}></i> */}
                Place Bid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  ));

  return (
    <>
      <Header />

      <Breadcrumb
        breadcrumbTitle="Details"
        breadcrumbNav={[
          {
            navText: "Home",
            path: "/",
          },
          {
            navText: "Live Bids",
            path: "/live-bidding",
          },
        ]}
      />

      <Divider />

      {/* Item Details */}
      <div className="item-details-wrap">
        <div className="container">
          <div className="row g-4 g-lg-5 align-items-center justify-content-center">
            {/* Item Thumbnail */}
            <div className="col-12 col-md-12 col-lg-6">
              <div className="item-big-thumb">
                <Zoom
                  overlayBgColorStart="rgba(0, 0, 0, 0)"
                  overlayBgColorEnd="rgba(0, 0, 0, 0.95)"
                  transitionDuration={400}
                >
                  <img src={nftdata.image} alt={nftdata.name} />
                </Zoom>
              </div>
            </div>

            {/* Item Details Content */}
            <div className="col-12 col-md-10 col-lg-6">
              <div className="item-details-content mt-5 mt-lg-0">
                {/* Share Modal */}
                <ShareModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />

                {/* Copy Link */}
                <CopyLink
                  show={modalShow2}
                  onHide={() => setModalShow2(false)}
                />

                {/* Report Modal */}
                <Report show={modalShow3} onHide={() => setModalShow3(false)} />

                <div className="d-flex flex-wrap align-items-center">
                  {/* Badge */}
                  <div className="badge border px-3 py-2 rounded-pill text-dark fz-14 d-inline-block ms-1 ms-sm-4">
                    <i className="me-1 bi bi-eye" />
                    10 watching now
                  </div>
                </div>

                {/* Title */}
                <h2 className="my-3">{nftdata.name}</h2>

                <div className="d-flex align-items-center mb-4">
                  {/* Author Image */}
                  <div className="author-img position-relative me-3">
                    <img
                      className="shadow"
                      src="../img/bg-img/u4.jpg"
                      alt={nftdata.owner}
                    />
                    <i
                      className={`bi bi-check position-absolute bg-primary true`}
                    />
                  </div>

                  {/* Name & Author */}
                  <div className="name-author">
                    <span className="d-block fz-14">Created by</span>
                    <Link
                      className="author d-block fz-16 hover-primary text-truncate"
                      to={`/author/${nftdata.owner}`}
                    >
                      {nftdata.owner.substring(30, 42)}
                    </Link>
                  </div>
                </div>

                <div className="border-top w-75 mb-4" />

                {/* Bids Countdown */}
                <p className="lh-1">Swap</p>
                {/* <Countdown
                  date="April 24, 2023 00:00:00"
                  intervalDelay={0}
                  renderer={clockTime}
                /> */}
                <Swap nftdata={nftdata} poolId={poolId} />

                <div className="border-top w-75 my-4" />

                {/* Short Description */}
                {/* <div className="short-description">
                  <h5>{nftdata.name}</h5>
                  <p
                    className="mb-0"
                    dangerouslySetInnerHTML={{
                      __html: nftdata.description.body,
                    }}
                  ></p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block w-100 mb-70" />

      {/* Tabs */}
      {/* <div className={`funto-tab-area ${bidsdata.tabVisibility}`}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tab--area bg-gray p-4 p-lg-5">
                <Tabs
                  id="itemDetailsTab"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="details" title="Details">
                    {bidsdata.firstTabContent.map((elem, index) => (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: elem }}
                      ></div>
                    ))}
                  </Tab>

                  <Tab eventKey="activity" title="Activity">
                    <div className="table-responsive border shadow-sm activity-table bg-white">
                      <table className="table mb-0">
                        <tbody>
                          {bidsdata.secondTabContent.map((ele, index) => (
                            <tr key={index}>
                              <th scope="row">{ele.firstData}</th>
                              <td>{ele.secondData}</td>
                              <td>{ele.thirdData}</td>
                              <td>{ele.fourthData}</td>
                              <td>{ele.fiveData}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Divider />

      <div className="related-project-area">
        <div className="container">
          <div className="section-heading">
            <h2 className="mb-0">Related Projects</h2>
          </div>

          {/* Slide */}
          <div className="related-project-slide">
            <TinySlider settings={relatedProjectSlides}>
              {LiveAuctionsCards}
            </TinySlider>
          </div>
        </div>
      </div>

      <Divider />

      {/* <CTA
        backgroundColor="primary" // try 'success', 'warning', 'danger', 'info' etc
        text="Resources for getting started with Funto."
        buttonText="Get Started"
        buttonColor="warning"
        buttonURL="#"
        buttonIcon=""
      /> */}

      {/* <Divider />

      <Footer /> */}
    </>
  );
};

export default LiveAuctionDetails;
