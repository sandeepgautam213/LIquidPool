// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  //"0x2A565fa20CB8e932D5355e31b7aCe7916F684207"
  // const signer = await hre.ethers.getSigners();
  const liquidity = await hre.ethers.deployContract("TokenSwap",
    ["0xd31F679a3041B9dE4ca1966d78623ED8f0722Dbf","0x96A1B7c8fd02cbf46b21Fb2CfB179ed92187A4A1"]
  );

  await liquidity.waitForDeployment();
  console.log("Liquidity contract deployed at address: ", await liquidity.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0