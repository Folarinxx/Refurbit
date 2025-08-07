// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Custom ReentrancyGuard
 * @dev Contract module that helps prevent reentrant calls to a function.
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

interface INexus {
    function changeDeviceState(uint256 _deviceId, uint8 _newState, string memory _notes) external;
    function getDevice(uint256 _deviceId) external view returns (
        uint256, string memory, string memory, string memory, uint8, uint8, address, address, uint256, uint256, bool
    );
}

/**
 * @title Verdant - Recycling Processes and Environmental Tracking
 * @dev Manages recycling operations and tracks environmental impact
 */
contract Verdant is AccessControl, ReentrancyGuard {
    // Roles
    bytes32 public constant RECYCLING_OPERATOR_ROLE = keccak256("RECYCLING_OPERATOR_ROLE");
    bytes32 public constant ENVIRONMENTAL_AUDITOR_ROLE = keccak256("ENVIRONMENTAL_AUDITOR_ROLE");
    bytes32 public constant FACILITY_MANAGER_ROLE = keccak256("FACILITY_MANAGER_ROLE");

    // Recycling process states
    enum RecyclingState {
        Received,
        Assessment,
        Disassembly,
        MaterialSeparation,
        Processing,
        Completed,
        Disposed
    }

    // Material types
    enum MaterialType {
        PreciousMetals,
        RareEarths,
        Plastics,
        Glass,
        Batteries,
        CircuitBoards,
        Cables,
        Magnetics,
        Other
    }

    struct RecyclingProcess {
        uint256 processId;
        uint256 deviceId;
        address facilityOperator;
        RecyclingState currentState;
        uint256 startDate;
        uint256 completionDate;
        string[] processHistory;
        mapping(MaterialType => uint256) recoveredMaterials; // in grams
        mapping(string => string) processNotes;
        uint256 energyConsumed; // in kWh
        uint256 waterUsed; // in liters
        uint256 co2Emissions; // in grams
        bool isCompleted;
    }

    struct RecyclingFacility {
        address facilityAddress;
        string facilityName;
        string location;
        string[] certifications;
        bool isActive;
        uint256 totalDevicesProcessed;
        uint256 totalMaterialsRecovered;
        uint256 totalEnergyConsumed;
        uint256 totalWaterUsed;
        uint256 totalCo2Emissions;
        mapping(MaterialType => uint256) materialCapacity;
    }

    struct EnvironmentalMetrics {
        uint256 totalDevicesRecycled;
        uint256 totalMaterialsRecovered;
        uint256 totalEnergyConsumed;
        uint256 totalWaterUsed;
        uint256 totalCo2Emissions;
        uint256 totalWasteReduced;
        mapping(MaterialType => uint256) materialRecoveryRates;
    }

    struct MaterialRecovery {
        MaterialType materialType;
        uint256 amount;
        string unit;
        uint256 marketValue; // in wei
        address processor;
        uint256 timestamp;
    }

    // Storage
    INexus public nexusContract;
    uint256 private _processIdCounter; // Replace Counters.Counter with simple uint256
    
    mapping(uint256 => RecyclingProcess) public recyclingProcesses;
    mapping(uint256 => uint256) public deviceToProcessId;
    mapping(address => RecyclingFacility) public facilities;
    mapping(uint256 => MaterialRecovery[]) public processRecoveries;
    
    address[] public registeredFacilities;
    EnvironmentalMetrics public globalMetrics;
    
    // Material pricing (in wei per gram)
    mapping(MaterialType => uint256) public materialPrices;

    // Events
    event RecyclingProcessStarted(uint256 indexed processId, uint256 indexed deviceId, address indexed facility);
    event RecyclingStateChanged(uint256 indexed processId, RecyclingState indexed fromState, RecyclingState indexed toState);
    event MaterialRecovered(uint256 indexed processId, MaterialType indexed materialType, uint256 amount, uint256 value);
    event EnvironmentalImpactRecorded(uint256 indexed processId, uint256 energyConsumed, uint256 waterUsed, uint256 co2Emissions);
    event FacilityRegistered(address indexed facilityAddress, string facilityName);
    event ProcessCompleted(uint256 indexed processId, uint256 totalValue, uint256 environmentalScore);

    constructor(address _nexusContract) {
        require(_nexusContract != address(0), "Invalid Nexus contract address");
        
        nexusContract = INexus(_nexusContract);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RECYCLING_OPERATOR_ROLE, msg.sender);
        _grantRole(ENVIRONMENTAL_AUDITOR_ROLE, msg.sender);
        _grantRole(FACILITY_MANAGER_ROLE, msg.sender);

        _initializeMaterialPrices();
    }

    /**
     * @dev Register a new recycling facility
     */
    function registerFacility(
        address _facilityAddress,
        string memory _facilityName,
        string memory _location,
        string[] memory _certifications
    ) external onlyRole(FACILITY_MANAGER_ROLE) {
        require(_facilityAddress != address(0), "Invalid facility address");
        require(!facilities[_facilityAddress].isActive, "Facility already registered");

        RecyclingFacility storage facility = facilities[_facilityAddress];
        facility.facilityAddress = _facilityAddress;
        facility.facilityName = _facilityName;
        facility.location = _location;
        facility.certifications = _certifications;
        facility.isActive = true;

        registeredFacilities.push(_facilityAddress);
        _grantRole(RECYCLING_OPERATOR_ROLE, _facilityAddress);

        emit FacilityRegistered(_facilityAddress, _facilityName);
    }

    /**
     * @dev Start recycling process for a device
     */
    function startRecyclingProcess(
        uint256 _deviceId
    ) external onlyRole(RECYCLING_OPERATOR_ROLE) nonReentrant returns (uint256) {
        require(facilities[msg.sender].isActive, "Not an active facility");
        require(deviceToProcessId[_deviceId] == 0, "Device already in recycling process");

        // Verify device state with Nexus
        (, , , , , uint8 currentState, , , , , bool isActive) = nexusContract.getDevice(_deviceId);
        require(isActive, "Device is not active");
        require(currentState == 3, "Device not in EndOfLife state"); // DeviceState.EndOfLife = 3

        _processIdCounter++; // Simple increment instead of Counters
        uint256 processId = _processIdCounter;

        RecyclingProcess storage process = recyclingProcesses[processId];
        process.processId = processId;
        process.deviceId = _deviceId;
        process.facilityOperator = msg.sender;
        process.currentState = RecyclingState.Received;
        process.startDate = block.timestamp;
        process.processHistory.push("Received");

        deviceToProcessId[_deviceId] = processId;

        // Update Nexus contract - DeviceState.InRecycling = 4
        nexusContract.changeDeviceState(_deviceId, 4, "Started recycling process");

        // Update facility metrics
        facilities[msg.sender].totalDevicesProcessed++;

        emit RecyclingProcessStarted(processId, _deviceId, msg.sender);
        return processId;
    }

    /**
     * @dev Update recycling process state
     */
    function updateRecyclingState(
        uint256 _processId,
        RecyclingState _newState,
        string memory _notes
    ) external onlyRole(RECYCLING_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RecyclingProcess storage process = recyclingProcesses[_processId];
        require(process.facilityOperator == msg.sender, "Not authorized for this process");
        require(!process.isCompleted, "Process already completed");

        RecyclingState currentState = process.currentState;
        require(_isValidRecyclingStateTransition(currentState, _newState), "Invalid state transition");

        process.currentState = _newState;
        process.processHistory.push(_getRecyclingStateString(_newState));
        process.processNotes[_getRecyclingStateString(_newState)] = _notes;

        if (_newState == RecyclingState.Completed) {
            process.completionDate = block.timestamp;
            process.isCompleted = true;
            
            // Update Nexus contract - DeviceState.Recycled = 7
            nexusContract.changeDeviceState(process.deviceId, 7, "Recycling process completed");
            
            _updateGlobalMetrics(_processId);
            emit ProcessCompleted(_processId, _calculateProcessValue(_processId), _calculateEnvironmentalScore(_processId));
        }

        emit RecyclingStateChanged(_processId, currentState, _newState);
    }

    /**
     * @dev Record material recovery
     */
    function recordMaterialRecovery(
        uint256 _processId,
        MaterialType _materialType,
        uint256 _amount,
        string memory _unit
    ) external onlyRole(RECYCLING_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RecyclingProcess storage process = recyclingProcesses[_processId];
        require(process.facilityOperator == msg.sender, "Not authorized for this process");
        require(process.currentState == RecyclingState.Processing || process.currentState == RecyclingState.Completed, "Invalid process state for material recovery");

        process.recoveredMaterials[_materialType] += _amount;
        
        uint256 materialValue = _amount * materialPrices[_materialType];
        
        MaterialRecovery memory recovery = MaterialRecovery({
            materialType: _materialType,
            amount: _amount,
            unit: _unit,
            marketValue: materialValue,
            processor: msg.sender,
            timestamp: block.timestamp
        });

        processRecoveries[_processId].push(recovery);

        // Update facility metrics
        facilities[msg.sender].totalMaterialsRecovered += _amount;

        // Update global metrics
        globalMetrics.totalMaterialsRecovered += _amount;
        globalMetrics.materialRecoveryRates[_materialType] += _amount;

        emit MaterialRecovered(_processId, _materialType, _amount, materialValue);
    }

    /**
     * @dev Record environmental impact
     */
    function recordEnvironmentalImpact(
        uint256 _processId,
        uint256 _energyConsumed,
        uint256 _waterUsed,
        uint256 _co2Emissions
    ) external onlyRole(RECYCLING_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RecyclingProcess storage process = recyclingProcesses[_processId];
        require(process.facilityOperator == msg.sender, "Not authorized for this process");

        process.energyConsumed += _energyConsumed;
        process.waterUsed += _waterUsed;
        process.co2Emissions += _co2Emissions;

        // Update facility metrics
        RecyclingFacility storage facility = facilities[msg.sender];
        facility.totalEnergyConsumed += _energyConsumed;
        facility.totalWaterUsed += _waterUsed;
        facility.totalCo2Emissions += _co2Emissions;

        // Update global metrics
        globalMetrics.totalEnergyConsumed += _energyConsumed;
        globalMetrics.totalWaterUsed += _waterUsed;
        globalMetrics.totalCo2Emissions += _co2Emissions;

        emit EnvironmentalImpactRecorded(_processId, _energyConsumed, _waterUsed, _co2Emissions);
    }

    /**
     * @dev Update material prices
     */
    function updateMaterialPrice(
        MaterialType _materialType,
        uint256 _pricePerGram
    ) external onlyRole(ENVIRONMENTAL_AUDITOR_ROLE) {
        materialPrices[_materialType] = _pricePerGram;
    }

    /**
     * @dev Get recycling process details
     */
    function getRecyclingProcess(uint256 _processId) external view returns (
        uint256 processId,
        uint256 deviceId,
        address facilityOperator,
        RecyclingState currentState,
        uint256 startDate,
        uint256 completionDate,
        uint256 energyConsumed,
        uint256 waterUsed,
        uint256 co2Emissions,
        bool isCompleted
    ) {
        require(_processExists(_processId), "Process does not exist");
        
        RecyclingProcess storage process = recyclingProcesses[_processId];
        return (
            process.processId,
            process.deviceId,
            process.facilityOperator,
            process.currentState,
            process.startDate,
            process.completionDate,
            process.energyConsumed,
            process.waterUsed,
            process.co2Emissions,
            process.isCompleted
        );
    }

    /**
     * @dev Get material recovery for a process
     */
    function getMaterialRecovery(uint256 _processId, MaterialType _materialType) external view returns (uint256) {
        require(_processExists(_processId), "Process does not exist");
        return recyclingProcesses[_processId].recoveredMaterials[_materialType];
    }

    /**
     * @dev Get process recoveries
     */
    function getProcessRecoveries(uint256 _processId) external view returns (MaterialRecovery[] memory) {
        require(_processExists(_processId), "Process does not exist");
        return processRecoveries[_processId];
    }

    /**
     * @dev Get facility information
     */
    function getFacility(address _facilityAddress) external view returns (
        string memory facilityName,
        string memory location,
        bool isActive,
        uint256 totalDevicesProcessed,
        uint256 totalMaterialsRecovered,
        uint256 totalEnergyConsumed,
        uint256 totalWaterUsed,
        uint256 totalCo2Emissions
    ) {
        RecyclingFacility storage facility = facilities[_facilityAddress];
        return (
            facility.facilityName,
            facility.location,
            facility.isActive,
            facility.totalDevicesProcessed,
            facility.totalMaterialsRecovered,
            facility.totalEnergyConsumed,
            facility.totalWaterUsed,
            facility.totalCo2Emissions
        );
    }

    /**
     * @dev Get global environmental metrics
     */
    function getGlobalMetrics() external view returns (
        uint256 totalDevicesRecycled,
        uint256 totalMaterialsRecovered,
        uint256 totalEnergyConsumed,
        uint256 totalWaterUsed,
        uint256 totalCo2Emissions,
        uint256 totalWasteReduced
    ) {
        return (
            globalMetrics.totalDevicesRecycled,
            globalMetrics.totalMaterialsRecovered,
            globalMetrics.totalEnergyConsumed,
            globalMetrics.totalWaterUsed,
            globalMetrics.totalCo2Emissions,
            globalMetrics.totalWasteReduced
        );
    }

    /**
     * @dev Get all registered facilities
     */
    function getRegisteredFacilities() external view returns (address[] memory) {
        return registeredFacilities;
    }

    /**
     * @dev Get current process ID counter
     */
    function getCurrentProcessId() external view returns (uint256) {
        return _processIdCounter;
    }

    // Internal functions
    function _processExists(uint256 _processId) internal view returns (bool) {
        return _processId > 0 && _processId <= _processIdCounter;
    }

    function _isValidRecyclingStateTransition(RecyclingState _from, RecyclingState _to) internal pure returns (bool) {
        if (_from == RecyclingState.Received) {
            return _to == RecyclingState.Assessment;
        } else if (_from == RecyclingState.Assessment) {
            return _to == RecyclingState.Disassembly || _to == RecyclingState.Disposed;
        } else if (_from == RecyclingState.Disassembly) {
            return _to == RecyclingState.MaterialSeparation;
        } else if (_from == RecyclingState.MaterialSeparation) {
            return _to == RecyclingState.Processing;
        } else if (_from == RecyclingState.Processing) {
            return _to == RecyclingState.Completed;
        }
        return false;
    }

    function _getRecyclingStateString(RecyclingState _state) internal pure returns (string memory) {
        if (_state == RecyclingState.Received) return "Received";
        if (_state == RecyclingState.Assessment) return "Assessment";
        if (_state == RecyclingState.Disassembly) return "Disassembly";
        if (_state == RecyclingState.MaterialSeparation) return "MaterialSeparation";
        if (_state == RecyclingState.Processing) return "Processing";
        if (_state == RecyclingState.Completed) return "Completed";
        if (_state == RecyclingState.Disposed) return "Disposed";
        return "Unknown";
    }

    function _initializeMaterialPrices() internal {
        // Initial material prices in wei per gram (approximate values)
        materialPrices[MaterialType.PreciousMetals] = 50 * 10**18; // 50 ETH per gram (gold, silver, etc.)
        materialPrices[MaterialType.RareEarths] = 10 * 10**18; // 10 ETH per gram
        materialPrices[MaterialType.Plastics] = 1 * 10**15; // 0.001 ETH per gram
        materialPrices[MaterialType.Glass] = 5 * 10**14; // 0.0005 ETH per gram
        materialPrices[MaterialType.Batteries] = 5 * 10**16; // 0.05 ETH per gram
        materialPrices[MaterialType.CircuitBoards] = 2 * 10**16; // 0.02 ETH per gram
        materialPrices[MaterialType.Cables] = 1 * 10**16; // 0.01 ETH per gram
        materialPrices[MaterialType.Magnetics] = 3 * 10**16; // 0.03 ETH per gram
        materialPrices[MaterialType.Other] = 5 * 10**15; // 0.005 ETH per gram
    }

    function _calculateProcessValue(uint256 _processId) internal view returns (uint256) {
        uint256 totalValue = 0;
        MaterialRecovery[] memory recoveries = processRecoveries[_processId];
        
        for (uint256 i = 0; i < recoveries.length; i++) {
            totalValue += recoveries[i].marketValue;
        }
        
        return totalValue;
    }

    function _calculateEnvironmentalScore(uint256 _processId) internal view returns (uint256) {
        RecyclingProcess storage process = recyclingProcesses[_processId];
        
        // Calculate environmental score based on efficiency
        // Higher material recovery and lower emissions = higher score
        uint256 totalMaterials = 0;
        for (uint8 i = 0; i < 9; i++) {
            totalMaterials += process.recoveredMaterials[MaterialType(i)];
        }
        
        if (totalMaterials == 0) return 0;
        
        // Score based on material recovery vs environmental impact
        uint256 recoveryScore = totalMaterials * 1000; // Base score from materials
        uint256 impactPenalty = (process.energyConsumed / 100) + (process.co2Emissions / 1000);
        
        return recoveryScore > impactPenalty ? recoveryScore - impactPenalty : 0;
    }

    function _updateGlobalMetrics(uint256 _processId) internal {
        globalMetrics.totalDevicesRecycled++;
        
        // Calculate total waste reduced (estimated device weight in grams)
        globalMetrics.totalWasteReduced += 500; // Average device weight
    }

    /**
     * @dev Emergency function to mark process as disposed
     */
    function emergencyDispose(uint256 _processId, string memory _reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RecyclingProcess storage process = recyclingProcesses[_processId];
        process.currentState = RecyclingState.Disposed;
        process.isCompleted = true;
        process.completionDate = block.timestamp;
        process.processNotes["Disposed"] = _reason;
        
        // Update Nexus contract - DeviceState.Disposed = 8
        nexusContract.changeDeviceState(process.deviceId, 8, string(abi.encodePacked("Emergency disposal: ", _reason)));
    }

    /**
     * @dev Deactivate a facility
     */
    function deactivateFacility(address _facilityAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(facilities[_facilityAddress].isActive, "Facility not active");
        facilities[_facilityAddress].isActive = false;
        _revokeRole(RECYCLING_OPERATOR_ROLE, _facilityAddress);
    }
}