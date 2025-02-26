import { expect } from "chai";
import { ethers } from "hardhat"; // Use Hardhat's ethers
import { Contract } from "ethers";

describe("MyToken Contract", function () {
  let MyToken: any;
  let myToken: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MyToken = await ethers.getContractFactory("MyToken");
    // Use ethers from hardhat directly
    myToken = await MyToken.deploy(ethers.parseUnits("1000", 18)); // Changed from ethers.utils.parseUnits
    await myToken.waitForDeployment(); // Updated for ethers v6 compatibility
  });

  describe("Deployment", function () {
    it("Should set the correct initial supply", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(await myToken.totalSupply()).to.equal(ownerBalance);
      expect(await myToken.totalSupply()).to.equal(ethers.parseUnits("1000", 18));
    });

    it("Should set the owner correctly", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should set the deployer as a minter", async function () {
      expect(await myToken.isMinter(owner.address)).to.be.true;
    });
  });

 
});