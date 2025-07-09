import React, { useState } from 'react';
import emailService from '../../services/emailService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';

const EmailManagement = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  
  // Email form
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Verification form
  const [verificationForm, setVerificationForm] = useState({
    patientId: '',
    email: ''
  });

  // Password reset form
  const [passwordResetForm, setPasswordResetForm] = useState({
    email: ''
  });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await emailService.sendEmail(emailForm);
      setResults(prev => ({ ...prev, email: response.data }));
      setEmailForm({ to: '', subject: '', body: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setResults(prev => ({ ...prev, email: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await emailService.verifyPatient(verificationForm);
      setResults(prev => ({ ...prev, verification: response.data }));
      setVerificationForm({ patientId: '', email: '' });
    } catch (error) {
      console.error('Error verifying patient:', error);
      setResults(prev => ({ ...prev, verification: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotPasswordEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await emailService.sendForgotPasswordEmail({ email: passwordResetForm.email });
      setResults(prev => ({ ...prev, forgotPassword: response.data }));
      setPasswordResetForm({ email: '' });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setResults(prev => ({ ...prev, forgotPassword: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await emailService.resetPassword(passwordResetForm);
      setResults(prev => ({ ...prev, resetPassword: response.data }));
      setPasswordResetForm({ email: '' });
    } catch (error) {
      console.error('Error resetting password:', error);
      setResults(prev => ({ ...prev, resetPassword: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email Management</h1>
        <p className="text-gray-600">Manage email services and communications</p>
      </div>

      <div className="grid gap-6">
        {/* Send Email */}
        <Card>
          <CardHeader>
            <CardTitle>Send Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <Input
                type="email"
                placeholder="To"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                required
              />
              <Input
                placeholder="Subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                required
              />
              <Textarea
                placeholder="Email Body"
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                required
                rows={4}
              />
              <Button type="submit" disabled={loading}>
                Send Email
              </Button>
            </form>
            {results.email && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.email, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verify Patient */}
        <Card>
          <CardHeader>
            <CardTitle>Verify Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyPatient} className="space-y-4">
              <Input
                placeholder="Patient ID"
                value={verificationForm.patientId}
                onChange={(e) => setVerificationForm({ ...verificationForm, patientId: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Patient Email"
                value={verificationForm.email}
                onChange={(e) => setVerificationForm({ ...verificationForm, email: e.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                Send Verification Email
              </Button>
            </form>
            {results.verification && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.verification, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forgot Password */}
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendForgotPasswordEmail} className="space-y-4">
              <Input
                type="email"
                placeholder="User Email"
                value={passwordResetForm.email}
                onChange={(e) => setPasswordResetForm({ ...passwordResetForm, email: e.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                Send Forgot Password Email
              </Button>
            </form>
            {results.forgotPassword && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.forgotPassword, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reset Password */}
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                type="email"
                placeholder="User Email"
                value={passwordResetForm.email}
                onChange={(e) => setPasswordResetForm({ ...passwordResetForm, email: e.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                Reset Password
              </Button>
            </form>
            {results.resetPassword && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.resetPassword, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailManagement; 