import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken Contract", function () {
  let MyToken: any;
  let myToken: any; // Use 'any' to avoid TypeScript complaints
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(ethers.parseUnits("1000", 18));
    await myToken.waitForDeployment();
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

  describe("Transfer Function", function () {
    it("Should transfer tokens correctly", async function () {
      await myToken.transfer(addr1.address, ethers.parseUnits("100", 18));
      expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
      expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("900", 18));
    });

    it("Should fail if balance is insufficient", async function () {
      await expect(
        myToken.transfer(addr1.address, ethers.parseUnits("1001", 18))
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should fail if transferring to zero address", async function () {
      await expect(
        myToken.transfer(ethers.ZeroAddress, ethers.parseUnits("100", 18))
      ).to.be.revertedWith("Cannot transfer to zero address");
    });
  });

  describe("Approve and TransferFrom Functions", function () {
    it("Should approve tokens correctly", async function () {
      await myToken.approve(addr1.address, ethers.parseUnits("100", 18));
      expect(await myToken.allowance(owner.address, addr1.address)).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should transferFrom tokens correctly", async function () {
      await myToken.approve(addr1.address, ethers.parseUnits("100", 18));
      await myToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("50", 18));
      expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseUnits("50", 18));
      expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("950", 18));
      expect(await myToken.allowance(owner.address, addr1.address)).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      await myToken.approve(addr1.address, ethers.parseUnits("50", 18));
      await expect(
        myToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("51", 18))
      ).to.be.revertedWith("Insufficient allowance");
    });
  });

  describe("Mint Function", function () {
    it("Should allow minter to mint tokens", async function () {
      await myToken.mint(addr1.address, ethers.parseUnits("500", 18));
      expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("500", 18));
      expect(await myToken.totalSupply()).to.equal(ethers.parseUnits("1500", 18));
    });

    it("Should fail if non-minter tries to mint", async function () {
      await expect(
        myToken.connect(addr1).mint(addr2.address, ethers.parseUnits("100", 18))
      ).to.be.revertedWith("Only minters can call this function");
    });

    it("Should fail if minting to zero address", async function () {
      await expect(
        myToken.mint(ethers.ZeroAddress, ethers.parseUnits("100", 18))
      ).to.be.revertedWith("Cannot mint to zero address");
    });
  });

  describe("Burn Function", function () {
    it("Should allow burning tokens", async function () {
      await myToken.burn(ethers.parseUnits("200", 18));
      expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("800", 18));
      expect(await myToken.totalSupply()).to.equal(ethers.parseUnits("800", 18));
    });

    it("Should fail if burning more than balance", async function () {
      await expect(
        myToken.burn(ethers.parseUnits("1001", 18))
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Minter Role Management", function () {
    it("Should allow owner to add a minter", async function () {
      await myToken.addMinter(addr1.address);
      expect(await myToken.isMinter(addr1.address)).to.be.true;
      await myToken.connect(addr1).mint(addr2.address, ethers.parseUnits("100", 18));
      expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should allow owner to remove a minter", async function () {
      await myToken.addMinter(addr1.address);
      await myToken.removeMinter(addr1.address);
      expect(await myToken.isMinter(addr1.address)).to.be.false;
      await expect(
        myToken.connect(addr1).mint(addr2.address, ethers.parseUnits("100", 18))
      ).to.be.revertedWith("Only minters can call this function");
    });

    it("Should fail if non-owner tries to add minter", async function () {
      await expect(
        myToken.connect(addr1).addMinter(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});