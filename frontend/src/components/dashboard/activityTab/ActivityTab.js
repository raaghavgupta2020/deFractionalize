import { useState, useEffect } from "react";
import axios from "axios";


const ActivityTab = () => {
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
        const response = await axios.get("https://api.covalenthq.com/v1/80001/tokens/0xe6c5586d13ad0f33f438fa6A4002EA05A48994b5/nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc");
        console.log(response.data.data.items.length)
        setTokens(response.data.data.items.length)
        for (let i = 1; i <= tokens; i++) {
            tokenID.push(i)
        }
        console.log(tokenID)
        const items = await Promise.all(
            tokenID.map(async (item) => {
                const res = await axios.get(`https://api.covalenthq.com/v1/80001/tokens/0xe6c5586d13ad0f33f438fa6A4002EA05A48994b5/nft_metadata/${item}/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc`);

                if (user == JSON.stringify(res.data.data.items[0].nft_data[0].original_owner)) {
                    console.log(res.data.data.items[0].nft_data[0]);

                    let item = {
                        id: res.data.data.items[0].nft_data[0].token_id,
                        name: res.data.data.items[0].nft_data[0].external_data.name,
                        image: res.data.data.items[0].nft_data[0].external_data.image_512
                    };
                    //console.log(item);
                    return item;
                } else { return ''; }
            })
        );
        console.log(items);
        setData(items);

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
                    <td className="text-sm text-gray-900 text-center font-light px-6 py-4 whitespace-nowrap border">
                        <img src={elem.image} alt={elem.name} />
                    </td>
                    <td className="text-sm text-gray-900 text-center font-light px-6 py-4 whitespace-nowrap border">
                        <a href="https://mumbai.polygonscan.com/address/0xe6c5586d13ad0f33f438fa6a4002ea05a48994b5#tokentxnsErc721" target="blank" >
                            Link
                        </a>
                    </td>
                </tr>
            )
        }
    })


    // const RowData = data.map((elem, index) => (
    //     if (elem != '') {
    //     return (
    //         <tr key={index} className="border">

    //             <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 border">{elem.id}</td>
    //             <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap border">
    //                 {elem.name}
    //             </td>
    //             <td className="text-sm text-gray-900 text-center font-light px-6 py-4 whitespace-nowrap border">
    //                 <img src={elem.image} alt={elem.name} />
    //             </td>
    //             <td className="text-sm text-gray-900 text-center font-light px-6 py-4 whitespace-nowrap border">
    //                 <a href="https://mumbai.polygonscan.com/address/0xe6c5586d13ad0f33f438fa6a4002ea05a48994b5#tokentxnsErc721" target="blank" >
    //                     Link
    //                 </a>
    //             </td>
    //         </tr>
    //     )
    // }
    // ))
    return (
        <div className="col-12 ">
            <h3>Wallet Address : {`0x...${user.slice(35, 43)}`}</h3>
            <div className="flex flex-col bg-white">
                <div className=" sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="w-full p-5">
                                <thead className="border-b">
                                    <tr>
                                        <th scope="col" className="text-sm font-medium text-center text-gray-900 px-6 py-4 border">
                                            Token No.
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-center text-gray-900 px-6 py-4 border">
                                            NFT Name
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-center text-gray-900 px-6 py-4 border">
                                            NFT Image
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-center text-gray-900 px-6 py-4 border">
                                            Contract Link
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RowData}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityTab;