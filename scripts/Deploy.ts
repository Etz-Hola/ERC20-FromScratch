import { ethers } from "hardhat";

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("-------");

  // Deploy the contract
  console.log("Deploying MyToken with 1000 tokens...");
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken: any = await MyToken.deploy(ethers.parseUnits("1000", 18));
  await myToken.waitForDeployment();
  const contractAddress = await myToken.getAddress();
  console.log("MyToken deployed to:", contractAddress);
  console.log("Initial supply:", ethers.formatUnits(await myToken.totalSupply(), 18), "MTK");
  console.log("Deployer balance:", ethers.formatUnits(await myToken.balanceOf(deployer.address), 18), "MTK");
  console.log("-------");

  // Transfer tokens
  console.log("Transferring 100 tokens to addr1...");
  await myToken.transfer(addr1.address, ethers.parseUnits("100", 18));
  console.log("Deployer balance:", ethers.formatUnits(await myToken.balanceOf(deployer.address), 18), "MTK");
  console.log("Addr1 balance:", ethers.formatUnits(await myToken.balanceOf(addr1.address), 18), "MTK");
  console.log("-------");

  // Approve and TransferFrom
  console.log("Approving addr1 to spend 50 tokens...");
  await myToken.approve(addr1.address, ethers.parseUnits("50", 18));
  console.log("Allowance (deployer -> addr1):", ethers.formatUnits(await myToken.allowance(deployer.address, addr1.address), 18), "MTK");
  console.log("Addr1 transferring 30 tokens from deployer to addr2...");
  await myToken.connect(addr1).transferFrom(deployer.address, addr2.address, ethers.parseUnits("30", 18));
  console.log("Deployer balance:", ethers.formatUnits(await myToken.balanceOf(deployer.address), 18), "MTK");
  console.log("Addr1 balance:", ethers.formatUnits(await myToken.balanceOf(addr1.address), 18), "MTK");
  console.log("Addr2 balance:", ethers.formatUnits(await myToken.balanceOf(addr2.address), 18), "MTK");
  console.log("Remaining allowance (deployer -> addr1):", ethers.formatUnits(await myToken.allowance(deployer.address, addr1.address), 18), "MTK");
  console.log("-------");

  // Mint tokens
  console.log("Minting 200 tokens to addr2...");
  await myToken.mint(addr2.address, ethers.parseUnits("200", 18));
  console.log("Total supply:", ethers.formatUnits(await myToken.totalSupply(), 18), "MTK");
  console.log("Addr2 balance:", ethers.formatUnits(await myToken.balanceOf(addr2.address), 18), "MTK");
  console.log("-------");

  // Burn tokens
  console.log("Burning 50 tokens from deployer...");
  await myToken.burn(ethers.parseUnits("50", 18));
  console.log("Total supply:", ethers.formatUnits(await myToken.totalSupply(), 18), "MTK");
  console.log("Deployer balance:", ethers.formatUnits(await myToken.balanceOf(deployer.address), 18), "MTK");
  console.log("-------");

  // Add and Remove Minter
  console.log("Adding addr1 as a minter...");
  await myToken.addMinter(addr1.address);
  console.log("Is addr1 a minter?", await myToken.isMinter(addr1.address));
  console.log("Addr1 minting 100 tokens to addr2...");
  await myToken.connect(addr1).mint(addr2.address, ethers.parseUnits("100", 18));
  console.log("Total supply:", ethers.formatUnits(await myToken.totalSupply(), 18), "MTK");
  console.log("Addr2 balance:", ethers.formatUnits(await myToken.balanceOf(addr2.address), 18), "MTK");
  console.log("Removing addr1 as a minter...");
  await myToken.removeMinter(addr1.address);
  console.log("Is addr1 a minter?", await myToken.isMinter(addr1.address));
  console.log("-------");

  console.log("All interactions complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });