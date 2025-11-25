# Registration Request Validation Summary

## Implemented Validation Rules

### 1. Password Validation
- **Minimum Length**: 8 characters
- **Required Characters**:
  - At least 1 uppercase letter (A-Z)
  - At least 1 lowercase letter (a-z)
  - At least 1 number (0-9)
  - At least 1 special character (non-alphanumeric)

### 2. Email Validation
- Must end with `@gmail.com`
- Must be unique (not exist in Users or RegistrationRequests tables)
- Standard email format validation

### 3. Role-Based Field Requirements

#### Manager Role
- **Department**: Not required (can be left as None)
- **Company Name**: Required (user enters company name manually)
- **Validation**: Company name must NOT already exist in database

#### DeptManager Role
- **Department**: Required (must select from available departments)
- **Company Name**: Required (must select from existing companies in database)
- **Validation**: Selected company must exist in the Tenants table
- **Uniqueness**: Only one department manager allowed per company-department combination

#### Employee Role
- **Department**: Required (must select from available departments)
- **Company Name**: Required (must select from existing companies in database)
- **Validation**: Selected company must exist in the Tenants table

## API Endpoints

### Get Available Companies
```
GET /api/RegistrationRequest/companies
```
Returns list of available company names for DeptManager and Employee role selection.

### Registration Request Creation
```
POST /api/RegistrationRequest
```
Validates all rules before creating the registration request.

## Validation Implementation

### Files Modified:
1. `RegistrationRequestValidator.cs` - Enhanced password validation and added role-based validation
2. `RegistrationRequestDto.cs` - Updated password minimum length and removed conditional required attribute from Department
3. `RegistrationRequestService.cs` - Added validation calls in the service layer
4. `RegistrationRequestController.cs` - Added endpoint for getting available companies

### Validation Flow:
1. Email format and domain validation
2. Password strength validation
3. Role-based field requirement validation
4. Company existence validation (for DeptManager and Employee roles)
5. Business logic validation (duplicate manager/department manager checks)

## Error Messages:
- Password: "Password must be at least 8 characters long"
- Password: "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
- Email: "Email must end with @gmail.com"
- Email: "Email already exists in the system"
- Role-based: "Department selection is required for [Role] role"
- Role-based: "Company selection is required for [Role] role"
- Company: "Selected company '[CompanyName]' does not exist in the system"
- Manager Company: "Company '[CompanyName]' already exists in the system"
- DeptManager Uniqueness: "Department manager already exists for [Department] department in company '[CompanyName]'"