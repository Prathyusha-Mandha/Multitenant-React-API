import { useState, useEffect } from 'react';
import { adminService } from '../services';

export default function useRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getRegistrationRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId: string, status: string) => {
    setUpdating(true);
    await adminService.updateRegistrationStatus(requestId, status);
    await fetchRequests();
    setUpdating(false);
  };

  return {
    requests,
    filteredRequests,
    loading,
    updating,
    setFilteredRequests,
    handleStatusUpdate
  };
}