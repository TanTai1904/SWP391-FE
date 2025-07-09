import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Import all services
import patientService from '../../services/patientService';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import doctorScheduleService from '../../services/doctorScheduleService';
import arvRegimensService from '../../services/arvRegimensService';
import arvComponentsService from '../../services/arvComponentsService';
import treatmentService from '../../services/treatmentService';
import testResultService from '../../services/testResultService';
import articleService from '../../services/articleService';
import categoryService from '../../services/categoryService';
import notificationService from '../../services/notificationService';
import emailService from '../../services/emailService';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState('idle');

  const services = [
    { name: 'Patient Service', service: patientService, method: 'getAll' },
    { name: 'Appointment Service', service: appointmentService, method: 'getAllScheduled' },
    { name: 'Doctor Service', service: doctorService, method: 'getAll' },
    { name: 'Doctor Schedule Service', service: doctorScheduleService, method: 'getByDoctorId', params: [3] },
    { name: 'ARV Regimens Service', service: arvRegimensService, method: 'getAll' },
    { name: 'ARV Components Service', service: arvComponentsService, method: 'getAll' },
    { name: 'Treatment Service', service: treatmentService, method: 'getAll' },
    { name: 'Test Result Service', service: testResultService, method: 'getAll' },
    { name: 'Article Service', service: articleService, method: 'getAll' },
    { name: 'Category Service', service: categoryService, method: 'getAll' },
  ];

  const testService = async (serviceInfo) => {
    try {
      const startTime = Date.now();
      const method = serviceInfo.service[serviceInfo.method];
      
      if (!method) {
        throw new Error(`Method ${serviceInfo.method} not found`);
      }
      
      const response = await method.apply(serviceInfo.service, serviceInfo.params || []);
      const endTime = Date.now();
      
      return {
        status: 'success',
        data: response.data,
        count: Array.isArray(response.data) ? response.data.length : 0,
        responseTime: endTime - startTime,
        error: null
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        count: 0,
        responseTime: 0,
        error: error.message || 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setOverallStatus('testing');
    
    const results = {};
    
    for (const serviceInfo of services) {
      results[serviceInfo.name] = await testService(serviceInfo);
    }
    
    setTestResults(results);
    
    // Calculate overall status
    const successCount = Object.values(results).filter(r => r.status === 'success').length;
    const totalCount = services.length;
    
    if (successCount === totalCount) {
      setOverallStatus('success');
    } else if (successCount > 0) {
      setOverallStatus('partial');
    } else {
      setOverallStatus('error');
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Unknown</Badge>;
    }
  };

  const getOverallStatusBadge = () => {
    switch (overallStatus) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">All APIs Working</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">All APIs Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Tested</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Integration Test</h1>
          <p className="text-gray-600">Kiểm tra tất cả các API đã được tích hợp</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={runAllTests} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Run All Tests'
                )}
              </Button>
              {getOverallStatusBadge()}
            </div>
            <div className="text-sm text-gray-500">
              {Object.keys(testResults).length > 0 && (
                <>
                  {Object.values(testResults).filter(r => r.status === 'success').length} / {services.length} APIs working
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serviceInfo) => {
            const result = testResults[serviceInfo.name];
            
            return (
              <Card key={serviceInfo.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">{serviceInfo.name}</span>
                    {result && getStatusIcon(result.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Status:</span>
                      {result ? getStatusBadge(result.status) : <Badge className="bg-gray-100 text-gray-800">Not Tested</Badge>}
                    </div>
                    
                    {result && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Records:</span>
                          <span className="text-sm font-medium">{result.count}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Response Time:</span>
                          <span className="text-sm font-medium">{result.responseTime}ms</span>
                        </div>
                        
                        {result.error && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                            Error: {result.error}
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="text-xs text-gray-400 mt-2">
                      Method: {serviceInfo.method}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {Object.keys(testResults).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(testResults).filter(r => r.status === 'success').length}
                    </div>
                    <div className="text-sm text-green-600">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.values(testResults).filter(r => r.status === 'error').length}
                    </div>
                    <div className="text-sm text-red-600">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(Object.values(testResults).reduce((acc, r) => acc + r.responseTime, 0) / Object.values(testResults).length)}ms
                    </div>
                    <div className="text-sm text-blue-600">Avg Response Time</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Note:</strong> This page tests the basic connectivity and data retrieval for all integrated APIs.</p>
                  <p>Make sure your backend server is running on the correct port and all endpoints are accessible.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage; 