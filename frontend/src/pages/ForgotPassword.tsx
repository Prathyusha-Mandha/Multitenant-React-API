
import useForgotPassword from '../hooks/useForgotPassword';
import { MultiStepForm, EmailStep, ResetStep, SuccessStep } from '../components/forms';

interface ForgotPasswordProps {
  onBack: () => void;
}

function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    loading,
    errors,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    handleSendOTP,
    handleResetPassword
  } = useForgotPassword(onBack);

  return (
    <MultiStepForm>
      {step === 'email' ? (
        <EmailStep
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleSendOTP}
          loading={loading}
          error={errors.email}
          onBack={onBack}
        />
      ) : step === 'reset' ? (
        <ResetStep
          otp={otp}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onOtpChange={setOtp}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleResetPassword}
          loading={loading}
          errors={errors}
        />
      ) : (
        <SuccessStep onBack={onBack} />
      )}
    </MultiStepForm>
  );
}

export default ForgotPassword;