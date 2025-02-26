# MyToken (Hola Token - HTK)

## Overview
MyToken (HTK) is an ERC-20-like token implemented in Solidity. It includes functionalities for minting, burning, and transferring tokens, along with minter role management.

## Features
- **Token Transfers:** Send and receive tokens between addresses.
- **Approval & Allowance:** Approve other addresses to spend tokens on behalf of the owner.
- **Minting:** Authorized minters can create new tokens.
- **Burning:** Token holders can destroy tokens, reducing total supply.
- **Minter Management:** The owner can add or remove minters.

## Contract Details
- **Token Name:** Hola Token
- **Symbol:** HTK
- **Decimals:** 18
- **Initial Supply:** Defined at contract deployment.
- **Owner:** The deployer of the contract.
- **Minters:** Special addresses authorized to mint new tokens.

## Functions
### Transfers
- `transfer(address to, uint256 amount)`: Transfers tokens to another address.
- `approve(address spender, uint256 amount)`: Approves another address to spend tokens.
- `transferFrom(address from, address to, uint256 amount)`: Transfers tokens on behalf of another address.

### Minting & Burning
- `mint(address to, uint256 amount)`: Creates new tokens and assigns them to an address (only minters can call).
- `burn(uint256 amount)`: Destroys tokens from the caller's balance.

### Minter Management
- `addMinter(address minter)`: Allows the owner to add a new minter.
- `removeMinter(address minter)`: Allows the owner to remove a minter.

## Events
- `Transfer(address indexed from, address indexed to, uint256 value)`: Emitted on successful token transfer.
- `Approval(address indexed owner, address indexed spender, uint256 value)`: Emitted when an approval is set.
- `Mint(address indexed to, uint256 amount)`: Emitted when tokens are minted.
- `Burn(address indexed from, uint256 amount)`: Emitted when tokens are burned.
- `MinterAdded(address indexed minter)`: Emitted when a new minter is added.
- `MinterRemoved(address indexed minter)`: Emitted when a minter is removed.

## Deployment
Deploy `MyToken` with an initial supply:
```solidity
constructor(uint256 initialSupply)
```
- The deployer becomes the contract owner and an initial minter.
- The initial supply is assigned to the deployer's address.

## Security Considerations
- Only the owner can manage minters.
- Minters should be trusted entities to prevent excessive inflation.
- Transfers to and from zero addresses are prohibited.
- Allowances must be carefully managed to prevent unintended spending.

