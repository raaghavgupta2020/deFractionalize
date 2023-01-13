/* test/sample-test.js */
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const NFTContract = await ethers.getContractFactory("NFTContract");
    const NFTContract = await NFTContract.deploy();
    await NFTContract.deployed();

    let listingPrice = await NFTContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await NFTContract.createToken("https://www.mytokenlocation.com", auctionPrice, {
      value: listingPrice,
    });
    await NFTContract.createToken("https://www.mytokenlocation2.com", auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of token to another user */
    await NFTContract.connect(buyerAddress).createMarketSale(1, {
      value: auctionPrice,
    });

    /* resell a token */
    await NFTContract.connect(buyerAddress).resellToken(1, auctionPrice, {
      value: listingPrice,
    });

    /* query for and return the unsold items */
    items = await NFTContract.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await NFTContract.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
  it("Should create and execute Creator NFTs", async function () {
    /* deploy the marketplace */
    const NFTContract = await ethers.getContractFactory("CreatorNFT");
    const NFTContract = await NFTContract.deploy();
    await NFTContract.deployed();

    let listingPrice = await NFTContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await NFTContract.createToken("https://www.mytokenlocation.com", auctionPrice, {
      value: listingPrice,
    });
    await NFTContract.createToken("https://www.mytokenlocation2.com", auctionPrice, {
      value: listingPrice,
    });

    /* query for and return the unsold items */
    items = await NFTContract.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await NFTContract.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});