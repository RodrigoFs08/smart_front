// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RealDigital is ERC20 {
    address public admin;
    uint256 public constant MAX_SUPPLY = 10000 * (10 ** 18); // 10000 tokens with 18 decimals
    uint256 public constant CLAIM_AMOUNT = 1000 * (10 ** 18); // 1000 tokens with 18 decimals

    // Mapping to track addresses that have already claimed their tokens
    mapping(address => bool) private _hasClaimed;

    constructor() ERC20("Real Digital", "BRLD") {
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }

    // New claim function
    function claim() external {
        require(!_hasClaimed[msg.sender], "Tokens have already been claimed");
        require(totalSupply() + CLAIM_AMOUNT <= MAX_SUPPLY, "Max supply exceeded");
        
        _mint(msg.sender, CLAIM_AMOUNT);
        _hasClaimed[msg.sender] = true;
    }

    // Function to check if a given address has claimed tokens
    function hasClaimed(address account) external view returns (bool) {
        return _hasClaimed[account];
    }
}
