import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";
import { create as ipfsClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { NFTStorage } from "nft.storage";
import { Buffer } from "buffer";
import { nftAddress } from "../../blockchain/config";
import NFTContract from "../../blockchain/artifacts/contracts/NFTContract.sol/NFTContract.json";

import $ from "jquery";
window.jQuery = window.$ = $;
require("jquery-nice-select");
window.Buffer = Buffer;

const projectId = "2DtK23NMPYkajvUB2oDFHLLuRPv";
const projectSecret = "4a45e46645c5eab8f415af8087bf59f9";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://nftstorage.link/ipfs/");
}
const CreateNewContent = () => {
  //const selectCata = useRef();
  const [fileUrl, setFileUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [tokenRes, setTokenRes] = useState();
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [mintednft, setMintedNft] = useState(false);
  async function onChange(e) {
    const file = e.target.files[0];
    setFiles(file);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://nftees.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    /* upload to NFT.storage */

    const clientnft = new NFTStorage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERCNWY1ODg0QjVENjY2Mjk4QzgwZGNmNEEzMDUxMTcyQzgyZGM3OEMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTQ1Mzk4NjE2NiwibmFtZSI6InRyYWlsMSJ9.deWJ3U60Ydi6hh-9XW2EVk9xlz7VKm03fxvrYqcovoQ",
    });

    const metadata = await clientnft.store({
      name,
      description,
      image: files,
    });
    console.log(makeGatewayURL(metadata.data.image.href));

    /* upload to IPFS */

    try {
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
        nftstorageURI: metadata.url,
        nftstoragedata: metadata.data,
      });
      const added = await client.add(data);
      const url = `https://nftees.infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function listNFTForSale() {
    console.log(formInput);
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(nftAddress, NFTContract.abi, signer);
    let transaction = await contract.mint(url);
    const res = await transaction.wait();
    console.log("res", res.events[0].args.tokenId.toNumber());
    setTokenRes(res.events[0].args.tokenId.toNumber());
    console.log("Transaction complete!");
    setMintedNft(true);
    // let transaction2 = await contract.createPool(
    //   res.events[0].args.tokenId.toNumber(),
    //   5 //create a state for this
    // );
    // // const res2 = await transaction2.wait();
    // console.log("res2");
    // console.log("Transaction2 complete!");
  }
  async function listNFTForSale2() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftAddress, NFTContract.abi, signer);
    console.log(
      "ethers.utils.parseEther",
      ethers.utils.parseUnits("25", "ether")
    );
    console.log("resSale2", tokenRes);

    let transaction2 = await contract.createPool(
      tokenRes,
      5, //create a state for this
      {
        value: ethers.utils.parseUnits("0.005", "ether"),
      }
    );
    // const res2 = await transaction2.wait();
    console.log("res2");
    console.log("Transaction2 complete!");
  }
  // useEffect(() => {
  //     $(selectCata.current).niceSelect();
  // }, []);

  return (
    <div className="create-new-wrapper">
      <div className="container">
        <div className="row g-5 justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Create New Form */}
            <div className="create-new-form border shadow-sm p-4 p-sm-5">
              <h2 className="mb-4">Create new NFT</h2>

              <div>
                <div className="row align-items-center">
                  {/* Upload Files */}
                  <div className="col-12">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2 fz-16">
                        Upload Files
                      </Form.Label>
                      <input
                        className="bg-transparent"
                        id="formFileMultiple"
                        type="file"
                        multiple
                        onChange={onChange}
                      />
                    </Form.Group>
                  </div>

                  {/* Checkbox */}
                  <div className="col-12">
                    <Form.Group className="mb-4">
                      <Form.Check
                        inline
                        type="radio"
                        label="Fixed price"
                        id="fixedPrice"
                        name="inlineRadioOptions"
                        defaultChecked
                      />

                      <Form.Check
                        inline
                        type="radio"
                        label="Unlock Purchased"
                        id="UnlockPurchased"
                        name="inlineRadioOptions"
                      />

                      <Form.Check
                        inline
                        type="radio"
                        label="Open for bids"
                        id="Openforbids"
                        name="inlineRadioOptions"
                      />
                    </Form.Group>
                  </div>

                  {/* Title */}
                  <div className="col-12">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2 fz-16">Title</Form.Label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Your NFT name"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2 fz-16">
                        Description
                      </Form.Label>
                      <textarea
                        id="description"
                        as="textarea"
                        placeholder="Write short description"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Price */}
                  <div className="col-12 col-md-6">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2 fz-16">Price</Form.Label>
                      <input
                        id="price"
                        type="text"
                        placeholder="0.324 ETH"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            price: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>

                  {/* Royality */}
                  <div className="col-12 col-lg-4">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2 fz-16">Royality</Form.Label>
                      <Form.Control
                        id="royality"
                        type="text"
                        placeholder="5%"
                      />
                    </Form.Group>
                  </div>

                  {/* No of Copies */}
                  {/* <div className="col-12 col-sm-6 col-lg-4">
                                        <Form.Group className="mb-4">
                                            <Form.Label className="mb-2 fz-16">No of copies</Form.Label>
                                            <Form.Control id="noOfcopies" type="text" placeholder="13" />
                                        </Form.Group>
                                    </div> */}

                  {/* Agree with Terms */}
                  <div className="col-12 col-md-8">
                    <Form.Check
                      className="mb-4 mb-md-0"
                      type="checkbox"
                      label="I agree to all terms & conditions."
                      id="rememberMe"
                      defaultChecked
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 col-md-4">
                    <button
                      className="btn btn-primary rounded-pill w-100"
                      onClick={listNFTForSale}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-8 col-lg-4">
            {/* Preview Card */}
            <div className="nft-card card shadow-sm">
              <div className="card-body">
                <div className="img-wrap">
                  {fileUrl ? (
                    <img src={fileUrl} alt="nft" />
                  ) : (
                    <img
                      src="https://funto.designing-world.com/img/bg-img/17.jpg"
                      alt=""
                    />
                  )}

                  {/* Badge */}
                  <div className="badge bg-dark position-absolute">
                    <img src="img/core-img/fire.png" alt="" />
                    Featured
                  </div>
                </div>

                {/* Others Info */}
                <div className="row gx-2 align-items-center mt-3">
                  <div className="col-8">
                    <span className="d-block fz-12">
                      <i className="bi bi-arrow-up" />
                      Floor price
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
                          src="img/bg-img/u1.jpg"
                          alt=""
                        />
                        <i className="bi bi-check position-absolute bg-success" />
                      </div>
                      <div className="name-author">
                        <Link
                          className="name d-block hover-primary text-truncate"
                          to="#"
                        >
                          {formInput.name}
                        </Link>
                        <Link
                          className="author d-block fz-12 hover-primary text-truncate"
                          to="#"
                        >
                          @creative_art
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="price text-end">
                      <span className="fz-12 d-block">Price</span>
                      <h6 className="mb-0">{formInput.price}</h6>
                    </div>
                  </div>
                </div>

                {/* Button */}
                {mintednft ? (
                  <div className="row gx-2 align-items-center mt-3">
                    <div className="col-6">
                      <button
                        onClick={listNFTForSale2}
                        className="btn btn-warning btn-sm rounded-pill"
                        to="#"
                      >
                        Create Pool
                      </button>
                    </div>
                    <div className="col-6 text-end">
                      <Link
                        className="btn btn-minimal btn-sm hover-primary"
                        to="#"
                      >
                        <input type="text" placeholder="25" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            <h5 className="mb-0 mt-3 text-center">
              <i className="bi bi-eye me-1" />
              Live Preview
            </h5>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CreateNewContent;
