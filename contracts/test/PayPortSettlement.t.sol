// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PayPortSettlement} from "../src/PayPortSettlement.sol";

interface Vm {
    function prank(address sender) external;
    function expectRevert(bytes4 selector) external;
    function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData) external;
}

contract TestBase {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertTrue(bool value) internal pure {
        require(value, "assertTrue failed");
    }

    function assertFalse(bool value) internal pure {
        require(!value, "assertFalse failed");
    }

    function assertEq(address actual, address expected) internal pure {
        require(actual == expected, "address mismatch");
    }

    function assertEq(uint256 actual, uint256 expected) internal pure {
        require(actual == expected, "uint256 mismatch");
    }

    function assertEq(bytes32 actual, bytes32 expected) internal pure {
        require(actual == expected, "bytes32 mismatch");
    }

    function assertEq(string memory actual, string memory expected) internal pure {
        require(keccak256(bytes(actual)) == keccak256(bytes(expected)), "string mismatch");
    }
}

contract PayPortSettlementTest is TestBase {
    event RecorderUpdated(address indexed recorder, bool allowed);
    event InvoiceRegistered(
        bytes32 indexed invoiceKey,
        string invoiceId,
        address indexed merchant,
        uint256 amountUsdCents
    );
    event SettlementRecorded(
        bytes32 indexed invoiceKey,
        string invoiceId,
        address indexed buyer,
        address indexed merchant,
        uint256 amountUsdCents,
        bytes32 particleTxRef,
        string particleTransactionId
    );
    event ProductUnlocked(bytes32 indexed invoiceKey, string invoiceId, address indexed buyer);

    PayPortSettlement internal settlement;

    address internal owner = address(0xA11CE);
    address internal recorder = address(0xB0B);
    address internal merchant = address(0xC0FFEE);
    address internal buyer = address(0xBEEF);

    string internal invoiceId = "demo-invoice-001";
    uint256 internal amountUsdCents = 10;
    bytes32 internal particleTxRef = keccak256("particle-tx-001");
    string internal particleTransactionId = "particle-mainnet-tx-001";

    function setUp() public {
        settlement = new PayPortSettlement(owner);
    }

    function testConstructorSetsOwnerCorrectly() public {
        assertEq(settlement.owner(), owner);
        assertTrue(settlement.recorders(owner));
    }

    function testOwnerCanAddRecorder() public {
        vm.prank(owner);
        vm.expectEmit(true, false, false, true);
        emit RecorderUpdated(recorder, true);
        settlement.setRecorder(recorder, true);

        assertTrue(settlement.recorders(recorder));
    }

    function testNonOwnerCannotAddRecorder() public {
        vm.prank(recorder);
        vm.expectRevert(PayPortSettlement.Unauthorized.selector);
        settlement.setRecorder(recorder, true);
    }

    function testRecorderCanRegisterInvoice() public {
        _addRecorder();

        vm.prank(recorder);
        settlement.registerInvoice(invoiceId, merchant, amountUsdCents);

        PayPortSettlement.InvoiceRecord memory invoice = settlement.getInvoice(invoiceId);
        assertEq(invoice.invoiceId, invoiceId);
        assertEq(invoice.merchant, merchant);
        assertEq(invoice.amountUsdCents, amountUsdCents);
        assertTrue(invoice.registered);
        assertTrue(invoice.createdAt > 0);
    }

    function testNonRecorderCannotRegisterInvoice() public {
        vm.prank(recorder);
        vm.expectRevert(PayPortSettlement.Unauthorized.selector);
        settlement.registerInvoice(invoiceId, merchant, amountUsdCents);
    }

    function testEmptyInvoiceIdReverts() public {
        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvalidInvoiceId.selector);
        settlement.registerInvoice("", merchant, amountUsdCents);
    }

    function testZeroMerchantReverts() public {
        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvalidMerchant.selector);
        settlement.registerInvoice(invoiceId, address(0), amountUsdCents);
    }

    function testZeroAmountReverts() public {
        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvalidAmount.selector);
        settlement.registerInvoice(invoiceId, merchant, 0);
    }

    function testDuplicateInvoiceRegistrationReverts() public {
        _registerInvoice();

        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvoiceAlreadyRegistered.selector);
        settlement.registerInvoice(invoiceId, merchant, amountUsdCents);
    }

    function testRecorderCanRecordSettlementForRegisteredInvoice() public {
        _addRecorder();
        _registerInvoiceAs(recorder);

        vm.prank(recorder);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);

        PayPortSettlement.SettlementRecord memory record = settlement.getSettlement(invoiceId);
        assertEq(record.invoiceId, invoiceId);
        assertEq(record.buyer, buyer);
        assertEq(record.merchant, merchant);
        assertEq(record.amountUsdCents, amountUsdCents);
        assertEq(record.particleTxRef, particleTxRef);
        assertEq(record.particleTransactionId, particleTransactionId);
        assertTrue(record.settled);
        assertTrue(record.settledAt > 0);
    }

    function testNonRecorderCannotRecordSettlement() public {
        _registerInvoice();

        vm.prank(recorder);
        vm.expectRevert(PayPortSettlement.Unauthorized.selector);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);
    }

    function testSettlementForUnknownInvoiceReverts() public {
        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvoiceNotRegistered.selector);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);
    }

    function testZeroBuyerReverts() public {
        _registerInvoice();

        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.InvalidBuyer.selector);
        settlement.recordSettlement(invoiceId, address(0), particleTxRef, particleTransactionId);
    }

    function testDuplicateSettlementReverts() public {
        _registerInvoice();
        _recordSettlement();

        vm.prank(owner);
        vm.expectRevert(PayPortSettlement.SettlementAlreadyRecorded.selector);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);
    }

    function testIsInvoiceSettledReturnsFalseBeforeAndTrueAfterSettlement() public {
        _registerInvoice();
        assertFalse(settlement.isInvoiceSettled(invoiceId));

        _recordSettlement();
        assertTrue(settlement.isInvoiceSettled(invoiceId));
    }

    function testGetInvoiceReturnsCorrectData() public {
        _registerInvoice();

        PayPortSettlement.InvoiceRecord memory invoice = settlement.getInvoice(invoiceId);
        assertEq(invoice.invoiceId, invoiceId);
        assertEq(invoice.merchant, merchant);
        assertEq(invoice.amountUsdCents, amountUsdCents);
        assertTrue(invoice.registered);
    }

    function testGetSettlementReturnsCorrectData() public {
        _registerInvoice();
        _recordSettlement();

        PayPortSettlement.SettlementRecord memory record = settlement.getSettlement(invoiceId);
        assertEq(record.invoiceId, invoiceId);
        assertEq(record.buyer, buyer);
        assertEq(record.merchant, merchant);
        assertEq(record.amountUsdCents, amountUsdCents);
        assertEq(record.particleTxRef, particleTxRef);
        assertEq(record.particleTransactionId, particleTransactionId);
        assertTrue(record.settled);
    }

    function testInvoiceRegisteredEventFieldsAreCorrect() public {
        bytes32 invoiceKey = settlement.invoiceKeyOf(invoiceId);

        vm.prank(owner);
        vm.expectEmit(true, true, false, true);
        emit InvoiceRegistered(invoiceKey, invoiceId, merchant, amountUsdCents);
        settlement.registerInvoice(invoiceId, merchant, amountUsdCents);
    }

    function testSettlementAndUnlockEventsAreCorrect() public {
        _registerInvoice();
        bytes32 invoiceKey = settlement.invoiceKeyOf(invoiceId);

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit SettlementRecorded(
            invoiceKey,
            invoiceId,
            buyer,
            merchant,
            amountUsdCents,
            particleTxRef,
            particleTransactionId
        );
        vm.expectEmit(true, false, true, true);
        emit ProductUnlocked(invoiceKey, invoiceId, buyer);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);
    }

    function _addRecorder() internal {
        vm.prank(owner);
        settlement.setRecorder(recorder, true);
    }

    function _registerInvoice() internal {
        _registerInvoiceAs(owner);
    }

    function _registerInvoiceAs(address sender) internal {
        vm.prank(sender);
        settlement.registerInvoice(invoiceId, merchant, amountUsdCents);
    }

    function _recordSettlement() internal {
        vm.prank(owner);
        settlement.recordSettlement(invoiceId, buyer, particleTxRef, particleTransactionId);
    }
}
