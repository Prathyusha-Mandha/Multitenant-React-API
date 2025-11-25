import useUpdateProfile from '../hooks/useUpdateProfile';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';

function UpdateProfile() {
  const {
    formData,
    previewUrl,
    loading,
    updating,
    handleFileChange,
    handleInputChange,
    handleSubmit
  } = useUpdateProfile();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <UpdateProfileForm
      formData={formData}
      previewUrl={previewUrl}
      updating={updating}
      onInputChange={handleInputChange}
      onFileChange={handleFileChange}
      onSubmit={handleSubmit}
    />
  );
}

export default UpdateProfile;