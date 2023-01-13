const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTContract = await hre.ethers.getContractFactory("NFTContract");
  const nftContract = await NFTContract.deploy();
  await nftContract.deployed();

  console.log("NFTContract deployed to:", nftContract.address);


  fs.writeFileSync(
    "./config.js",
    `export const nftAddress = "${nftContract.address}";`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });