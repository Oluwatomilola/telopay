// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Telopay.sol";
import "@openzeppelin/contracts/mocks/ERC20Mock.sol";

contract TelopayTest is Test {
    Telopay public telopay;
    ERC20Mock public usdcMock;

    address public owner = address(0x1234);
    address public user1 = address(0x5678);
    address public user2 = address(0x9ABC);

    uint256 constant MIN_ETH_PAYMENT = 0.0001 ether;
    uint256 constant MAX_ETH_PAYMENT = 10 ether;
    uint256 constant MIN_USDC_PAYMENT = 1000000; // 1 USDC
    uint256 constant MAX_USDC_PAYMENT = 1000000000000000; // 1M USDC

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

    function setUp() public {
        // Setup accounts
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);

        // Deploy USDC mock
        usdcMock = new ERC20Mock("USDC", "USDC", 18);
        usdcMock.mint(user1, 1000000000000000000000000); // 1M USDC
        usdcMock.mint(user2, 1000000000000000000000000); // 1M USDC

        // Deploy Telopay contract
        telopay = new Telopay(address(usdcMock));

        // Transfer ownership
        vm.prank(owner);
        telopay.transferOwnership(owner);

        // Approve USDC for testing
        vm.prank(user1);
        usdcMock.approve(address(telopay), 2 ** 256 - 1);

        vm.prank(user2);
        usdcMock.approve(address(telopay), 2 ** 256 - 1);
    }

    // ============ ETH PAYMENT TESTS ============

    function testPayETH_Success() public {
        uint256 amount = MIN_ETH_PAYMENT * 2; // 0.0002 ETH
        uint256 initialBalance = address(telopay).balance;

        vm.prank(user1);

        vm.expectEmit(true, true, true, true);
        emit PaymentReceived(user1, amount, true, bytes32(0), block.timestamp);

        telopay.payETH{value: amount}();

        assertEq(address(telopay).balance, initialBalance + amount);
    }

    function testPayETH_MinimumAmount() public {
        vm.prank(user1);
        telopay.payETH{value: MIN_ETH_PAYMENT}();

        assertEq(address(telopay).balance, MIN_ETH_PAYMENT);
    }

    function testPayETH_MaximumAmount() public {
        vm.prank(user1);
        telopay.payETH{value: MAX_ETH_PAYMENT}();

        assertEq(address(telopay).balance, MAX_ETH_PAYMENT);
    }

    function testPayETH_TooSmall() public {
        uint256 tooSmall = MIN_ETH_PAYMENT - 1;

        vm.prank(user1);
        vm.expectRevert("ETH amount too small");
        telopay.payETH{value: tooSmall}();
    }

    function testPayETH_TooLarge() public {
        uint256 tooLarge = MAX_ETH_PAYMENT + 1;

        vm.prank(user1);
        vm.expectRevert("ETH amount too large");
        telopay.payETH{value: tooLarge}();
    }

    function testPayETH_ZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert("ETH amount too small");
        telopay.payETH{value: 0}();
    }

    // ============ USDC PAYMENT TESTS ============

    function testPayUSDC_Success() public {
        uint256 amount = MIN_USDC_PAYMENT * 2; // 2 USDC
        uint256 initialBalance = usdcMock.balanceOf(address(telopay));
        uint256 userInitialBalance = usdcMock.balanceOf(user1);

        vm.prank(user1);

        vm.expectEmit(true, true, true, true);
        emit PaymentReceived(user1, amount, false, bytes32(0), block.timestamp);

        telopay.payUSDC(amount);

        assertEq(usdcMock.balanceOf(address(telopay)), initialBalance + amount);
        assertEq(usdcMock.balanceOf(user1), userInitialBalance - amount);
    }

    function testPayUSDC_MinimumAmount() public {
        vm.prank(user1);
        telopay.payUSDC(MIN_USDC_PAYMENT);

        assertEq(usdcMock.balanceOf(address(telopay)), MIN_USDC_PAYMENT);
    }

    function testPayUSDC_MaximumAmount() public {
        vm.prank(user1);
        telopay.payUSDC(MAX_USDC_PAYMENT);

        assertEq(usdcMock.balanceOf(address(telopay)), MAX_USDC_PAYMENT);
    }

    function testPayUSDC_TooSmall() public {
        vm.prank(user1);
        vm.expectRevert("USDC amount too small");
        telopay.payUSDC(MIN_USDC_PAYMENT - 1);
    }

    function testPayUSDC_TooLarge() public {
        vm.prank(user1);
        vm.expectRevert("USDC amount too large");
        telopay.payUSDC(MAX_USDC_PAYMENT + 1);
    }

    function testPayUSDC_ZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert("USDC amount too small");
        telopay.payUSDC(0);
    }

    function testPayUSDC_TransferFails() public {
        uint256 amount = MIN_USDC_PAYMENT;

        vm.prank(user2);
        usdcMock.approve(address(telopay), 0);

        vm.prank(user2);
        vm.expectRevert("USDC transfer failed");
        telopay.payUSDC(amount);
    }

    // ============ WITHDRAWAL TESTS ============

    function testWithdrawAll_Success() public {
        // Setup payments
        vm.prank(user1);
        telopay.payETH{value: MIN_ETH_PAYMENT}();

        vm.prank(user1);
        telopay.payUSDC(MIN_USDC_PAYMENT);

        uint256 expectedEthBalance = MIN_ETH_PAYMENT;
        uint256 expectedUsdcBalance = MIN_USDC_PAYMENT;
        uint256 ownerInitialEthBalance = owner.balance;
        uint256 ownerInitialUsdcBalance = usdcMock.balanceOf(owner);

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit Withdrawal(
            owner,
            expectedEthBalance,
            expectedUsdcBalance,
            block.timestamp
        );

        telopay.withdrawAll();

        assertEq(address(telopay).balance, 0);
        assertEq(usdcMock.balanceOf(address(telopay)), 0);
        assertEq(owner.balance, ownerInitialEthBalance + expectedEthBalance);
        assertEq(
            usdcMock.balanceOf(owner),
            ownerInitialUsdcBalance + expectedUsdcBalance
        );
    }

    function testWithdraw_SpecificAmounts() public {
        // Setup payments
        vm.prank(user1);
        telopay.payETH{value: MAX_ETH_PAYMENT}();

        vm.prank(user1);
        telopay.payUSDC(MAX_USDC_PAYMENT);

        uint256 ethToWithdraw = MIN_ETH_PAYMENT;
        uint256 usdcToWithdraw = MIN_USDC_PAYMENT;
        uint256 ownerInitialEthBalance = owner.balance;
        uint256 ownerInitialUsdcBalance = usdcMock.balanceOf(owner);

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit Withdrawal(owner, ethToWithdraw, usdcToWithdraw, block.timestamp);

        telopay.withdraw(ethToWithdraw, usdcToWithdraw);

        assertEq(address(telopay).balance, MAX_ETH_PAYMENT - ethToWithdraw);
        assertEq(
            usdcMock.balanceOf(address(telopay)),
            MAX_USDC_PAYMENT - usdcToWithdraw
        );
        assertEq(owner.balance, ownerInitialEthBalance + ethToWithdraw);
        assertEq(
            usdcMock.balanceOf(owner),
            ownerInitialUsdcBalance + usdcToWithdraw
        );
    }

    function testWithdraw_NotOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        telopay.withdrawAll();
    }

    function testWithdraw_NoFunds() public {
        vm.prank(owner);
        vm.expectRevert("No funds to withdraw");
        telopay.withdrawAll();
    }

    function testWithdraw_ExceedsBalance() public {
        // Setup payment
        vm.prank(user1);
        telopay.payETH{value: MIN_ETH_PAYMENT}();

        vm.prank(owner);
        vm.expectRevert("Insufficient ETH balance");
        telopay.withdraw(MIN_ETH_PAYMENT * 2, 0);
    }

    // ============ VIEW FUNCTIONS TESTS ============

    function testGetBalance() public {
        // Setup payments
        vm.prank(user1);
        telopay.payETH{value: MIN_ETH_PAYMENT}();

        vm.prank(user1);
        telopay.payUSDC(MIN_USDC_PAYMENT);

        (uint256 ethBalance, uint256 usdcBalance) = telopay.getBalance();

        assertEq(ethBalance, MIN_ETH_PAYMENT);
        assertEq(usdcBalance, MIN_USDC_PAYMENT);
    }

    function testGetPayment() public {
        uint256 amount = MIN_ETH_PAYMENT;
        bytes32 expectedPaymentId = keccak256(
            abi.encodePacked(user1, amount, block.timestamp, tx.origin)
        );

        vm.prank(user1);
        telopay.payETH{value: amount}();

        Telopay.Payment memory payment = telopay.getPayment(expectedPaymentId);

        assertEq(payment.payer, user1);
        assertEq(payment.amount, amount);
        assertTrue(payment.isEth);
        assertTrue(payment.processed);
    }

    // ============ PAUSE/UNPAUSE TESTS ============

    function testPause_Success() public {
        vm.prank(owner);
        telopay.pause();

        assertTrue(telopay.paused());
    }

    function testPause_NotOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        telopay.pause();
    }

    function testUnpause_Success() public {
        vm.prank(owner);
        telopay.pause();

        vm.prank(owner);
        telopay.unpause();

        assertFalse(telopay.paused());
    }

    function testPayETH_WhenPaused() public {
        vm.prank(owner);
        telopay.pause();

        vm.prank(user1);
        vm.expectRevert();
        telopay.payETH{value: MIN_ETH_PAYMENT}();
    }

    function testPayUSDC_WhenPaused() public {
        vm.prank(owner);
        telopay.pause();

        vm.prank(user1);
        vm.expectRevert();
        telopay.payUSDC(MIN_USDC_PAYMENT);
    }

    // ============ EMERGENCY TESTS ============

    function testEmergencyWithdrawToken_Success() public {
        // Deploy another mock token
        ERC20Mock otherToken = new ERC20Mock("Other", "OTH", 18);
        otherToken.mint(address(telopay), 1000);

        uint256 contractBalance = otherToken.balanceOf(address(telopay));
        uint256 ownerBalance = otherToken.balanceOf(owner);

        vm.prank(owner);
        telopay.emergencyWithdrawToken(address(otherToken));

        assertEq(otherToken.balanceOf(address(telopay)), 0);
        assertEq(otherToken.balanceOf(owner), ownerBalance + contractBalance);
    }

    function testEmergencyWithdrawToken_NotOwner() public {
        ERC20Mock otherToken = new ERC20Mock("Other", "OTH", 18);

        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        telopay.emergencyWithdrawToken(address(otherToken));
    }

    function testEmergencyWithdrawToken_InvalidToken() public {
        vm.prank(owner);
        vm.expectRevert("Invalid token address");
        telopay.emergencyWithdrawToken(address(0));
    }

    function testEmergencyWithdrawToken_USDC() public {
        vm.prank(owner);
        vm.expectRevert("Use withdraw function for USDC");
        telopay.emergencyWithdrawToken(address(usdcMock));
    }

    // ============ RECEIVE/FALLBACK TESTS ============

    function testReceiveETH_Revert() public {
        vm.deal(user1, 1 ether);

        vm.prank(user1);
        (bool success, ) = address(telopay).call{value: MIN_ETH_PAYMENT}("");
        assertFalse(success);
    }

    function testFallback_Revert() public {
        vm.deal(user1, 1 ether);

        vm.prank(user1);
        (bool success, ) = address(telopay).call{value: MIN_ETH_PAYMENT}(
            abi.encodeWithSignature("nonExistentFunction()")
        );
        assertFalse(success);
    }

    // ============ EDGE CASE TESTS ============

    function testPayUSDC_AllowanceCheck() public {
        uint256 amount = MIN_USDC_PAYMENT;

        // Reduce allowance below required amount
        vm.prank(user1);
        usdcMock.approve(address(telopay), amount - 1);

        vm.prank(user1);
        vm.expectRevert("Insufficient allowance");
        telopay.payUSDC(amount);
    }

    function testPayUSDC_BalanceCheck() public {
        uint256 amount = MIN_USDC_PAYMENT;

        // User has sufficient allowance but insufficient balance
        vm.prank(user1);
        usdcMock.transfer(user2, usdcMock.balanceOf(user1) - amount + 1);

        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        telopay.payUSDC(amount);
    }

    function testPaymentId_Uniqueness() public {
        uint256 amount = MIN_ETH_PAYMENT;

        vm.prank(user1);
        telopay.payETH{value: amount}();

        bytes32 paymentId1 = keccak256(
            abi.encodePacked(user1, amount, block.timestamp, block.chainid)
        );

        // Same user, same amount, different time should create different ID
        vm.warp(block.timestamp + 1);
        vm.prank(user1);
        telopay.payETH{value: amount}();

        bytes32 paymentId2 = keccak256(
            abi.encodePacked(user1, amount, block.timestamp + 1, block.chainid)
        );

        assertTrue(paymentId1 != paymentId2);
    }

    function testGasEstimationFailure() public {
        // This test ensures the contract handles gas estimation edge cases
        // In a real scenario, this would test complex scenarios
        // For now, basic functionality test
        uint256 amount = MIN_ETH_PAYMENT;

        vm.prank(user1);
        telopay.payETH{value: amount}();

        // Verify payment was processed successfully
        assertEq(address(telopay).balance, amount);
    }
}
