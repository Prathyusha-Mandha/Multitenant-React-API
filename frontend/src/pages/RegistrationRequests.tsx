import { useState, useEffect } from 'react';
import { adminService } from '../services';
import { SearchFilter } from '../components/Common';

interface RegistrationRequest {
  id: string;
  userName: string;
  email: string;
  role: number;
  department: number;
  companyName: string;
  status: string;
  createdAt: string;
}

function RegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<RegistrationRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await adminService.getRegistrationRequests();
      setRequests(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      await adminService.updateRegistrationStatus(requestId, status);
      fetchRequests();
    } catch (error) {
    }
  };

  const getRoleName = (role: number) => {
    switch (role) {
      case 1: return 'Manager';
      case 2: return 'Department Manager';
      case 3: return 'Employee';
      default: return 'Unknown';
    }
  };

  const getDepartmentName = (department: number) => {
    switch (department) {
      case 1: return 'HR';
      case 2: return 'IT';
      case 3: return 'Sales';
      case 4: return 'Marketing';
      case 5: return 'Finance';
      case 6: return 'Customer Support';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Registration Requests ({filteredRequests.length})</h2>
      <SearchFilter 
        data={requests}
        onFilter={setFilteredRequests}
        searchFields={[
          { key: 'userName', label: 'User Name' },
          { key: 'email', label: 'Email' },
          { key: 'companyName', label: 'Company' },
          { key: 'status', label: 'Status' }
        ]}
      />
      <div className="row">
        {filteredRequests.map((request) => (
          <div key={request.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{request.userName}</h5>
                <span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Approved' ? 'bg-success' : 'bg-danger'}`}>
                  {request.status}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <i className="bi bi-envelope me-2"></i>
                  {request.email}
                </p>
                <p className="card-text">
                  <i className="bi bi-briefcase me-2"></i>
                  {getRoleName(request.role)}
                </p>
                <p className="card-text">
                  <i className="bi bi-building me-2"></i>
                  {getDepartmentName(request.department)}
                </p>
                <p className="card-text">
                  <i className="bi bi-buildings me-2"></i>
                  {request.companyName}
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </small>
                </p>
              </div>
              {request.status === 'Pending' && (
                <div className="card-footer">
                  <div className="d-grid gap-2 d-md-flex">
                    <button 
                      className="btn btn-success btn-sm flex-fill"
                      onClick={() => handleStatusUpdate(request.id, 'Approved')}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Accept
                    </button>
                    <button 
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredRequests.length === 0 && requests.length > 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search fs-1 text-muted"></i>
          <h4 className="text-muted mt-3">No requests match your search</h4>
        </div>
      )}
      {requests.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <h4 className="text-muted mt-3">No registration requests found</h4>
        </div>
      )}
    </div>
  );
}

export default RegistrationRequests;