import { adminService } from '../services';

let cachedResult: string[] | null = null;
const pendingRequests = new Map<string, Promise<string[]>>();

export const getDepartments = async (): Promise<string[]> => {
  if (cachedResult) return cachedResult;
  
  const key = 'departments';
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  const promise = fetchDepartments();
  pendingRequests.set(key, promise);
  
  try {
    const result = await promise;
    cachedResult = result;
    return result;
  } finally {
    pendingRequests.delete(key);
  }
};

const fetchDepartments = async (): Promise<string[]> => {
  try {
    const tenantNames = await adminService.getTenantNames();
    const departmentArrays = await Promise.all(
      tenantNames.map(name => adminService.getTenantDepartmentsByName(name))
    );
    
    const allDepartments = departmentArrays.flat();
    const uniqueDepartments = [...new Set(allDepartments)].filter(
      (dept: string) => dept && dept !== 'None' && dept.trim() !== ''
    );
    
    return ['All', ...uniqueDepartments];
  } catch (error) {
    return ['All'];
  }
};