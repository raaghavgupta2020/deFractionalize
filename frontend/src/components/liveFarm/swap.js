import { useState, useEffect } from "react";
import "./swap.css";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress } from "../../blockchain/config";
import NFTContract from "../../blockchain/artifacts/contracts/NFTContract.sol/NFTContract.json";
const Swap = (props) => {
  const { owner } = props.nftdata;
  const [inputrev, setInput1] = useState(0);
  const [inputmatic, setInput2] = useState(0);
  const [whichfeild, setWhichfeild] = useState(0);
  async function calculate() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftAddress, NFTContract.abi, signer);
    const pooldata = await contract.pool_data(props.poolId);
    console.log(pooldata.nft_fractions.toNumber());
    const pool_const =
      pooldata.nft_fractions.toNumber() *
      Number(ethers.utils.formatEther(pooldata.token_liq));
    console.log("pool_const", pool_const);

    if (inputrev > 0) {
      // Swap TO Revenue from Fractions
      var tokens =
        Number(inputrev)/10000 * 264 
      setInput2(tokens);
      console.log("tokens", tokens);
    } else {
      // Swap FROM fractions to revenue
      var fractions =
        pooldata.nft_fractions.toNumber() -
        pool_const /
        (Number(ethers.utils.formatEther(pooldata.token_liq)) +
          Number(inputmatic));
      
      setInput1(fractions);
      console.log("fractions", fractions);
    }
  }

  async function Swapfunction() {
    console.log("poolId", props.poolId);
    console.log(owner);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftAddress, NFTContract.abi, signer);
    
    if (whichfeild == 1) {
      console.log(whichfeild);
      const swap1 = contract.swap(props.poolId, inputfrac, {
        value: ethers.utils.parseEther("0"),
      });
    } else {
      console.log(whichfeild);
      console.log("dbg log");
      const ethDbg = ethers.utils.parseEther(inputmatic);
      console.log("ethDbg ", ethDbg);
      const swap1 = contract.swap(props.poolId, 0, {
        value: ethDbg,
      });
    }
    const pooldata = await contract.pool_data(props.poolId);
    const token_liq_in_eth = ethers.utils.formatEther(pooldata.token_liq);
    console.log("pooldata fractions", pooldata.nft_fractions);
    console.log("token_liq_in_eth: ", token_liq_in_eth);
  }

  return (
    <>
      <div class="section uniswapSection">
        <div class="uniswap">
          <div class="uniswapHead">
            {/* <input id="uniswapSettingsTrigger" hidden type="checkbox" />
            <div class="buttons">
              <label for="uniswapSettingsTrigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sc-1ndknrv-0 fZuPAR"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </label> 
          </div>*/}
            {/* <div class="uniswapSettings">
              <h4>Transaction Settings</h4>
              <div class="settingField">
                <div class="pretext">Slippage tolerance</div>
                <input type="text" placeholder="4.00%" />
              </div>
              <div class="settingField">
                <div class="pretext">Transaction deadline</div>
                <input type="text" placeholder="20 minutes" />
              </div>
              <h4>Interface Settings</h4>
              <div class="settingFieldInline">
                <div class="pretext">Toggle Expert Mode</div>
                <input hidden id="toggleExpertMode" type="checkbox" />
                <label class="uniswapSettingsSwitch" for="toggleExpertMode"></label>
              </div>
              <div class="settingFieldInline">
                <div class="pretext">Disable Multihops</div>
                <input hidden id="disableMultiHops" type="checkbox" />
                <label class="uniswapSettingsSwitch" for="disableMultiHops"></label>
              </div>
            </div> */}
          </div>
          <div class="uniswapBody">
            <div class="uniswapFields">
              <div class="uniswapField">
                <div class="uniswapSelector">
                  <img
                    class="uniswapSelectorLogo"
                    src="https://assets.coingecko.com/coins/images/4454/thumb/0xbtc.png?1561603765"
                  />
                  <div class="uniswapSelectorText">Profits</div>
                  <div class="uniswapSelectorArrow">
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="sc-33m4yg-8 khlnVY"
                    >
                      <path
                        d="M0.97168 1L6.20532 6L11.439 1"
                        stroke="#AEAEAE"
                      ></path>
                    </svg>
                  </div>
                </div>
                <input
                  class="uniswapTextInput"
                  type="text"
                  placeholder="0.0"
                  value={inputmatic}
                  onChange={(e) => {
                    setInput2(e.target.value);
                    setWhichfeild(1);
                  }}
                />
              </div>
              <div class="uniswapArrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6E727D"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
              <div class="uniswapField">
                <div class="uniswapSelector">
                  <img
                    class="uniswapSelectorLogo"
                    src="https://assets.coingecko.com/coins/images/11035/thumb/0xmnr.PNG?1587357680"
                  />
                  <div class="uniswapSelectorText">0xFRN</div>
                  <div class="uniswapSelectorArrow">
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="sc-33m4yg-8 khlnVY"
                    >
                      <path
                        d="M0.97168 1L6.20532 6L11.439 1"
                        stroke="#AEAEAE"
                      ></path>
                    </svg>
                  </div>
                </div>
                <input
                  class="uniswapTextInput"
                  type="text"
                  placeholder="0.0"
                  value={inputrev}
                  onChange={(e) => {
                    setInput1(e.target.value);
                    setWhichfeild(0);
                  }}
                />
              </div>
            </div>
            <button class="uniswapButton" onClick={calculate}>
              Calculate
            </button>
            <button class="uniswapButton" onClick={Swapfunction}>
              Stake
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Swap;
