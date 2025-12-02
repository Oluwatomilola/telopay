// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Telopay
 * @dev A micro-payment contract that allows users to pay small amounts of crypto (ETH or USDC)
 * on the Base network for access to actions or content.
 * @author Telopay Team
 */
contract Telopay is Ownable, ReentrancyGuard, Pausable {
    // USDC token address on Base mainnet
    IERC20 public immutable usdcToken;

    // Minimum payment amounts to prevent spam
    uint256 public constant MIN_ETH_PAYMENT = 0.0001 ether; // 0.1 mETH
    uint256 public constant MIN_USDC_PAYMENT = 1000000; // 1 USDC (6 decimals)

    // Maximum payment limits
    uint256 public constant MAX_ETH_PAYMENT = 10 ether;
    uint256 public constant MAX_USDC_PAYMENT = 1000000000000000; // 1M USDC

    // Events
    event PaymentReceived(
        address indexed payer,
        uint256 amount,
        bool isEth,
        bytes32 indexed paymentId,
        uint256 timestamp
    );

    event Withdrawal(
        address indexed owner,
        uint256 ethAmount,
        uint256 usdcAmount,
        uint256 timestamp
    );

    event EmergencyWithdrawal(
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    // Payment tracking
    mapping(bytes32 => Payment) public payments;

    struct Payment {
        address payer;
        uint256 amount;
        bool isEth;
        uint256 timestamp;
        bool processed;
    }

    // Modifiers
    modifier validETHAmount(uint256 amount) {
        require(amount >= MIN_ETH_PAYMENT, "ETH amount too small");
        require(amount <= MAX_ETH_PAYMENT, "ETH amount too large");
        _;
    }

    modifier validUSDCAmount(uint256 amount) {
        require(amount >= MIN_USDC_PAYMENT, "USDC amount too small");
        require(amount <= MAX_USDC_PAYMENT, "USDC amount too large");
        _;
    }

    constructor(address _usdcToken) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Pay ETH for services/content
     */
    function payETH()
        external
        payable
        nonReentrant
        whenNotPaused
        validETHAmount(msg.value)
    {
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                msg.value,
                block.timestamp,
                block.chainid
            )
        );

        payments[paymentId] = Payment({
            payer: msg.sender,
            amount: msg.value,
            isEth: true,
            timestamp: block.timestamp,
            processed: true
        });

        emit PaymentReceived(
            msg.sender,
            msg.value,
            true,
            paymentId,
            block.timestamp
        );
    }

    /**
     * @dev Pay USDC for services/content
     * @param amount Amount of USDC to pay (in wei, 6 decimals)
     */
    function payUSDC(
        uint256 amount
    ) external nonReentrant whenNotPaused validUSDCAmount(amount) {
        // Validate amount is not zero
        require(amount > 0, "Amount must be greater than zero");

        // Check sender has sufficient allowance
        uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");

        // Check sender has sufficient balance
        uint256 balance = usdcToken.balanceOf(msg.sender);
        require(balance >= amount, "Insufficient balance");

        // Transfer USDC from sender to contract with safe transfer
        bool success = usdcToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "USDC transfer failed");

        bytes32 paymentId = keccak256(
            abi.encodePacked(msg.sender, amount, block.timestamp, block.chainid)
        );

        payments[paymentId] = Payment({
            payer: msg.sender,
            amount: amount,
            isEth: false,
            timestamp: block.timestamp,
            processed: true
        });

        emit PaymentReceived(
            msg.sender,
            amount,
            false,
            paymentId,
            block.timestamp
        );
    }

    /**
     * @dev Withdraw all ETH and USDC accumulated in the contract
     * Only callable by the owner
     */
    function withdrawAll() external onlyOwner nonReentrant {
        uint256 ethBalance = address(this).balance;
        uint256 usdcBalance = usdcToken.balanceOf(address(this));

        require(ethBalance > 0 || usdcBalance > 0, "No funds to withdraw");

        // Withdraw ETH
        if (ethBalance > 0) {
            (bool ethSuccess, ) = payable(owner()).call{value: ethBalance}("");
            require(ethSuccess, "ETH withdrawal failed");
        }

        // Withdraw USDC
        if (usdcBalance > 0) {
            bool usdcSuccess = usdcToken.transfer(owner(), usdcBalance);
            require(usdcSuccess, "USDC withdrawal failed");
        }

        emit Withdrawal(owner(), ethBalance, usdcBalance, block.timestamp);
    }

    /**
     * @dev Withdraw specific amounts
     * @param ethAmount Amount of ETH to withdraw
     * @param usdcAmount Amount of USDC to withdraw
     */
    function withdraw(
        uint256 ethAmount,
        uint256 usdcAmount
    ) external onlyOwner nonReentrant {
        require(ethAmount <= address(this).balance, "Insufficient ETH balance");
        require(
            usdcAmount <= usdcToken.balanceOf(address(this)),
            "Insufficient USDC balance"
        );

        if (ethAmount > 0) {
            (bool ethSuccess, ) = payable(owner()).call{value: ethAmount}("");
            require(ethSuccess, "ETH withdrawal failed");
        }

        if (usdcAmount > 0) {
            bool usdcSuccess = usdcToken.transfer(owner(), usdcAmount);
            require(usdcSuccess, "USDC withdrawal failed");
        }

        emit Withdrawal(owner(), ethAmount, usdcAmount, block.timestamp);
    }

    /**
     * @dev Get contract balance
     * @return ethBalance Current ETH balance
     * @return usdcBalance Current USDC balance
     */
    function getBalance()
        external
        view
        returns (uint256 ethBalance, uint256 usdcBalance)
    {
        return (address(this).balance, usdcToken.balanceOf(address(this)));
    }

    /**
     * @dev Get payment details
     * @param paymentId ID of the payment to query
     * @return Payment struct containing payment details
     */
    function getPayment(
        bytes32 paymentId
    ) external view returns (Payment memory) {
        return payments[paymentId];
    }

    /**
     * @dev Emergency function to pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Emergency function to unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal function for stuck tokens
     * Only callable by owner and only for non-ETH, non-USDC tokens
     * @param token Token address to withdraw
     */
    function emergencyWithdrawToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(token != address(usdcToken), "Use withdraw function for USDC");

        IERC20 erc20 = IERC20(token);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");

        bool success = erc20.transfer(owner(), balance);
        require(success, "Token withdrawal failed");

        emit EmergencyWithdrawal(token, balance, block.timestamp);
    }

    /**
     * @dev Receive ETH payments
     */
    receive() external payable {
        // Reject direct ETH payments without proper function call
        revert("Use payETH() function for payments");
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Invalid function call");
    }
}
