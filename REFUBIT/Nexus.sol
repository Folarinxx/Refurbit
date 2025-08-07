// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Nexus - Core Device Registry and Lifecycle Management
 * @dev Central registry for electronic devices with lifecycle tracking
 */
contract Nexus is AccessControl {
    // Roles
    bytes32 public constant DEVICE_REGISTRAR_ROLE = keccak256("DEVICE_REGISTRAR_ROLE");
    bytes32 public constant LIFECYCLE_MANAGER_ROLE = keccak256("LIFECYCLE_MANAGER_ROLE");
    bytes32 public constant CONTRACT_INTEGRATOR_ROLE = keccak256("CONTRACT_INTEGRATOR_ROLE");

    // Device lifecycle states
    enum DeviceState {
        Registered,
        InUse,
        EndOfLife,
        InRecycling,
        InRefurbishment,
        Refurbished,
        Recycled,
        Disposed
    }

    // Device categories
    enum DeviceCategory {
        Smartphone,
        Laptop,
        Desktop,
        Tablet,
        Wearable,
        SmartHome,
        AudioVideo,
        Gaming,
        Other
    }

    struct Device {
        uint256 id;
        string serialNumber;
        string model;
        string manufacturer;
        DeviceCategory category;
        DeviceState currentState;
        address currentOwner;
        address originalOwner;
        uint256 registrationDate;
        uint256 lastStateChange;
        string[] stateHistory;
        mapping(string => string) metadata;
        bool isActive;
    }

    struct StateTransition {
        uint256 deviceId;
        DeviceState fromState;
        DeviceState toState;
        address initiatedBy;
        uint256 timestamp;
        string notes;
        bytes32 transactionHash;
    }

    // Storage - Replace Counters with simple uint256
    uint256 private _deviceIdCounter;
    mapping(uint256 => Device) public devices;
    mapping(string => uint256) public serialToDeviceId;
    mapping(address => uint256[]) public ownerDevices;
    mapping(uint256 => StateTransition[]) public deviceStateHistory;
    
    // Integration with other contracts
    mapping(string => address) public integratedContracts;
    
    // Events
    event DeviceRegistered(uint256 indexed deviceId, string serialNumber, address indexed owner);
    event StateChanged(uint256 indexed deviceId, DeviceState indexed fromState, DeviceState toState, address indexed initiatedBy);
    event OwnershipTransferred(uint256 indexed deviceId, address indexed previousOwner, address indexed newOwner);
    event MetadataUpdated(uint256 indexed deviceId, string key, string value);
    event ContractIntegrated(string contractName, address contractAddress);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEVICE_REGISTRAR_ROLE, msg.sender);
        _grantRole(LIFECYCLE_MANAGER_ROLE, msg.sender);
        _grantRole(CONTRACT_INTEGRATOR_ROLE, msg.sender);
    }

    function registerDevice(
        string memory _serialNumber,
        string memory _model,
        string memory _manufacturer,
        DeviceCategory _category,
        address _owner
    ) external onlyRole(DEVICE_REGISTRAR_ROLE) returns (uint256) {
        require(bytes(_serialNumber).length > 0, "Serial number cannot be empty");
        require(serialToDeviceId[_serialNumber] == 0, "Device already registered");
        require(_owner != address(0), "Invalid owner address");

        // Increment counter manually
        _deviceIdCounter += 1;
        uint256 deviceId = _deviceIdCounter;

        Device storage device = devices[deviceId];
        device.id = deviceId;
        device.serialNumber = _serialNumber;
        device.model = _model;
        device.manufacturer = _manufacturer;
        device.category = _category;
        device.currentState = DeviceState.Registered;
        device.currentOwner = _owner;
        device.originalOwner = _owner;
        device.registrationDate = block.timestamp;
        device.lastStateChange = block.timestamp;
        device.stateHistory.push("Registered");
        device.isActive = true;

        serialToDeviceId[_serialNumber] = deviceId;
        ownerDevices[_owner].push(deviceId);

        _recordStateTransition(deviceId, DeviceState.Registered, DeviceState.Registered, "Initial registration");

        emit DeviceRegistered(deviceId, _serialNumber, _owner);
        return deviceId;
    }

    /**
     * @dev Change device state with validation
     */
    function changeDeviceState(
        uint256 _deviceId,
        DeviceState _newState,
        string memory _notes
    ) external onlyRole(LIFECYCLE_MANAGER_ROLE) {
        require(_deviceExists(_deviceId), "Device does not exist");
        require(devices[_deviceId].isActive, "Device is not active");

        Device storage device = devices[_deviceId];
        DeviceState currentState = device.currentState;
        
        require(_isValidStateTransition(currentState, _newState), "Invalid state transition");

        device.currentState = _newState;
        device.lastStateChange = block.timestamp;
        device.stateHistory.push(_getStateString(_newState));

        _recordStateTransition(_deviceId, currentState, _newState, _notes);

        // Notify integrated contracts
        _notifyIntegratedContracts(_deviceId, _newState);

        emit StateChanged(_deviceId, currentState, _newState, msg.sender);
    }

    /**
     * @dev Transfer device ownership
     */
    function transferOwnership(
        uint256 _deviceId,
        address _newOwner
    ) external {
        require(_deviceExists(_deviceId), "Device does not exist");
        require(devices[_deviceId].isActive, "Device is not active");
        require(_newOwner != address(0), "Invalid new owner address");
        
        Device storage device = devices[_deviceId];
        require(
            device.currentOwner == msg.sender || 
            hasRole(LIFECYCLE_MANAGER_ROLE, msg.sender),
            "Not authorized to transfer ownership"
        );

        address previousOwner = device.currentOwner;
        device.currentOwner = _newOwner;

        // Update owner mappings
        _removeDeviceFromOwner(previousOwner, _deviceId);
        ownerDevices[_newOwner].push(_deviceId);

        emit OwnershipTransferred(_deviceId, previousOwner, _newOwner);
    }

    /**
     * @dev Set device metadata
     */
    function setDeviceMetadata(
        uint256 _deviceId,
        string memory _key,
        string memory _value
    ) external onlyRole(LIFECYCLE_MANAGER_ROLE) {
        require(_deviceExists(_deviceId), "Device does not exist");
        
        devices[_deviceId].metadata[_key] = _value;
        emit MetadataUpdated(_deviceId, _key, _value);
    }

    /**
     * @dev Get device metadata
     */
    function getDeviceMetadata(
        uint256 _deviceId,
        string memory _key
    ) external view returns (string memory) {
        require(_deviceExists(_deviceId), "Device does not exist");
        return devices[_deviceId].metadata[_key];
    }

    /**
     * @dev Integrate with other contracts in the ecosystem
     */
    function integrateContract(
        string memory _contractName,
        address _contractAddress
    ) external onlyRole(CONTRACT_INTEGRATOR_ROLE) {
        require(_contractAddress != address(0), "Invalid contract address");
        
        integratedContracts[_contractName] = _contractAddress;
        emit ContractIntegrated(_contractName, _contractAddress);
    }

    /**
     * @dev Get device information
     */
    function getDevice(uint256 _deviceId) external view returns (
        uint256 id,
        string memory serialNumber,
        string memory model,
        string memory manufacturer,
        DeviceCategory category,
        DeviceState currentState,
        address currentOwner,
        address originalOwner,
        uint256 registrationDate,
        uint256 lastStateChange,
        bool isActive
    ) {
        require(_deviceExists(_deviceId), "Device does not exist");
        
        Device storage device = devices[_deviceId];
        return (
            device.id,
            device.serialNumber,
            device.model,
            device.manufacturer,
            device.category,
            device.currentState,
            device.currentOwner,
            device.originalOwner,
            device.registrationDate,
            device.lastStateChange,
            device.isActive
        );
    }

    /**
     * @dev Get device state history
     */
    function getDeviceStateHistory(uint256 _deviceId) external view returns (string[] memory) {
        require(_deviceExists(_deviceId), "Device does not exist");
        return devices[_deviceId].stateHistory;
    }

    /**
     * @dev Get devices owned by an address
     */
    function getOwnerDevices(address _owner) external view returns (uint256[] memory) {
        return ownerDevices[_owner];
    }

    /**
     * @dev Get total number of registered devices
     */
    function getTotalDevices() external view returns (uint256) {
        return _deviceIdCounter;
    }

    // Internal functions
    function _deviceExists(uint256 _deviceId) internal view returns (bool) {
        return _deviceId > 0 && _deviceId <= _deviceIdCounter;
    }

    function _isValidStateTransition(DeviceState _from, DeviceState _to) internal pure returns (bool) {
        // Define valid state transitions
        if (_from == DeviceState.Registered) {
            return _to == DeviceState.InUse || _to == DeviceState.EndOfLife;
        } else if (_from == DeviceState.InUse) {
            return _to == DeviceState.EndOfLife;
        } else if (_from == DeviceState.EndOfLife) {
            return _to == DeviceState.InRecycling || _to == DeviceState.InRefurbishment || _to == DeviceState.Disposed;
        } else if (_from == DeviceState.InRecycling) {
            return _to == DeviceState.Recycled || _to == DeviceState.Disposed;
        } else if (_from == DeviceState.InRefurbishment) {
            return _to == DeviceState.Refurbished || _to == DeviceState.InRecycling || _to == DeviceState.Disposed;
        } else if (_from == DeviceState.Refurbished) {
            return _to == DeviceState.InUse || _to == DeviceState.EndOfLife;
        }
        return false;
    }

    function _recordStateTransition(
        uint256 _deviceId,
        DeviceState _fromState,
        DeviceState _toState,
        string memory _notes
    ) internal {
        StateTransition memory transition = StateTransition({
            deviceId: _deviceId,
            fromState: _fromState,
            toState: _toState,
            initiatedBy: msg.sender,
            timestamp: block.timestamp,
            notes: _notes,
            transactionHash: keccak256(abi.encodePacked(block.timestamp, _deviceId, msg.sender))
        });

        deviceStateHistory[_deviceId].push(transition);
    }

    function _getStateString(DeviceState _state) internal pure returns (string memory) {
        if (_state == DeviceState.Registered) return "Registered";
        if (_state == DeviceState.InUse) return "InUse";
        if (_state == DeviceState.EndOfLife) return "EndOfLife";
        if (_state == DeviceState.InRecycling) return "InRecycling";
        if (_state == DeviceState.InRefurbishment) return "InRefurbishment";
        if (_state == DeviceState.Refurbished) return "Refurbished";
        if (_state == DeviceState.Recycled) return "Recycled";
        if (_state == DeviceState.Disposed) return "Disposed";
        return "Unknown";
    }

    function _removeDeviceFromOwner(address _owner, uint256 _deviceId) internal {
        uint256[] storage ownerDeviceList = ownerDevices[_owner];
        for (uint256 i = 0; i < ownerDeviceList.length; i++) {
            if (ownerDeviceList[i] == _deviceId) {
                ownerDeviceList[i] = ownerDeviceList[ownerDeviceList.length - 1];
                ownerDeviceList.pop();
                break;
            }
        }
    }

    function _notifyIntegratedContracts(uint256 _deviceId, DeviceState _newState) internal {
        // This could be extended to make actual calls to integrated contracts
        // For now, it's a placeholder for future integration logic
    }

    /**
     * @dev Emergency function to deactivate a device
     */
    function deactivateDevice(uint256 _deviceId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_deviceExists(_deviceId), "Device does not exist");
        devices[_deviceId].isActive = false;
    }
}