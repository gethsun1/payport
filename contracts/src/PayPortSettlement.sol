// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title PayPortSettlement
/// @notice Onchain evidence layer for PayPort invoice settlement records.
/// @dev This contract does not custody funds. It records proof metadata after app-side payment confirmation.
contract PayPortSettlement {
    struct InvoiceRecord {
        string invoiceId;
        address merchant;
        uint256 amountUsdCents;
        bool registered;
        uint256 createdAt;
    }

    struct SettlementRecord {
        string invoiceId;
        address buyer;
        address merchant;
        uint256 amountUsdCents;
        bytes32 particleTxRef;
        string particleTransactionId;
        bool settled;
        uint256 settledAt;
    }

    error Unauthorized();
    error InvalidOwner();
    error InvalidRecorder();
    error InvalidInvoiceId();
    error InvalidMerchant();
    error InvalidBuyer();
    error InvalidAmount();
    error InvoiceAlreadyRegistered();
    error InvoiceNotRegistered();
    error SettlementAlreadyRecorded();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
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

    address public owner;

    mapping(address recorder => bool allowed) public recorders;
    mapping(bytes32 invoiceKey => InvoiceRecord invoice) private invoices;
    mapping(bytes32 invoiceKey => SettlementRecord settlement) private settlements;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyRecorder() {
        if (!recorders[msg.sender]) revert Unauthorized();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert InvalidOwner();

        owner = initialOwner;
        recorders[initialOwner] = true;

        emit OwnershipTransferred(address(0), initialOwner);
        emit RecorderUpdated(initialOwner, true);
    }

    function setRecorder(address recorder, bool allowed) external onlyOwner {
        if (recorder == address(0)) revert InvalidRecorder();

        recorders[recorder] = allowed;
        emit RecorderUpdated(recorder, allowed);
    }

    function registerInvoice(
        string calldata invoiceId,
        address merchant,
        uint256 amountUsdCents
    ) external onlyRecorder {
        bytes32 invoiceKey = invoiceKeyOf(invoiceId);
        if (merchant == address(0)) revert InvalidMerchant();
        if (amountUsdCents == 0) revert InvalidAmount();
        if (invoices[invoiceKey].registered) revert InvoiceAlreadyRegistered();

        invoices[invoiceKey] = InvoiceRecord({
            invoiceId: invoiceId,
            merchant: merchant,
            amountUsdCents: amountUsdCents,
            registered: true,
            createdAt: block.timestamp
        });

        emit InvoiceRegistered(invoiceKey, invoiceId, merchant, amountUsdCents);
    }

    function recordSettlement(
        string calldata invoiceId,
        address buyer,
        bytes32 particleTxRef,
        string calldata particleTransactionId
    ) external onlyRecorder {
        bytes32 invoiceKey = invoiceKeyOf(invoiceId);
        InvoiceRecord memory invoice = invoices[invoiceKey];

        if (!invoice.registered) revert InvoiceNotRegistered();
        if (buyer == address(0)) revert InvalidBuyer();
        if (settlements[invoiceKey].settled) revert SettlementAlreadyRecorded();

        settlements[invoiceKey] = SettlementRecord({
            invoiceId: invoice.invoiceId,
            buyer: buyer,
            merchant: invoice.merchant,
            amountUsdCents: invoice.amountUsdCents,
            particleTxRef: particleTxRef,
            particleTransactionId: particleTransactionId,
            settled: true,
            settledAt: block.timestamp
        });

        emit SettlementRecorded(
            invoiceKey,
            invoice.invoiceId,
            buyer,
            invoice.merchant,
            invoice.amountUsdCents,
            particleTxRef,
            particleTransactionId
        );
        emit ProductUnlocked(invoiceKey, invoice.invoiceId, buyer);
    }

    function getInvoice(string calldata invoiceId) external view returns (InvoiceRecord memory) {
        return invoices[invoiceKeyOf(invoiceId)];
    }

    function getSettlement(string calldata invoiceId) external view returns (SettlementRecord memory) {
        return settlements[invoiceKeyOf(invoiceId)];
    }

    function isInvoiceSettled(string calldata invoiceId) external view returns (bool) {
        return settlements[invoiceKeyOf(invoiceId)].settled;
    }

    function invoiceKeyOf(string calldata invoiceId) public pure returns (bytes32) {
        if (bytes(invoiceId).length == 0) revert InvalidInvoiceId();
        return keccak256(bytes(invoiceId));
    }
}
