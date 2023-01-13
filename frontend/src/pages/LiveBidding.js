import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftAddress } from "../blockchain/config";
import NFTContract from "../blockchain/artifacts/contracts/NFTContract.sol/NFTContract.json";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import Divider from "../components/divider/Divider";

const LiveBidding = () => {
  const [count, setCount] = useState(12);
  const [noMorePost, setNoMorePost] = useState(false);
  //    const countSlice = LiveAuctionData.slice(0, count);

  const [nfts, setNfts] = useState([]);
  const [TokenIds, setTokenIds] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const data = [];
  const tokenURIs = [];

  useEffect(() => {
    loadNFTs();
  }, []);
  async function increment() {
    for (var i = 1; i <= TokenIds; i++) {
      console.log(i);
      data.push(i);
    }
  }
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
    //const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(nftAddress, NFTContract.abi, provider);
    const TokenIds = await contract.lastTokenId();
    console.log("TokenIds", TokenIds);
    setTokenIds(TokenIds.toNumber());
    console.log("TokenIds", TokenIds.toNumber());
    for (var i = 1; i <= TokenIds; i++) {
      console.log(i);
      data.push(i);
    }
    console.log("data", data);

    const options = { method: 'GET', headers: { accept: 'application/json', 'X-API-Key': 'test' } };

    fetch('https://deep-index.moralis.io/api/v2/nft/0xe6c5586d13ad0f33f438fa6A4002EA05A48994b5?chain=mumbai&format=decimal', options)
      .then(response => response.json())
      .then(async (response) => {
        console.log(response);
        for (var i = 0; i < response.result.length; i++) {
          console.log(response.result[i].token_uri);
          tokenURIs.push(response.result[i].token_uri);
        }
        const myItems = await Promise.all(
          tokenURIs.map(async (tokenUri) => {
            const meta = await axios.get(tokenUri);
            console.log("moralis fetch ", meta);
            let item = {
              tokenId: 1,
              owner: await contract.ownerOf(1),
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
              nftstorage: meta.data.nftstorage,
              nftstoragedata: meta.data.nftstoragedata,
            };
            return item;
          })
        );

      })
      .catch(err => console.error(err));

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
  const handleLoadMore = () => {
    setCount(count + 4);
    if (count >= nfts.length) {
      setNoMorePost(true);
    }
  };

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

  const LiveAuctionsCards = nfts.map((elem, index) => (
    <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="nft-card card shadow-sm">
        <div className="card-body">
          <div className="img-wrap">
            {/* Image */}
            <img src={elem.image} alt={elem.name} />

            {/* Badge */}
            <div className={`badge bg-dark position-absolute section-`}>
              {/* <img src={`${process.env.PUBLIC_URL}/${elem.badgeInfo[0].icon}`} alt={elem.badgeInfo[0].text} /> */}
              New Bid
            </div>

            {/* Bid End */}
            {/* <Countdown date={elem.bidEndsTime} intervalDelay={0} renderer={clockTime} /> */}
            {/* <Countdown
              date="April 24, 2023 00:00:00"
              intervalDelay={0}
              renderer={clockTime}
            /> */}
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
                    src="img/bg-img/u4.jpg"
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
                {/* <i className={`bi ${elem.buttonInfo[0].icon} me-1`} ></i> */}
                Swap Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <Header />

      <Breadcrumb
        breadcrumbTitle="Live Bids"
        breadcrumbNav={[
          {
            navText: "Home",
            path: "/",
          },
        ]}
      />

      <Divider />

      <div className="live-bids-wrapper">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {LiveAuctionsCards}
          </div>
        </div>

        <div className="container">
          <div className="text-center mt-70">
            <button
              className="btn btn-primary px-4 rounded-pill"
              onClick={() => handleLoadMore()}
              disabled={noMorePost ? "disabled" : null}
            >
              {noMorePost ? (
                <span className="d-flex align-items-center">
                  No Items Here
                  <i className="ms-2 bi bi-emoji-frown" />
                </span>
              ) : (
                <span className="d-flex align-items-center">
                  View More Items
                  <i className="ms-2 bi bi-arrow-repeat" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>


    </>
  );
};

export default LiveBidding;
