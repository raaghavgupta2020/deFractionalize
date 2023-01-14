import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ScrollAnimation from "react-animate-on-scroll";



const Activity = () => {
    const [key, setKey] = useState('today');
    const [tokens, setTokens] = useState("");
    const [user, setUser] = useState("");
    const [data, setData] = useState([]);
    const tokenID = [];
    useEffect(() => {
        if (JSON.stringify(localStorage.getItem("wallet_address")) != null) {
            setUser(JSON.stringify(localStorage.getItem("wallet_address")));
        }
        fetchData();
    }, [tokens]);

    async function fetchData() {
        const response = await axios.get("https://api.covalenthq.com/v1/80001/tokens/0xF15c786e888828BdFe4416135753Dd68685fd87b/nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc");
        console.log(response.data.data.items.length)
        setTokens(response.data.data.items.length)
        for (let i = 1; i <= tokens; i++) {
            tokenID.push(i)
        }
        console.log(tokenID)
        const items = await Promise.all(
            tokenID.map(async (item) => {
                const res = await axios.get(`https://api.covalenthq.com/v1/80001/tokens/0xF15c786e888828BdFe4416135753Dd68685fd87b/nft_metadata/${item}/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc`);

                if (user === JSON.stringify(res.data.data.items[0].nft_data[0].original_owner)) {
                    console.log(res.data.data.items[0].nft_data[0].original_owner);

                    let item = {
                        id: res.data.data.items[0].nft_data[0].token_id,
                        name: res.data.data.items[0].nft_data[0].external_data.name,
                        image: res.data.data.items[0].nft_data[0].external_data.image
                    };
                    console.log(item);
                    return item;
                } else { return ''; }
            })
        );
        console.log(items);
        await setData(items);

    }
    console.log(data);



    //map data and display in table and filter null values
    const RowData = data.map((elem, index) => {
        if (elem != '') {
            return (
                <tr key={index} className="border">

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 border">{elem.id}</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border">
                        {elem.name}
                    </td>
                    <td className="text-sm text-gray-900 text-center font-light whitespace-nowrap border">
                        <a href={elem.image} target="blank"><img src={elem.image} alt={elem.name} /></a>
                    </td>
                    <td className="text-sm text-gray-900 text-center font-light px-6 py-4 whitespace-nowrap border">
                        <a href="https://mumbai.polygonscan.com/address/0xF15c786e888828BdFe4416135753Dd68685fd87b#tokentxnsErc721" target="blank" >
                            Link
                        </a>
                    </td>
                </tr>
            )
        }
    })

    return (
        <div className="col-12 w-max  bg-white">
            <h3>Wallet Address : {`0x...${user.slice(35, 43)}`}</h3>
            <ScrollAnimation animateIn="fadeInUp" delay={500} animateOnce={true} >
                <div className="container py-4  border-0 shadow-sm ">
                    <h1>Your Listings</h1>
                    <div className="card-body w-max  bg-slate-100">


                        <Tabs
                            id="dashboard-activity-tab"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="border-0 mb-3 ms-auto"
                        >
                            <Tab eventKey="today" title="">
                                <div className="table-responsive border shadow-sm dashboard-table activity-table">
                                    <table className="table mb-0 w-full">
                                        <tbody>

                                            {RowData}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab>


                        </Tabs>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    )
}

export default Activity;