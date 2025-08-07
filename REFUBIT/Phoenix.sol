// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface INexus {
    function changeDeviceState(uint256 _deviceId, uint8 _newState, string memory _notes) external;
    function getDevice(uint256 _deviceId) external view returns (
        uint256, string memory, string memory, string memory, uint8, uint8, address, address, uint256, uint256, bool
    );
    function setDeviceMetadata(uint256 _deviceId, string memory _key, string memory _value) external;
}

/**
 * @title Phoenix - Refurbishment and Device Restoration
 * @dev Manages device refurbishment processes and restoration tracking
 */
contract Phoenix {
    // Access Control
    mapping(bytes32 => mapping(address => bool)) private _roles;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant REFURBISHMENT_OPERATOR_ROLE = keccak256("REFURBISHMENT_OPERATOR_ROLE");
    bytes32 public constant QUALITY_INSPECTOR_ROLE = keccak256("QUALITY_INSPECTOR_ROLE");
    bytes32 public constant WORKSHOP_MANAGER_ROLE = keccak256("WORKSHOP_MANAGER_ROLE");
    bytes32 public constant PARTS_MANAGER_ROLE = keccak256("PARTS_MANAGER_ROLE");

    // Reentrancy Guard
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    // Refurbishment process states
    enum RefurbishmentState {
        Received,
        InitialAssessment,
        Diagnosis,
        PartsOrdering,
        Repair,
        QualityTesting,
        FinalInspection,
        Completed,
        Failed
    }

    // Quality grades
    enum QualityGrade {
        Excellent,  // Like new
        Good,       // Minor wear
        Fair,       // Visible wear but functional
        Poor,       // Significant wear
        Failed      // Cannot be refurbished
    }

    // Component types
    enum ComponentType {
        Battery,
        Screen,
        Motherboard,
        Memory,
        Storage,
        Camera,
        Speaker,
        Microphone,
        Charging,
        Buttons,
        Housing,
        Other
    }

    struct RefurbishmentProcess {
        uint256 processId;
        uint256 deviceId;
        address workshop;
        address assignedTechnician;
        RefurbishmentState currentState;
        QualityGrade initialGrade;
        QualityGrade finalGrade;
        uint256 startDate;
        uint256 completionDate;
        uint256 estimatedCost;
        uint256 actualCost;
        string[] processHistory;
        bool isCompleted;
        bool isSuccessful;
    }

    struct ComponentStatus {
        bool needsReplacement;
        bool isReplaced;
        string condition;
        uint256 replacementCost;
        string partNumber;
        address supplier;
        uint256 replacementDate;
    }

    struct RefurbishmentWorkshop {
        address workshopAddress;
        string workshopName;
        string location;
        string[] certifications;
        bool isActive;
        uint256 totalDevicesProcessed;
        uint256 successfulRefurbishments;
        uint256 totalRevenue;
    }

    struct QualityTest {
        uint256 processId;
        ComponentType component;
        bool passed;
        uint256 score; // 0-100
        string testDetails;
        address inspector;
        uint256 timestamp;
    }

    struct PartOrder {
        uint256 orderId;
        uint256 processId;
        ComponentType componentType;
        string partNumber;
        uint256 quantity;
        uint256 unitCost;
        address supplier;
        uint256 orderDate;
        uint256 deliveryDate;
        bool isDelivered;
        string status;
    }

    struct RefurbishmentMetrics {
        uint256 totalProcesses;
        uint256 successfulRefurbishments;
        uint256 failedRefurbishments;
        uint256 totalRevenue;
        uint256 totalCostSavings;
    }

    // Storage
    INexus public nexusContract;
    
    // Simple counters
    uint256 private _processIdCounter;
    uint256 private _orderIdCounter;
    
    mapping(uint256 => RefurbishmentProcess) public refurbishmentProcesses;
    mapping(uint256 => mapping(ComponentType => ComponentStatus)) public componentStatuses;
    mapping(uint256 => mapping(string => string)) public processNotes;
    mapping(uint256 => uint256) public deviceToProcessId;
    mapping(address => RefurbishmentWorkshop) public workshops;
    mapping(address => mapping(ComponentType => uint256)) public workshopComponentCapabilities;
    mapping(address => mapping(QualityGrade => uint256)) public workshopGradeDistribution;
    mapping(uint256 => QualityTest[]) public processQualityTests;
    mapping(uint256 => PartOrder[]) public processPartOrders;
    mapping(uint256 => PartOrder) public partOrders;
    
    address[] public registeredWorkshops;
    RefurbishmentMetrics public globalMetrics;
    mapping(QualityGrade => uint256) public globalGradeDistribution;
    mapping(ComponentType => uint256) public globalComponentReplacementRates;

    // Component pricing and market values
    mapping(ComponentType => uint256) public componentCosts;
    mapping(QualityGrade => uint256) public qualityMultipliers; // Percentage multipliers

    // Events
    event RefurbishmentProcessStarted(uint256 indexed processId, uint256 indexed deviceId, address indexed workshop);
    event RefurbishmentStateChanged(uint256 indexed processId, RefurbishmentState indexed fromState, RefurbishmentState indexed toState);
    event QualityTestCompleted(uint256 indexed processId, ComponentType indexed component, bool passed, uint256 score);
    event ComponentReplaced(uint256 indexed processId, ComponentType indexed component, string partNumber, uint256 cost);
    event PartOrdered(uint256 indexed orderId, uint256 indexed processId, ComponentType indexed component, address supplier);
    event ProcessCompleted(uint256 indexed processId, bool successful, QualityGrade finalGrade, uint256 totalCost);
    event WorkshopRegistered(address indexed workshopAddress, string workshopName);
    event WorkshopDeactivated(address indexed workshopAddress);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    // Modifiers
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Access denied: insufficient role");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address _nexusContract) {
        require(_nexusContract != address(0), "Invalid Nexus contract address");
        
        nexusContract = INexus(_nexusContract);
        _status = _NOT_ENTERED;
        
        // Grant all roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REFURBISHMENT_OPERATOR_ROLE, msg.sender);
        _grantRole(QUALITY_INSPECTOR_ROLE, msg.sender);
        _grantRole(WORKSHOP_MANAGER_ROLE, msg.sender);
        _grantRole(PARTS_MANAGER_ROLE, msg.sender);

        _initializeComponentCosts();
        _initializeQualityMultipliers();
    }

    // Access Control Functions
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function grantRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
    }

    function _grantRole(bytes32 role, address account) internal {
        if (!hasRole(role, account)) {
            _roles[role][account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    function _revokeRole(bytes32 role, address account) internal {
        if (hasRole(role, account)) {
            _roles[role][account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }

    /**
     * @dev Register a new refurbishment workshop
     */
    function registerWorkshop(
        address _workshopAddress,
        string memory _workshopName,
        string memory _location,
        string[] memory _certifications
    ) external onlyRole(WORKSHOP_MANAGER_ROLE) {
        require(_workshopAddress != address(0), "Invalid workshop address");
        require(!workshops[_workshopAddress].isActive, "Workshop already registered");

        RefurbishmentWorkshop storage workshop = workshops[_workshopAddress];
        workshop.workshopAddress = _workshopAddress;
        workshop.workshopName = _workshopName;
        workshop.location = _location;
        workshop.certifications = _certifications;
        workshop.isActive = true;

        registeredWorkshops.push(_workshopAddress);
        _grantRole(REFURBISHMENT_OPERATOR_ROLE, _workshopAddress);

        emit WorkshopRegistered(_workshopAddress, _workshopName);
    }

    /**
     * @dev Start refurbishment process for a device
     */
    function startRefurbishmentProcess(
        uint256 _deviceId,
        address _assignedTechnician,
        uint256 _estimatedCost
    ) external onlyRole(REFURBISHMENT_OPERATOR_ROLE) nonReentrant returns (uint256) {
        require(workshops[msg.sender].isActive, "Not an active workshop");
        require(deviceToProcessId[_deviceId] == 0, "Device already in refurbishment process");
        require(_assignedTechnician != address(0), "Invalid technician address");

        // Verify device state with Nexus
        (, , , , , uint8 currentState, , , , , bool isActive) = nexusContract.getDevice(_deviceId);
        require(isActive, "Device is not active");
        require(currentState == 3, "Device not in EndOfLife state"); // DeviceState.EndOfLife = 3

        // Increment counter
        ++_processIdCounter;
        uint256 processId = _processIdCounter;

        RefurbishmentProcess storage process = refurbishmentProcesses[processId];
        process.processId = processId;
        process.deviceId = _deviceId;
        process.workshop = msg.sender;
        process.assignedTechnician = _assignedTechnician;
        process.currentState = RefurbishmentState.Received;
        process.startDate = block.timestamp;
        process.estimatedCost = _estimatedCost;
        process.processHistory.push("Received");

        deviceToProcessId[_deviceId] = processId;

        // Update Nexus contract - DeviceState.InRefurbishment = 5
        nexusContract.changeDeviceState(_deviceId, 5, "Started refurbishment process");

        // Update workshop metrics
        workshops[msg.sender].totalDevicesProcessed++;
        globalMetrics.totalProcesses++;

        emit RefurbishmentProcessStarted(processId, _deviceId, msg.sender);
        return processId;
    }

    /**
     * @dev Update refurbishment process state
     */
    function updateRefurbishmentState(
        uint256 _processId,
        RefurbishmentState _newState,
        string memory _notes
    ) external onlyRole(REFURBISHMENT_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.workshop == msg.sender, "Not authorized for this process");
        require(!process.isCompleted, "Process already completed");

        RefurbishmentState currentState = process.currentState;
        require(_isValidRefurbishmentStateTransition(currentState, _newState), "Invalid state transition");

        process.currentState = _newState;
        process.processHistory.push(_getRefurbishmentStateString(_newState));
        processNotes[_processId][_getRefurbishmentStateString(_newState)] = _notes;

        if (_newState == RefurbishmentState.Completed) {
            _completeRefurbishmentProcess(_processId, true);
        } else if (_newState == RefurbishmentState.Failed) {
            _completeRefurbishmentProcess(_processId, false);
        }

        emit RefurbishmentStateChanged(_processId, currentState, _newState);
    }

    /**
     * @dev Perform initial quality assessment
     */
    function performInitialAssessment(
        uint256 _processId,
        QualityGrade _initialGrade,
        string memory _assessmentNotes
    ) external onlyRole(QUALITY_INSPECTOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.currentState == RefurbishmentState.InitialAssessment, "Invalid process state");

        process.initialGrade = _initialGrade;
        processNotes[_processId]["InitialAssessment"] = _assessmentNotes;

        // Update Nexus metadata
        nexusContract.setDeviceMetadata(process.deviceId, "initialQualityGrade", _getQualityGradeString(_initialGrade));
    }

    /**
     * @dev Record component diagnosis
     */
    function recordComponentDiagnosis(
        uint256 _processId,
        ComponentType _component,
        bool _needsReplacement,
        string memory _condition,
        uint256 _replacementCost,
        string memory _partNumber
    ) external onlyRole(REFURBISHMENT_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.workshop == msg.sender, "Not authorized for this process");
        require(process.currentState == RefurbishmentState.Diagnosis, "Invalid process state");

        ComponentStatus storage componentStatus = componentStatuses[_processId][_component];
        componentStatus.needsReplacement = _needsReplacement;
        componentStatus.condition = _condition;
        componentStatus.replacementCost = _replacementCost;
        componentStatus.partNumber = _partNumber;

        if (_needsReplacement) {
            process.actualCost += _replacementCost;
        }
    }

    /**
     * @dev Order replacement part
     */
    function orderReplacementPart(
        uint256 _processId,
        ComponentType _componentType,
        string memory _partNumber,
        uint256 _quantity,
        uint256 _unitCost,
        address _supplier
    ) external onlyRole(PARTS_MANAGER_ROLE) returns (uint256) {
        require(_processExists(_processId), "Process does not exist");
        require(_supplier != address(0), "Invalid supplier address");

        // Increment counter
        ++_orderIdCounter;
        uint256 orderId = _orderIdCounter;

        PartOrder memory order = PartOrder({
            orderId: orderId,
            processId: _processId,
            componentType: _componentType,
            partNumber: _partNumber,
            quantity: _quantity,
            unitCost: _unitCost,
            supplier: _supplier,
            orderDate: block.timestamp,
            deliveryDate: 0,
            isDelivered: false,
            status: "Ordered"
        });

        partOrders[orderId] = order;
        processPartOrders[_processId].push(order);

        emit PartOrdered(orderId, _processId, _componentType, _supplier);
        return orderId;
    }

    /**
     * @dev Mark part as delivered
     */
    function markPartDelivered(uint256 _orderId) external onlyRole(PARTS_MANAGER_ROLE) {
        require(partOrders[_orderId].orderId != 0, "Order does not exist");
        
        PartOrder storage order = partOrders[_orderId];
        require(!order.isDelivered, "Part already delivered");

        order.isDelivered = true;
        order.deliveryDate = block.timestamp;
        order.status = "Delivered";
    }

    /**
     * @dev Replace component
     */
    function replaceComponent(
        uint256 _processId,
        ComponentType _component,
        string memory _partNumber,
        uint256 _actualCost
    ) external onlyRole(REFURBISHMENT_OPERATOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.workshop == msg.sender, "Not authorized for this process");
        require(process.currentState == RefurbishmentState.Repair, "Invalid process state");

        ComponentStatus storage componentStatus = componentStatuses[_processId][_component];
        require(componentStatus.needsReplacement, "Component does not need replacement");
        require(!componentStatus.isReplaced, "Component already replaced");

        componentStatus.isReplaced = true;
        componentStatus.replacementDate = block.timestamp;
        componentStatus.replacementCost = _actualCost;

        // Update metrics
        globalComponentReplacementRates[_component]++;

        emit ComponentReplaced(_processId, _component, _partNumber, _actualCost);
    }

    /**
     * @dev Perform quality test on component
     */
    function performQualityTest(
        uint256 _processId,
        ComponentType _component,
        bool _passed,
        uint256 _score,
        string memory _testDetails
    ) external onlyRole(QUALITY_INSPECTOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        require(_score <= 100, "Score must be between 0 and 100");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.currentState == RefurbishmentState.QualityTesting, "Invalid process state");

        QualityTest memory test = QualityTest({
            processId: _processId,
            component: _component,
            passed: _passed,
            score: _score,
            testDetails: _testDetails,
            inspector: msg.sender,
            timestamp: block.timestamp
        });

        processQualityTests[_processId].push(test);

        emit QualityTestCompleted(_processId, _component, _passed, _score);
    }

    /**
     * @dev Perform final inspection and set quality grade
     */
    function performFinalInspection(
        uint256 _processId,
        QualityGrade _finalGrade,
        string memory _inspectionNotes
    ) external onlyRole(QUALITY_INSPECTOR_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(process.currentState == RefurbishmentState.FinalInspection, "Invalid process state");

        process.finalGrade = _finalGrade;
        processNotes[_processId]["FinalInspection"] = _inspectionNotes;

        // Update Nexus metadata
        nexusContract.setDeviceMetadata(process.deviceId, "finalQualityGrade", _getQualityGradeString(_finalGrade));
        nexusContract.setDeviceMetadata(process.deviceId, "refurbishmentDate", _toString(block.timestamp));
    }

    /**
     * @dev Get refurbishment process details
     */
    function getRefurbishmentProcess(uint256 _processId) external view returns (
        uint256 processId,
        uint256 deviceId,
        address workshop,
        address assignedTechnician,
        RefurbishmentState currentState,
        QualityGrade initialGrade,
        QualityGrade finalGrade,
        uint256 startDate,
        uint256 completionDate,
        uint256 estimatedCost,
        uint256 actualCost,
        bool isCompleted,
        bool isSuccessful
    ) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        return (
            process.processId,
            process.deviceId,
            process.workshop,
            process.assignedTechnician,
            process.currentState,
            process.initialGrade,
            process.finalGrade,
            process.startDate,
            process.completionDate,
            process.estimatedCost,
            process.actualCost,
            process.isCompleted,
            process.isSuccessful
        );
    }

    /**
     * @dev Get component status
     */
    function getComponentStatus(uint256 _processId, ComponentType _component) external view returns (
        bool needsReplacement,
        bool isReplaced,
        string memory condition,
        uint256 replacementCost,
        string memory partNumber,
        address supplier,
        uint256 replacementDate
    ) {
        require(_processExists(_processId), "Process does not exist");
        
        ComponentStatus storage status = componentStatuses[_processId][_component];
        return (
            status.needsReplacement,
            status.isReplaced,
            status.condition,
            status.replacementCost,
            status.partNumber,
            status.supplier,
            status.replacementDate
        );
    }

    /**
     * @dev Get quality tests for a process
     */
    function getQualityTests(uint256 _processId) external view returns (QualityTest[] memory) {
        require(_processExists(_processId), "Process does not exist");
        return processQualityTests[_processId];
    }

    /**
     * @dev Get part orders for a process
     */
    function getPartOrders(uint256 _processId) external view returns (PartOrder[] memory) {
        require(_processExists(_processId), "Process does not exist");
        return processPartOrders[_processId];
    }

    /**
     * @dev Get workshop information
     */
    function getWorkshop(address _workshopAddress) external view returns (
        string memory workshopName,
        string memory location,
        bool isActive,
        uint256 totalDevicesProcessed,
        uint256 successfulRefurbishments,
        uint256 totalRevenue
    ) {
        RefurbishmentWorkshop storage workshop = workshops[_workshopAddress];
        return (
            workshop.workshopName,
            workshop.location,
            workshop.isActive,
            workshop.totalDevicesProcessed,
            workshop.successfulRefurbishments,
            workshop.totalRevenue
        );
    }

    /**
     * @dev Get global refurbishment metrics
     */
    function getGlobalMetrics() external view returns (
        uint256 totalProcesses,
        uint256 successfulRefurbishments,
        uint256 failedRefurbishments,
        uint256 totalRevenue,
        uint256 totalCostSavings
    ) {
        return (
            globalMetrics.totalProcesses,
            globalMetrics.successfulRefurbishments,
            globalMetrics.failedRefurbishments,
            globalMetrics.totalRevenue,
            globalMetrics.totalCostSavings
        );
    }

    /**
     * @dev Get process history
     */
    function getProcessHistory(uint256 _processId) external view returns (string[] memory) {
        require(_processExists(_processId), "Process does not exist");
        return refurbishmentProcesses[_processId].processHistory;
    }

    /**
     * @dev Get process notes for a specific state
     */
    function getProcessNotes(uint256 _processId, string memory _state) external view returns (string memory) {
        require(_processExists(_processId), "Process does not exist");
        return processNotes[_processId][_state];
    }

    /**
     * @dev Update component cost
     */
    function updateComponentCost(ComponentType _component, uint256 _newCost) external onlyRole(PARTS_MANAGER_ROLE) {
        componentCosts[_component] = _newCost;
    }

    /**
     * @dev Update quality multiplier
     */
    function updateQualityMultiplier(QualityGrade _grade, uint256 _multiplier) external onlyRole(QUALITY_INSPECTOR_ROLE) {
        require(_multiplier <= 100, "Multiplier cannot exceed 100%");
        qualityMultipliers[_grade] = _multiplier;
    }

    /**
     * @dev Emergency function to mark process as failed
     */
    function emergencyFailProcess(uint256 _processId, string memory _reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_processExists(_processId), "Process does not exist");
        
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        require(!process.isCompleted, "Process already completed");
        
        process.currentState = RefurbishmentState.Failed;
        processNotes[_processId]["Failed"] = _reason;
        
        _completeRefurbishmentProcess(_processId, false);
    }

    /**
     * @dev Deactivate a workshop
     */
    function deactivateWorkshop(address _workshopAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(workshops[_workshopAddress].isActive, "Workshop not active");
        workshops[_workshopAddress].isActive = false;
        _revokeRole(REFURBISHMENT_OPERATOR_ROLE, _workshopAddress);
        
        emit WorkshopDeactivated(_workshopAddress);
    }

    /**
     * @dev Get all registered workshops
     */
    function getRegisteredWorkshops() external view returns (address[] memory) {
        return registeredWorkshops;
    }

    /**
     * @dev Get device's current refurbishment process ID
     */
    function getDeviceProcessId(uint256 _deviceId) external view returns (uint256) {
        return deviceToProcessId[_deviceId];
    }

    /**
     * @dev Get component cost
     */
    function getComponentCost(ComponentType _component) external view returns (uint256) {
        return componentCosts[_component];
    }

    /**
     * @dev Get quality multiplier
     */
    function getQualityMultiplier(QualityGrade _grade) external view returns (uint256) {
        return qualityMultipliers[_grade];
    }

    // Internal functions
    function _processExists(uint256 _processId) internal view returns (bool) {
        return _processId > 0 && _processId <= _processIdCounter;
    }

    function _isValidRefurbishmentStateTransition(RefurbishmentState _from, RefurbishmentState _to) internal pure returns (bool) {
        if (_from == RefurbishmentState.Received) {
            return _to == RefurbishmentState.InitialAssessment;
        } else if (_from == RefurbishmentState.InitialAssessment) {
            return _to == RefurbishmentState.Diagnosis || _to == RefurbishmentState.Failed;
        } else if (_from == RefurbishmentState.Diagnosis) {
            return _to == RefurbishmentState.PartsOrdering || _to == RefurbishmentState.Repair || _to == RefurbishmentState.Failed;
        } else if (_from == RefurbishmentState.PartsOrdering) {
            return _to == RefurbishmentState.Repair;
        } else if (_from == RefurbishmentState.Repair) {
            return _to == RefurbishmentState.QualityTesting;
        } else if (_from == RefurbishmentState.QualityTesting) {
            return _to == RefurbishmentState.FinalInspection || _to == RefurbishmentState.Repair || _to == RefurbishmentState.Failed;
        } else if (_from == RefurbishmentState.FinalInspection) {
            return _to == RefurbishmentState.Completed || _to == RefurbishmentState.Failed;
        }
        return false;
    }

    function _completeRefurbishmentProcess(uint256 _processId, bool _successful) internal {
        RefurbishmentProcess storage process = refurbishmentProcesses[_processId];
        process.isCompleted = true;
        process.isSuccessful = _successful;
        process.completionDate = block.timestamp;

        if (_successful) {
            // Update Nexus contract - DeviceState.Refurbished = 6
            nexusContract.changeDeviceState(process.deviceId, 6, "Refurbishment completed successfully");
            
            // Update metrics
            workshops[process.workshop].successfulRefurbishments++;
            globalMetrics.successfulRefurbishments++;
            
            uint256 deviceValue = _calculateRefurbishedValue(process.finalGrade);
            workshops[process.workshop].totalRevenue += deviceValue;
            globalMetrics.totalRevenue += deviceValue;
            
            // Calculate cost savings (estimated new device cost - refurbishment cost)
            uint256 newDeviceCost = 1000 * 10**18; // Estimated new device cost
            uint256 costSavings = newDeviceCost > process.actualCost ? newDeviceCost - process.actualCost : 0;
            globalMetrics.totalCostSavings += costSavings;
            
            // Update grade distribution
            workshopGradeDistribution[process.workshop][process.finalGrade]++;
            globalGradeDistribution[process.finalGrade]++;
        } else {
            // Update Nexus contract - DeviceState.Disposed = 8
            nexusContract.changeDeviceState(process.deviceId, 8, "Refurbishment failed - device disposed");
            
            globalMetrics.failedRefurbishments++;
        }

        emit ProcessCompleted(_processId, _successful, process.finalGrade, process.actualCost);
    }

    function _getRefurbishmentStateString(RefurbishmentState _state) internal pure returns (string memory) {
        if (_state == RefurbishmentState.Received) return "Received";
        if (_state == RefurbishmentState.InitialAssessment) return "InitialAssessment";
        if (_state == RefurbishmentState.Diagnosis) return "Diagnosis";
        if (_state == RefurbishmentState.PartsOrdering) return "PartsOrdering";
        if (_state == RefurbishmentState.Repair) return "Repair";
        if (_state == RefurbishmentState.QualityTesting) return "QualityTesting";
        if (_state == RefurbishmentState.FinalInspection) return "FinalInspection";
        if (_state == RefurbishmentState.Completed) return "Completed";
        if (_state == RefurbishmentState.Failed) return "Failed";
        return "Unknown";
    }

    function _getQualityGradeString(QualityGrade _grade) internal pure returns (string memory) {
        if (_grade == QualityGrade.Excellent) return "Excellent";
        if (_grade == QualityGrade.Good) return "Good";
        if (_grade == QualityGrade.Fair) return "Fair";
        if (_grade == QualityGrade.Poor) return "Poor";
        if (_grade == QualityGrade.Failed) return "Failed";
        return "Unknown";
    }

    function _initializeComponentCosts() internal {
        // Default component replacement costs in wei
        componentCosts[ComponentType.Battery] = 50 * 10**18; // 50 ETH
        componentCosts[ComponentType.Screen] = 100 * 10**18; // 100 ETH
        componentCosts[ComponentType.Motherboard] = 200 * 10**18; // 200 ETH
        componentCosts[ComponentType.Memory] = 30 * 10**18; // 30 ETH
        componentCosts[ComponentType.Storage] = 40 * 10**18; // 40 ETH
        componentCosts[ComponentType.Camera] = 25 * 10**18; // 25 ETH
        componentCosts[ComponentType.Speaker] = 10 * 10**18; // 10 ETH
        componentCosts[ComponentType.Microphone] = 5 * 10**18; // 5 ETH
        componentCosts[ComponentType.Charging] = 15 * 10**18; // 15 ETH
        componentCosts[ComponentType.Buttons] = 5 * 10**18; // 5 ETH
        componentCosts[ComponentType.Housing] = 30 * 10**18; // 30 ETH
        componentCosts[ComponentType.Other] = 10 * 10**18; // 10 ETH
    }

    function _initializeQualityMultipliers() internal {
        // Quality grade multipliers for market value (in percentage)
        qualityMultipliers[QualityGrade.Excellent] = 90; // 90% of new device value
        qualityMultipliers[QualityGrade.Good] = 70; // 70% of new device value
        qualityMultipliers[QualityGrade.Fair] = 50; // 50% of new device value
        qualityMultipliers[QualityGrade.Poor] = 30; // 30% of new device value
        qualityMultipliers[QualityGrade.Failed] = 0; // 0% - no market value
    }

    function _calculateRefurbishedValue(QualityGrade _grade) internal view returns (uint256) {
        uint256 baseDeviceValue = 1000 * 10**18; // Base device value in wei
        uint256 multiplier = qualityMultipliers[_grade];
        return (baseDeviceValue * multiplier) / 100;
    }

    function _toString(uint256 _value) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }
        uint256 temp = _value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
            _value /= 10;
        }
        return string(buffer);
    }
}