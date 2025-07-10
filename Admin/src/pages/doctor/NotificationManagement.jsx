import React, { useState } from 'react';
import notificationService from '../../services/notificationService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const NotificationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const handleTestMorningJob = async () => {
    setLoading(true);
    try {
      const response = await notificationService.testMorningJob();
      setResults(prev => ({ ...prev, morning: response.data }));
    } catch (error) {
      console.error('Error testing morning job:', error);
      setResults(prev => ({ ...prev, morning: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleTestEveningJob = async () => {
    setLoading(true);
    try {
      const response = await notificationService.testEveningJob();
      setResults(prev => ({ ...prev, evening: response.data }));
    } catch (error) {
      console.error('Error testing evening job:', error);
      setResults(prev => ({ ...prev, evening: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleSendAppointmentReminders = async () => {
    setLoading(true);
    try {
      const response = await notificationService.sendAppointmentReminders();
      setResults(prev => ({ ...prev, appointment: response.data }));
    } catch (error) {
      console.error('Error sending appointment reminders:', error);
      setResults(prev => ({ ...prev, appointment: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMedicationReminders = async (frequency) => {
    setLoading(true);
    try {
      const response = await notificationService.sendMedicationReminders(frequency);
      setResults(prev => ({ ...prev, medication: response.data }));
    } catch (error) {
      console.error('Error sending medication reminders:', error);
      setResults(prev => ({ ...prev, medication: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <p className="text-gray-600">Manage and test notification services</p>
      </div>

      <div className="grid gap-6">
        {/* Test Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Test Notification Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleTestMorningJob} 
                disabled={loading}
                variant="outline"
              >
                Test Morning Job
              </Button>
              <Button 
                onClick={handleTestEveningJob} 
                disabled={loading}
                variant="outline"
              >
                Test Evening Job
              </Button>
            </div>
            {(results.morning || results.evening) && (
              <div className="space-y-2">
                {results.morning && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold">Morning Job Result:</h4>
                    <pre className="text-sm">{JSON.stringify(results.morning, null, 2)}</pre>
                  </div>
                )}
                {results.evening && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold">Evening Job Result:</h4>
                    <pre className="text-sm">{JSON.stringify(results.evening, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Send Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleSendAppointmentReminders} 
                disabled={loading}
              >
                Send Appointment Reminders
              </Button>
            </div>
            {results.appointment && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Appointment Reminders Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.appointment, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medication Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={() => handleSendMedicationReminders('daily')} 
                disabled={loading}
                variant="outline"
              >
                Send Daily Reminders
              </Button>
              <Button 
                onClick={() => handleSendMedicationReminders('weekly')} 
                disabled={loading}
                variant="outline"
              >
                Send Weekly Reminders
              </Button>
              <Button 
                onClick={() => handleSendMedicationReminders('monthly')} 
                disabled={loading}
                variant="outline"
              >
                Send Monthly Reminders
              </Button>
            </div>
            {results.medication && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Medication Reminders Result:</h4>
                <pre className="text-sm">{JSON.stringify(results.medication, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <span>Morning Job</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <span>Evening Job</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Manual</Badge>
                <span>Appointment Reminders</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Manual</Badge>
                <span>Medication Reminders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationManagement; 