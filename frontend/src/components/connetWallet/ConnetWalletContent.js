import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'





const ConnectWalletContent = () => {

    const [haveMetamask, sethaveMetamask] = useState(true);
    const [accountAddress, setAccountAddress] = useState("");
    const [domain, setDomain] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoggedin, setLoggedin] = useState(false);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            let balance = await provider.getBalance(accounts[0]);
            let bal = ethers.utils.formatEther(balance);
            setAccountAddress(accounts[0]);
            setIsConnected(true);
            localStorage.setItem("wallet_address", accounts[0]);
            console.log(isConnected);
            console.log(accountAddress);
            // CreateItem();
        } catch (error) {
            console.log(error);
        }
    };



    

    useEffect(() => {

        if (isConnected ) {
            setAccountAddress(JSON.parse(localStorage.getItem("wallet_address")));
            setDomain(JSON.parse(localStorage.getItem("domain")));
        }

        const { ethereum } = window;
        const checkMetamaskAvailability = async () => {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            sethaveMetamask(true);
        };

        checkMetamaskAvailability();
    }, []);





    return (
        <div className="connect-wallet-wrapper">
            <div className="container" >
                <div className="text-center" >
                    
                    {isConnected ? (<><h3> Your Wallet Address : {`0x...${accountAddress.slice(35, 42)}`}</h3></>) : (<></>)}

                </div>

                < div className="row g-4 g-xl-5 justify-content-center" >
                    <div className="col-12 col-md-9 col-lg-6 col-xl-5" >
                        <div className="card wallet-card shadow-sm" >
                            <div className="card-body px-4" >
                                <div className="d-flex align-items-center" >
                                    <div className="img-wrap" >
                                        <img src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" alt="Metamask" />
                                    </div>
                                    <h4 className="mb-0 me-3" > Metamask
                                        < span className="badge bg-danger rounded-pill align-top fz-12 ms-1" >
                                            Hot
                                        </span>
                                    </h4>
                                    < button className={`btn btn-sm btn-warning rounded-pill ms-auto`
                                    } onClick={connectWallet} >
                                        {isConnected ? (`0x...${accountAddress.slice(35, 42)}`) : ("Connect")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                   
                </div>
            </div>
        </div>
    )
}

export default ConnectWalletContent;
