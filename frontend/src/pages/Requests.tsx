import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { useRequests } from '../services/hooks';
import RequestsHeader from '../components/requests/RequestsHeader';
import RequestCard from '../components/requests/RequestCard';
import EmptyRequests from '../components/requests/EmptyRequests';
import { SearchFilter } from '../components/Common';

function Requests() {
  const {
    requests,
    filteredRequests,
    loading,
    updating,
    setFilteredRequests,
    handleStatusUpdate
  } = useRequests();

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading requests...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <RequestsHeader requestCount={filteredRequests.length} />
      
      <SearchFilter 
        data={requests}
        onFilter={setFilteredRequests}
        searchFields={[
          { key: 'status', label: 'Status' }
        ]}
      />
      
      {filteredRequests.length === 0 ? (
        <EmptyRequests hasRequests={Boolean(requests && requests.length > 0)} />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredRequests.map((request: any, index: number) => (
            <RequestCard
              key={request.registrationId || index}
              request={request}
              updating={Boolean(updating)}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Requests;