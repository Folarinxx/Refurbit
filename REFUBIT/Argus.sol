// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface INexus {
    function getDevice(uint256 _deviceId) external view returns (
        uint256, string memory, string memory, string memory, uint8, uint8, address, address, uint256, uint256, bool
    );
    function getTotalDevices() external view returns (uint256);
}

interface IVerdant {
    function getRecyclingProcess(uint256 _processId) external view returns (
        uint256, uint256, address, uint8, uint256, uint256, uint256, uint256, uint256, bool
    );
    function getFacility(address _facilityAddress) external view returns (
        string memory, string memory, bool, uint256, uint256, uint256, uint256, uint256
    );
}

interface IPhoenix {
    function getRefurbishmentProcess(uint256 _processId) external view returns (
        uint256, uint256, address, address, uint8, uint8, uint8, uint256, uint256, uint256, uint256, bool, bool
    );
    function getWorkshop(address _workshopAddress) external view returns (
        string memory, string memory, bool, uint256, uint256, uint256
    );
}

/**
 * @title Argus - Compliance Monitoring and Audit Oversight
 * @dev Manages compliance tracking, audit processes, and regulatory oversight for e-waste management
 * @notice This contract provides comprehensive compliance monitoring with role-based access control
 */
contract Argus is AccessControl {
    
    // =============================================================
    //                      REENTRANCY GUARD
    // =============================================================
    
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
    
    // =============================================================
    //                           ROLES
    // =============================================================
    
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");
    bytes32 public constant DATA_ANALYST_ROLE = keccak256("DATA_ANALYST_ROLE");

    // =============================================================
    //                           ENUMS
    // =============================================================
    
    enum ComplianceStandard {
        ISO14001,       // Environmental Management
        WEEE,           // Waste Electrical and Electronic Equipment
        RoHS,           // Restriction of Hazardous Substances
        GDPR,           // General Data Protection Regulation
        SOX,            // Sarbanes-Oxley Act
        ISO27001,       // Information Security Management
        OSHA,           // Occupational Safety and Health
        Custom
    }

    enum AuditType {
        Compliance,
        Environmental,
        Financial,
        Operational,
        Security,
        Quality,
        Regulatory
    }

    enum AuditStatus {
        Scheduled,
        InProgress,
        UnderReview,
        Completed,
        Failed,
        Suspended
    }

    enum ComplianceStatus {
        Compliant,
        NonCompliant,
        PartiallyCompliant,
        UnderReview,
        Expired,
        Pending
    }

    // =============================================================
    //                           STRUCTS
    // =============================================================
    
    struct ComplianceRecord {
        uint256 recordId;
        address entity;
        ComplianceStandard standard;
        ComplianceStatus status;
        uint256 certificationDate;
        uint256 expirationDate;
        string certificationBody;
        string certificateNumber;
        string[] requirements;
        mapping(string => bool) requirementStatus;
        string notes;
        address verifiedBy;
        uint256 lastAuditDate;
        uint256 nextAuditDue;
        bool isActive;
    }

    struct AuditProcess {
        uint256 auditId;
        AuditType auditType;
        address auditee;
        address[] auditors;
        AuditStatus status;
        uint256 scheduledDate;
        uint256 startDate;
        uint256 completionDate;
        string scope;
        string[] findings;
        mapping(string => string) findingDetails;
        uint256 complianceScore; // 0-100
        string[] recommendations;
        mapping(string => bool) actionItemStatus;
        string auditReport;
        bool isCompleted;
        bool passed;
    }

    struct RegulatoryRequirement {
        uint256 requirementId;
        string title;
        string description;
        ComplianceStandard standard;
        string jurisdiction;
        uint256 effectiveDate;
        bool isMandatory;
        uint256 penaltyAmount;
        string[] applicableEntities;
        bool isActive;
    }

    struct ComplianceAlert {
        uint256 alertId;
        address entity;
        string alertType;
        string message;
        uint256 severity; // 1-5 (5 being critical)
        uint256 createdDate;
        uint256 dueDate;
        bool isResolved;
        string resolution;
        address resolvedBy;
        uint256 resolvedDate;
    }

    struct ComplianceMetrics {
        uint256 totalEntitiesTracked;
        uint256 compliantEntities;
        uint256 nonCompliantEntities;
        uint256 totalAuditsCompleted;
        uint256 auditsPassed;
        uint256 auditsFailed;
        uint256 averageComplianceScore;
        uint256 activeAlerts;
        uint256 resolvedAlerts;
        mapping(ComplianceStandard => uint256) standardCompliance;
    }

    struct DataReport {
        uint256 reportId;
        string reportType;
        uint256 reportingPeriod;
        address requestedBy;
        uint256 generatedDate;
        string reportData;
        bool isPublic;
        string hash;
    }

    // =============================================================
    //                           STORAGE
    // =============================================================
    
    INexus public immutable nexusContract;
    IVerdant public immutable verdantContract;
    IPhoenix public immutable phoenixContract;
    
    // Counters
    uint256 private _recordIdCounter;
    uint256 private _auditIdCounter;
    uint256 private _requirementIdCounter;
    uint256 private _alertIdCounter;
    uint256 private _reportIdCounter;
    
    // Core mappings
    mapping(uint256 => ComplianceRecord) public complianceRecords;
    mapping(address => uint256[]) public entityRecords;
    mapping(uint256 => AuditProcess) public auditProcesses;
    mapping(address => uint256[]) public entityAudits;
    mapping(uint256 => RegulatoryRequirement) public regulatoryRequirements;
    mapping(uint256 => ComplianceAlert) public complianceAlerts;
    mapping(address => uint256[]) public entityAlerts;
    mapping(uint256 => DataReport) public dataReports;
    
    ComplianceMetrics public globalMetrics;
    
    // Configuration mappings
    mapping(ComplianceStandard => uint256) public complianceThresholds;
    mapping(AuditType => uint256) public auditFrequency; // in days
    mapping(address => bool) public authorizedAuditors;

    // Constants
    uint256 private constant DAYS_90 = 90 days;
    uint256 private constant DAYS_30 = 30 days;
    uint256 private constant DAYS_14 = 14 days;
    uint256 private constant MAX_COMPLIANCE_SCORE = 100;
    uint256 private constant MAX_SEVERITY = 5;

    // =============================================================
    //                           EVENTS
    // =============================================================
    
    event ComplianceRecordCreated(uint256 indexed recordId, address indexed entity, ComplianceStandard indexed standard);
    event ComplianceStatusUpdated(uint256 indexed recordId, ComplianceStatus indexed oldStatus, ComplianceStatus indexed newStatus);
    event AuditScheduled(uint256 indexed auditId, AuditType indexed auditType, address indexed auditee, uint256 scheduledDate);
    event AuditStarted(uint256 indexed auditId, address indexed auditor);
    event AuditCompleted(uint256 indexed auditId, bool passed, uint256 complianceScore);
    event ComplianceAlertCreated(uint256 indexed alertId, address indexed entity, string alertType, uint256 severity);
    event AlertResolved(uint256 indexed alertId, address indexed resolvedBy);
    event RegulatoryRequirementAdded(uint256 indexed requirementId, ComplianceStandard indexed standard, string title);
    event DataReportGenerated(uint256 indexed reportId, string reportType, address indexed requestedBy);
    event AuditorAuthorized(address indexed auditor);
    event AuditorRevoked(address indexed auditor);
    event RequirementStatusUpdated(uint256 indexed recordId, string requirement, bool status);

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================
    
    constructor(
        address _nexusContract,
        address _verdantContract,
        address _phoenixContract
    ) {
        if (_nexusContract == address(0)) revert InvalidAddress("Nexus");
        if (_verdantContract == address(0)) revert InvalidAddress("Verdant");
        if (_phoenixContract == address(0)) revert InvalidAddress("Phoenix");
        
        nexusContract = INexus(_nexusContract);
        verdantContract = IVerdant(_verdantContract);
        phoenixContract = IPhoenix(_phoenixContract);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, msg.sender);
        _grantRole(DATA_ANALYST_ROLE, msg.sender);

        // Initialize reentrancy guard
        _status = _NOT_ENTERED;

        _initializeComplianceParameters();
    }

    // =============================================================
    //                       CUSTOM ERRORS
    // =============================================================
    
    error InvalidAddress(string contractName);
    error InvalidDateRange();
    error RecordNotFound(uint256 recordId);
    error AuditNotFound(uint256 auditId);
    error UnauthorizedAuditor();
    error InvalidComplianceScore();
    error InvalidSeverity();
    error AlertNotFound(uint256 alertId);
    error AlertAlreadyResolved();
    error AuditNotInProgress();
    error AuditNotScheduled();
    error InvalidThreshold();
    error InvalidFrequency();
    error RequirementNotFound(uint256 requirementId);
    error ReportNotFound(uint256 reportId);
    error AccessDenied();

    // =============================================================
    //                    COMPLIANCE RECORDS
    // =============================================================
    
    /**
     * @dev Create a new compliance record
     * @param _entity The entity address being certified
     * @param _standard The compliance standard
     * @param _certificationDate Date of certification
     * @param _expirationDate Expiration date of certification
     * @param _certificationBody Name of certifying body
     * @param _certificateNumber Certificate number
     * @param _requirements Array of requirements
     * @return recordId The ID of the created record
     */
    function createComplianceRecord(
        address _entity,
        ComplianceStandard _standard,
        uint256 _certificationDate,
        uint256 _expirationDate,
        string calldata _certificationBody,
        string calldata _certificateNumber,
        string[] calldata _requirements
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) nonReentrant returns (uint256) {
        if (_entity == address(0)) revert InvalidAddress("Entity");
        if (_expirationDate <= _certificationDate) revert InvalidDateRange();

        uint256 recordId = ++_recordIdCounter;

        ComplianceRecord storage record = complianceRecords[recordId];
        record.recordId = recordId;
        record.entity = _entity;
        record.standard = _standard;
        record.status = ComplianceStatus.Compliant;
        record.certificationDate = _certificationDate;
        record.expirationDate = _expirationDate;
        record.certificationBody = _certificationBody;
        record.certificateNumber = _certificateNumber;
        record.requirements = _requirements;
        record.verifiedBy = msg.sender;
        record.nextAuditDue = _certificationDate + auditFrequency[AuditType.Compliance];
        record.isActive = true;

        // Initialize requirement statuses
        for (uint256 i = 0; i < _requirements.length; i++) {
            record.requirementStatus[_requirements[i]] = true;
        }

        entityRecords[_entity].push(recordId);
        
        // Update metrics
        unchecked {
            globalMetrics.totalEntitiesTracked++;
            globalMetrics.compliantEntities++;
            globalMetrics.standardCompliance[_standard]++;
        }

        emit ComplianceRecordCreated(recordId, _entity, _standard);
        return recordId;
    }

    /**
     * @dev Update compliance status of a record
     * @param _recordId ID of the compliance record
     * @param _newStatus New compliance status
     * @param _notes Additional notes
     */
    function updateComplianceStatus(
        uint256 _recordId,
        ComplianceStatus _newStatus,
        string calldata _notes
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);

        ComplianceRecord storage record = complianceRecords[_recordId];
        ComplianceStatus oldStatus = record.status;
        record.status = _newStatus;
        record.notes = _notes;

        // Update global metrics
        _updateMetricsOnStatusChange(oldStatus, _newStatus);

        // Create alert for non-compliance
        if (_newStatus == ComplianceStatus.NonCompliant) {
            _createComplianceAlert(
                record.entity,
                "Compliance Violation",
                "Entity is non-compliant with standard",
                4, // High severity
                block.timestamp + DAYS_30
            );
        }

        emit ComplianceStatusUpdated(_recordId, oldStatus, _newStatus);
    }

    // =============================================================
    //                       AUDIT MANAGEMENT
    // =============================================================
    
    /**
     * @dev Schedule an audit
     * @param _auditType Type of audit
     * @param _auditee Entity being audited
     * @param _auditors Array of auditor addresses
     * @param _scheduledDate Scheduled date for audit
     * @param _scope Scope of the audit
     * @return auditId The ID of the scheduled audit
     */
    function scheduleAudit(
        AuditType _auditType,
        address _auditee,
        address[] calldata _auditors,
        uint256 _scheduledDate,
        string calldata _scope
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) returns (uint256) {
        if (_auditee == address(0)) revert InvalidAddress("Auditee");
        if (_auditors.length == 0) revert UnauthorizedAuditor();
        if (_scheduledDate <= block.timestamp) revert InvalidDateRange();

        // Verify auditors are authorized
        for (uint256 i = 0; i < _auditors.length; i++) {
            if (!authorizedAuditors[_auditors[i]] && !hasRole(AUDITOR_ROLE, _auditors[i])) {
                revert UnauthorizedAuditor();
            }
        }

        uint256 auditId = ++_auditIdCounter;

        AuditProcess storage audit = auditProcesses[auditId];
        audit.auditId = auditId;
        audit.auditType = _auditType;
        audit.auditee = _auditee;
        audit.auditors = _auditors;
        audit.status = AuditStatus.Scheduled;
        audit.scheduledDate = _scheduledDate;
        audit.scope = _scope;

        entityAudits[_auditee].push(auditId);

        emit AuditScheduled(auditId, _auditType, _auditee, _scheduledDate);
        return auditId;
    }

    /**
     * @dev Start an audit
     * @param _auditId ID of the audit to start
     */
    function startAudit(uint256 _auditId) external onlyRole(AUDITOR_ROLE) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);

        AuditProcess storage audit = auditProcesses[_auditId];
        if (audit.status != AuditStatus.Scheduled) revert AuditNotScheduled();
        if (!_isAuthorizedAuditor(_auditId, msg.sender)) revert UnauthorizedAuditor();

        audit.status = AuditStatus.InProgress;
        audit.startDate = block.timestamp;

        emit AuditStarted(_auditId, msg.sender);
    }

    /**
     * @dev Record audit findings
     * @param _auditId ID of the audit
     * @param _finding The finding description
     * @param _details Detailed description of the finding
     * @param _recommendation Recommendation for the finding
     */
    function recordAuditFinding(
        uint256 _auditId,
        string calldata _finding,
        string calldata _details,
        string calldata _recommendation
    ) external onlyRole(AUDITOR_ROLE) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);

        AuditProcess storage audit = auditProcesses[_auditId];
        if (audit.status != AuditStatus.InProgress) revert AuditNotInProgress();
        if (!_isAuthorizedAuditor(_auditId, msg.sender)) revert UnauthorizedAuditor();

        audit.findings.push(_finding);
        audit.findingDetails[_finding] = _details;
        audit.recommendations.push(_recommendation);
    }

    /**
     * @dev Complete an audit
     * @param _auditId ID of the audit
     * @param _complianceScore Compliance score (0-100)
     * @param _passed Whether the audit passed
     * @param _auditReport Final audit report
     */
    function completeAudit(
        uint256 _auditId,
        uint256 _complianceScore,
        bool _passed,
        string calldata _auditReport
    ) external onlyRole(AUDITOR_ROLE) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        if (_complianceScore > MAX_COMPLIANCE_SCORE) revert InvalidComplianceScore();

        AuditProcess storage audit = auditProcesses[_auditId];
        if (audit.status != AuditStatus.InProgress) revert AuditNotInProgress();
        if (!_isAuthorizedAuditor(_auditId, msg.sender)) revert UnauthorizedAuditor();

        audit.status = AuditStatus.Completed;
        audit.completionDate = block.timestamp;
        audit.complianceScore = _complianceScore;
        audit.passed = _passed;
        audit.auditReport = _auditReport;
        audit.isCompleted = true;

        // Update global metrics
        unchecked {
            globalMetrics.totalAuditsCompleted++;
            if (_passed) {
                globalMetrics.auditsPassed++;
            } else {
                globalMetrics.auditsFailed++;
            }

            // Update average compliance score
            globalMetrics.averageComplianceScore = 
                (globalMetrics.averageComplianceScore * (globalMetrics.totalAuditsCompleted - 1) + _complianceScore) / 
                globalMetrics.totalAuditsCompleted;
        }

        // Create alerts for failed audits or low scores
        if (!_passed || _complianceScore < complianceThresholds[ComplianceStandard.ISO14001]) {
            _createComplianceAlert(
                audit.auditee,
                "Audit Failure",
                "Audit failed or scored below threshold",
                5, // Critical severity
                block.timestamp + DAYS_14
            );
        }

        // Update next audit due date for the entity
        _updateNextAuditDue(audit.auditee, audit.auditType);

        emit AuditCompleted(_auditId, _passed, _complianceScore);
    }

    // =============================================================
    //                    REGULATORY REQUIREMENTS
    // =============================================================
    
    /**
     * @dev Add a new regulatory requirement
     * @param _title Title of the requirement
     * @param _description Description of the requirement
     * @param _standard Associated compliance standard
     * @param _jurisdiction Applicable jurisdiction
     * @param _effectiveDate When the requirement becomes effective
     * @param _isMandatory Whether compliance is mandatory
     * @param _penaltyAmount Penalty amount for non-compliance
     * @param _applicableEntities Types of entities this applies to
     * @return requirementId The ID of the created requirement
     */
    function addRegulatoryRequirement(
        string calldata _title,
        string calldata _description,
        ComplianceStandard _standard,
        string calldata _jurisdiction,
        uint256 _effectiveDate,
        bool _isMandatory,
        uint256 _penaltyAmount,
        string[] calldata _applicableEntities
    ) external onlyRole(REGULATOR_ROLE) returns (uint256) {
        uint256 requirementId = ++_requirementIdCounter;

        RegulatoryRequirement storage requirement = regulatoryRequirements[requirementId];
        requirement.requirementId = requirementId;
        requirement.title = _title;
        requirement.description = _description;
        requirement.standard = _standard;
        requirement.jurisdiction = _jurisdiction;
        requirement.effectiveDate = _effectiveDate;
        requirement.isMandatory = _isMandatory;
        requirement.penaltyAmount = _penaltyAmount;
        requirement.applicableEntities = _applicableEntities;
        requirement.isActive = true;

        emit RegulatoryRequirementAdded(requirementId, _standard, _title);
        return requirementId;
    }

    // =============================================================
    //                        MONITORING
    // =============================================================
    
    /**
     * @dev Run automated compliance monitoring
     * @notice Checks for expiring certifications, overdue audits, and updates metrics
     */
    function runComplianceMonitoring() external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        _checkExpiringCertifications();
        _checkOverdueAudits();
        _validateCrossContractCompliance();
        _updateComplianceMetrics();
    }

    /**
     * @dev Resolve a compliance alert
     * @param _alertId ID of the alert to resolve
     * @param _resolution Description of the resolution
     */
    function resolveAlert(
        uint256 _alertId,
        string calldata _resolution
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        if (_alertId == 0 || _alertId > _alertIdCounter) revert AlertNotFound(_alertId);
        
        ComplianceAlert storage alert = complianceAlerts[_alertId];
        if (alert.isResolved) revert AlertAlreadyResolved();

        alert.isResolved = true;
        alert.resolution = _resolution;
        alert.resolvedBy = msg.sender;
        alert.resolvedDate = block.timestamp;

        unchecked {
            globalMetrics.activeAlerts--;
            globalMetrics.resolvedAlerts++;
        }

        emit AlertResolved(_alertId, msg.sender);
    }

    // =============================================================
    //                    REPORTING
    // =============================================================
    
    /**
     * @dev Generate a compliance report
     * @param _reportType Type of report to generate
     * @param _reportingPeriod Period covered by the report
     * @param _isPublic Whether the report should be public
     * @return reportId The ID of the generated report
     */
    function generateComplianceReport(
        string calldata _reportType,
        uint256 _reportingPeriod,
        bool _isPublic
    ) external onlyRole(DATA_ANALYST_ROLE) returns (uint256) {
        uint256 reportId = ++_reportIdCounter;

        string memory reportData = _compileReportData(_reportType, _reportingPeriod);
        string memory reportHash = _generateReportHash(reportData);

        DataReport storage report = dataReports[reportId];
        report.reportId = reportId;
        report.reportType = _reportType;
        report.reportingPeriod = _reportingPeriod;
        report.requestedBy = msg.sender;
        report.generatedDate = block.timestamp;
        report.reportData = reportData;
        report.isPublic = _isPublic;
        report.hash = reportHash;

        emit DataReportGenerated(reportId, _reportType, msg.sender);
        return reportId;
    }

    // =============================================================
    //                   CONFIGURATION
    // =============================================================
    
    /**
     * @dev Authorize an auditor
     * @param _auditor Address of the auditor to authorize
     */
    function authorizeAuditor(address _auditor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_auditor == address(0)) revert InvalidAddress("Auditor");
        authorizedAuditors[_auditor] = true;
        emit AuditorAuthorized(_auditor);
    }

    /**
     * @dev Revoke auditor authorization
     * @param _auditor Address of the auditor to revoke
     */
    function revokeAuditorAuthorization(address _auditor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authorizedAuditors[_auditor] = false;
        emit AuditorRevoked(_auditor);
    }

    /**
     * @dev Update compliance threshold for a standard
     * @param _standard The compliance standard
     * @param _threshold New threshold value (0-100)
     */
    function updateComplianceThreshold(
        ComplianceStandard _standard,
        uint256 _threshold
    ) external onlyRole(REGULATOR_ROLE) {
        if (_threshold > MAX_COMPLIANCE_SCORE) revert InvalidThreshold();
        complianceThresholds[_standard] = _threshold;
    }

    /**
     * @dev Update audit frequency for an audit type
     * @param _auditType The audit type
     * @param _frequency New frequency in days
     */
    function updateAuditFrequency(
        AuditType _auditType,
        uint256 _frequency
    ) external onlyRole(REGULATOR_ROLE) {
        if (_frequency == 0) revert InvalidFrequency();
        auditFrequency[_auditType] = _frequency;
    }

    // =============================================================
    //                    VIEW FUNCTIONS
    // =============================================================
    
    /**
     * @dev Get compliance record details
     */
    function getComplianceRecord(uint256 _recordId) external view returns (
        uint256 recordId,
        address entity,
        ComplianceStandard standard,
        ComplianceStatus status,
        uint256 certificationDate,
        uint256 expirationDate,
        string memory certificationBody,
        string memory certificateNumber,
        address verifiedBy,
        uint256 nextAuditDue,
        bool isActive
    ) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);
        
        ComplianceRecord storage record = complianceRecords[_recordId];
        return (
            record.recordId,
            record.entity,
            record.standard,
            record.status,
            record.certificationDate,
            record.expirationDate,
            record.certificationBody,
            record.certificateNumber,
            record.verifiedBy,
            record.nextAuditDue,
            record.isActive
        );
    }

    /**
     * @dev Get audit process details
     */
    function getAuditProcess(uint256 _auditId) external view returns (
        uint256 auditId,
        AuditType auditType,
        address auditee,
        AuditStatus status,
        uint256 scheduledDate,
        uint256 startDate,
        uint256 completionDate,
        uint256 complianceScore,
        bool isCompleted,
        bool passed
    ) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        
        AuditProcess storage audit = auditProcesses[_auditId];
        return (
            audit.auditId,
            audit.auditType,
            audit.auditee,
            audit.status,
            audit.scheduledDate,
            audit.startDate,
            audit.completionDate,
            audit.complianceScore,
            audit.isCompleted,
            audit.passed
        );
    }

    /**
     * @dev Get global compliance metrics
     */
    function getGlobalMetrics() external view returns (
        uint256 totalEntitiesTracked,
        uint256 compliantEntities,
        uint256 nonCompliantEntities,
        uint256 totalAuditsCompleted,
        uint256 auditsPassed,
        uint256 auditsFailed,
        uint256 averageComplianceScore,
        uint256 activeAlerts,
        uint256 resolvedAlerts
    ) {
        return (
            globalMetrics.totalEntitiesTracked,
            globalMetrics.compliantEntities,
            globalMetrics.nonCompliantEntities,
            globalMetrics.totalAuditsCompleted,
            globalMetrics.auditsPassed,
            globalMetrics.auditsFailed,
            globalMetrics.averageComplianceScore,
            globalMetrics.activeAlerts,
            globalMetrics.resolvedAlerts
        );
    }

    /**
     * @dev Get entity's compliance records
     */
    function getEntityRecords(address _entity) external view returns (uint256[] memory) {
        return entityRecords[_entity];
    }

    /**
     * @dev Get entity's audits
     */
    function getEntityAudits(address _entity) external view returns (uint256[] memory) {
        return entityAudits[_entity];
    }

    /**
     * @dev Get entity's alerts
     */
    function getEntityAlerts(address _entity) external view returns (uint256[] memory) {
        return entityAlerts[_entity];
    }

    /**
     * @dev Get current counter values
     */
    function getCurrentCounters() external view returns (
        uint256 recordCount,
        uint256 auditCount,
        uint256 requirementCount,
        uint256 alertCount,
        uint256 reportCount
    ) {
        return (
            _recordIdCounter,
            _auditIdCounter,
            _requirementIdCounter,
            _alertIdCounter,
            _reportIdCounter
        );
    }

    // =============================================================
    //                   INTERNAL FUNCTIONS
    // =============================================================
    
    function _recordExists(uint256 _recordId) internal view returns (bool) {
        return _recordId > 0 && _recordId <= _recordIdCounter;
    }

    function _auditExists(uint256 _auditId) internal view returns (bool) {
        return _auditId > 0 && _auditId <= _auditIdCounter;
    }

    function _isAuthorizedAuditor(uint256 _auditId, address _auditor) internal view returns (bool) {
        AuditProcess storage audit = auditProcesses[_auditId];
        for (uint256 i = 0; i < audit.auditors.length; i++) {
            if (audit.auditors[i] == _auditor) {
                return true;
            }
        }
        return false;
    }

    function _createComplianceAlert(
        address _entity,
        string memory _alertType,
        string memory _message,
        uint256 _severity,
        uint256 _dueDate
    ) internal returns (uint256) {
        if (_severity > MAX_SEVERITY) revert InvalidSeverity();
        
        uint256 alertId = ++_alertIdCounter;

        ComplianceAlert storage alert = complianceAlerts[alertId];
        alert.alertId = alertId;
        alert.entity = _entity;
        alert.alertType = _alertType;
        alert.message = _message;
        alert.severity = _severity;
        alert.createdDate = block.timestamp;
        alert.dueDate = _dueDate;
        alert.isResolved = false;

        entityAlerts[_entity].push(alertId);
        
        unchecked {
            globalMetrics.activeAlerts++;
        }

        emit ComplianceAlertCreated(alertId, _entity, _alertType, _severity);
        return alertId;
    }

    function _updateNextAuditDue(address _entity, AuditType _auditType) internal {
        uint256[] storage records = entityRecords[_entity];
        uint256 nextDue = block.timestamp + auditFrequency[_auditType];
        
        for (uint256 i = 0; i < records.length; i++) {
            ComplianceRecord storage record = complianceRecords[records[i]];
            if (record.isActive) {
                record.nextAuditDue = nextDue;
                record.lastAuditDate = block.timestamp;
            }
        }
    }

    function _updateMetricsOnStatusChange(
        ComplianceStatus _oldStatus, 
        ComplianceStatus _newStatus
    ) internal {
        if (_oldStatus == ComplianceStatus.Compliant && _newStatus != ComplianceStatus.Compliant) {
            unchecked {
                globalMetrics.compliantEntities--;
                globalMetrics.nonCompliantEntities++;
            }
        } else if (_oldStatus != ComplianceStatus.Compliant && _newStatus == ComplianceStatus.Compliant) {
            unchecked {
                globalMetrics.compliantEntities++;
                if (globalMetrics.nonCompliantEntities > 0) {
                    globalMetrics.nonCompliantEntities--;
                }
            }
        }
    }

    function _checkExpiringCertifications() internal {
        uint256 threshold = block.timestamp + DAYS_90;
        
        for (uint256 i = 1; i <= _recordIdCounter; i++) {
            ComplianceRecord storage record = complianceRecords[i];
            if (record.isActive && record.expirationDate <= threshold && record.expirationDate > block.timestamp) {
                _createComplianceAlert(
                    record.entity,
                    "Certification Expiring",
                    "Certification will expire within 90 days",
                    3, // Medium severity
                    record.expirationDate
                );
            }
        }
    }

    function _checkOverdueAudits() internal {
        for (uint256 i = 1; i <= _recordIdCounter; i++) {
            ComplianceRecord storage record = complianceRecords[i];
            if (record.isActive && block.timestamp > record.nextAuditDue) {
                _createComplianceAlert(
                    record.entity,
                    "Audit Overdue",
                    "Scheduled audit is overdue",
                    4, // High severity
                    block.timestamp + DAYS_30
                );
            }
        }
    }

    function _validateCrossContractCompliance() internal view {
        uint256 totalDevices = nexusContract.getTotalDevices();
        
        if (totalDevices > 0) {
            // Cross-contract validation logic can be implemented here
            // For now, this is a placeholder for future enhancements
        }
    }

    function _updateComplianceMetrics() internal {
        uint256 compliant = 0;
        uint256 nonCompliant = 0;
        
        for (uint256 i = 1; i <= _recordIdCounter; i++) {
            ComplianceRecord storage record = complianceRecords[i];
            if (record.isActive) {
                if (record.status == ComplianceStatus.Compliant) {
                    unchecked { compliant++; }
                } else if (record.status == ComplianceStatus.NonCompliant) {
                    unchecked { nonCompliant++; }
                }
            }
        }
        
        globalMetrics.compliantEntities = compliant;
        globalMetrics.nonCompliantEntities = nonCompliant;
    }

    function _compileReportData(
        string memory _reportType, 
        uint256 _reportingPeriod
    ) internal view returns (string memory) {
        bytes32 reportTypeHash = keccak256(bytes(_reportType));
        
        if (reportTypeHash == keccak256(bytes("Compliance Summary"))) {
            return string(abi.encodePacked(
                "Period: ", _toString(_reportingPeriod),
                ", Compliant: ", _toString(globalMetrics.compliantEntities),
                ", Non-Compliant: ", _toString(globalMetrics.nonCompliantEntities),
                ", Total Audits: ", _toString(globalMetrics.totalAuditsCompleted),
                ", Avg Score: ", _toString(globalMetrics.averageComplianceScore)
            ));
        } else if (reportTypeHash == keccak256(bytes("Audit Summary"))) {
            return string(abi.encodePacked(
                "Period: ", _toString(_reportingPeriod),
                ", Passed: ", _toString(globalMetrics.auditsPassed),
                ", Failed: ", _toString(globalMetrics.auditsFailed),
                ", Success Rate: ", _toString(_calculateSuccessRate()),
                ", Active Alerts: ", _toString(globalMetrics.activeAlerts)
            ));
        }
        return "Standard compliance report data";
    }

    function _calculateSuccessRate() internal view returns (uint256) {
        if (globalMetrics.totalAuditsCompleted == 0) return 0;
        return (globalMetrics.auditsPassed * 100) / globalMetrics.totalAuditsCompleted;
    }

    function _generateReportHash(string memory _reportData) internal pure returns (string memory) {
        return _bytes32ToString(keccak256(bytes(_reportData)));
    }

    function _initializeComplianceParameters() internal {
        // Initialize compliance thresholds
        complianceThresholds[ComplianceStandard.ISO14001] = 75;
        complianceThresholds[ComplianceStandard.WEEE] = 80;
        complianceThresholds[ComplianceStandard.RoHS] = 90;
        complianceThresholds[ComplianceStandard.GDPR] = 85;
        complianceThresholds[ComplianceStandard.SOX] = 95;
        complianceThresholds[ComplianceStandard.ISO27001] = 80;
        complianceThresholds[ComplianceStandard.OSHA] = 85;
        complianceThresholds[ComplianceStandard.Custom] = 70;

        // Initialize audit frequencies (in days)
        auditFrequency[AuditType.Compliance] = 365; // Annual
        auditFrequency[AuditType.Environmental] = 180; // Semi-annual
        auditFrequency[AuditType.Financial] = 90; // Quarterly
        auditFrequency[AuditType.Operational] = 180; // Semi-annual
        auditFrequency[AuditType.Security] = 90; // Quarterly
        auditFrequency[AuditType.Quality] = 180; // Semi-annual
        auditFrequency[AuditType.Regulatory] = 365; // Annual
    }

    // =============================================================
    //                    UTILITY FUNCTIONS
    // =============================================================
    
    function _toString(uint256 _value) internal pure returns (string memory) {
        if (_value == 0) return "0";
        
        uint256 temp = _value;
        uint256 digits;
        
        while (temp != 0) {
            unchecked {
                digits++;
                temp /= 10;
            }
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (_value != 0) {
            unchecked {
                digits--;
                buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
                _value /= 10;
            }
        }
        
        return string(buffer);
    }

    function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            unchecked { i++; }
        }
        
        bytes memory bytesArray = new bytes(i);
        for (uint8 j = 0; j < i;) {
            bytesArray[j] = _bytes32[j];
            unchecked { j++; }
        }
        
        return string(bytesArray);
    }

    // =============================================================
    //                  ADDITIONAL VIEW FUNCTIONS
    // =============================================================
    
    /**
     * @dev Get compliance alert details
     */
    function getComplianceAlert(uint256 _alertId) external view returns (
        uint256 alertId,
        address entity,
        string memory alertType,
        string memory message,
        uint256 severity,
        uint256 createdDate,
        uint256 dueDate,
        bool isResolved,
        string memory resolution,
        address resolvedBy,
        uint256 resolvedDate
    ) {
        if (_alertId == 0 || _alertId > _alertIdCounter) revert AlertNotFound(_alertId);
        
        ComplianceAlert storage alert = complianceAlerts[_alertId];
        return (
            alert.alertId,
            alert.entity,
            alert.alertType,
            alert.message,
            alert.severity,
            alert.createdDate,
            alert.dueDate,
            alert.isResolved,
            alert.resolution,
            alert.resolvedBy,
            alert.resolvedDate
        );
    }

    /**
     * @dev Get regulatory requirement details
     */
    function getRegulatoryRequirement(uint256 _requirementId) external view returns (
        uint256 requirementId,
        string memory title,
        string memory description,
        ComplianceStandard standard,
        string memory jurisdiction,
        uint256 effectiveDate,
        bool isMandatory,
        uint256 penaltyAmount,
        bool isActive
    ) {
        if (_requirementId == 0 || _requirementId > _requirementIdCounter) {
            revert RequirementNotFound(_requirementId);
        }
        
        RegulatoryRequirement storage requirement = regulatoryRequirements[_requirementId];
        return (
            requirement.requirementId,
            requirement.title,
            requirement.description,
            requirement.standard,
            requirement.jurisdiction,
            requirement.effectiveDate,
            requirement.isMandatory,
            requirement.penaltyAmount,
            requirement.isActive
        );
    }

    /**
     * @dev Get data report details
     */
    function getDataReport(uint256 _reportId) external view returns (
        uint256 reportId,
        string memory reportType,
        uint256 reportingPeriod,
        address requestedBy,
        uint256 generatedDate,
        string memory reportData,
        bool isPublic,
        string memory hash
    ) {
        if (_reportId == 0 || _reportId > _reportIdCounter) revert ReportNotFound(_reportId);
        
        DataReport storage report = dataReports[_reportId];
        
        if (!report.isPublic && 
            !hasRole(DATA_ANALYST_ROLE, msg.sender) && 
            report.requestedBy != msg.sender) {
            revert AccessDenied();
        }
        
        return (
            report.reportId,
            report.reportType,
            report.reportingPeriod,
            report.requestedBy,
            report.generatedDate,
            report.reportData,
            report.isPublic,
            report.hash
        );
    }

    /**
     * @dev Get audit findings for a specific audit
     */
    function getAuditFindings(uint256 _auditId) external view returns (
        string[] memory findings,
        string[] memory recommendations
    ) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        
        AuditProcess storage audit = auditProcesses[_auditId];
        return (audit.findings, audit.recommendations);
    }

    /**
     * @dev Get specific audit finding details
     */
    function getAuditFindingDetails(
        uint256 _auditId, 
        string calldata _finding
    ) external view returns (string memory) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        
        AuditProcess storage audit = auditProcesses[_auditId];
        return audit.findingDetails[_finding];
    }

    /**
     * @dev Get compliance record requirements
     */
    function getComplianceRequirements(uint256 _recordId) external view returns (string[] memory) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);
        
        ComplianceRecord storage record = complianceRecords[_recordId];
        return record.requirements;
    }

    /**
     * @dev Get requirement status for a compliance record
     */
    function getRequirementStatus(
        uint256 _recordId, 
        string calldata _requirement
    ) external view returns (bool) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);
        
        ComplianceRecord storage record = complianceRecords[_recordId];
        return record.requirementStatus[_requirement];
    }

    /**
     * @dev Get compliance standard metrics
     */
    function getStandardCompliance(ComplianceStandard _standard) external view returns (uint256) {
        return globalMetrics.standardCompliance[_standard];
    }

    /**
     * @dev Get audit report
     */
    function getAuditReport(uint256 _auditId) external view returns (string memory) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        
        AuditProcess storage audit = auditProcesses[_auditId];
        if (!audit.isCompleted) revert AuditNotInProgress();
        
        return audit.auditReport;
    }

    // =============================================================
    //                 ADDITIONAL MANAGEMENT FUNCTIONS
    // =============================================================
    
    /**
     * @dev Update requirement status for a compliance record
     */
    function updateRequirementStatus(
        uint256 _recordId,
        string calldata _requirement,
        bool _status
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);
        
        ComplianceRecord storage record = complianceRecords[_recordId];
        record.requirementStatus[_requirement] = _status;
        
        // Check if all requirements are met
        bool allMet = true;
        for (uint256 i = 0; i < record.requirements.length; i++) {
            if (!record.requirementStatus[record.requirements[i]]) {
                allMet = false;
                break;
            }
        }
        
        // Update compliance status based on requirement status
        if (!allMet && record.status == ComplianceStatus.Compliant) {
            record.status = ComplianceStatus.PartiallyCompliant;
        } else if (allMet && record.status == ComplianceStatus.PartiallyCompliant) {
            record.status = ComplianceStatus.Compliant;
        }

        emit RequirementStatusUpdated(_recordId, _requirement, _status);
    }

    /**
     * @dev Emergency suspend audit
     */
    function emergencySuspendAudit(
        uint256 _auditId, 
        string calldata _reason
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        
        AuditProcess storage audit = auditProcesses[_auditId];
        if (audit.status != AuditStatus.InProgress && audit.status != AuditStatus.Scheduled) {
            revert AuditNotInProgress();
        }
        
        audit.status = AuditStatus.Suspended;
        audit.findingDetails["Suspension Reason"] = _reason;
    }

    /**
     * @dev Deactivate a compliance record
     */
    function deactivateComplianceRecord(uint256 _recordId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_recordExists(_recordId)) revert RecordNotFound(_recordId);
        complianceRecords[_recordId].isActive = false;
    }

    /**
     * @dev Batch create compliance alerts
     */
    function batchCreateAlerts(
        address[] calldata _entities,
        string calldata _alertType,
        string calldata _message,
        uint256 _severity,
        uint256 _dueDate
    ) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        if (_entities.length == 0) revert InvalidAddress("Entities");
        
        for (uint256 i = 0; i < _entities.length; i++) {
            _createComplianceAlert(_entities[i], _alertType, _message, _severity, _dueDate);
        }
    }

    /**
     * @dev Update audit report
     */
    function updateAuditReport(
        uint256 _auditId, 
        string calldata _report
    ) external onlyRole(AUDITOR_ROLE) {
        if (!_auditExists(_auditId)) revert AuditNotFound(_auditId);
        if (!_isAuthorizedAuditor(_auditId, msg.sender)) revert UnauthorizedAuditor();
        
        AuditProcess storage audit = auditProcesses[_auditId];
        if (audit.status != AuditStatus.Completed) revert AuditNotInProgress();
        
        audit.auditReport = _report;
    }
}