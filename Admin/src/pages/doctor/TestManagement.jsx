import React, { useState, useEffect } from 'react';
import testTypeService from '../../services/testTypeService';
import testResultService from '../../services/testResultService';
import patientService from '../../services/patientService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';

const TestManagement = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('types');
  
  // Test Type Form
  const [testTypeForm, setTestTypeForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [editingTestTypeId, setEditingTestTypeId] = useState(null);
  const [showTestTypeForm, setShowTestTypeForm] = useState(false);

  // Test Result Form
  const [testResultForm, setTestResultForm] = useState({
    patientId: '',
    testTypeId: '',
    result: '',
    notes: '',
    testDate: new Date().toISOString().split('T')[0]
  });
  const [editingTestResultId, setEditingTestResultId] = useState(null);
  const [showTestResultForm, setShowTestResultForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [testTypesRes, testResultsRes, patientsRes] = await Promise.all([
        testTypeService.getAllTestTypes(),
        testResultService.getAllTestResults(),
        patientService.getAllPatients()
      ]);
      
      setTestTypes(testTypesRes.data || []);
      setTestResults(testResultsRes.data || []);
      setPatients(patientsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Type Handlers
  const handleTestTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestTypeId) {
        await testTypeService.updateTestType({ ...testTypeForm, id: editingTestTypeId });
      } else {
        await testTypeService.createTestType(testTypeForm);
      }
      setTestTypeForm({ name: '', description: '', price: '', category: '' });
      setEditingTestTypeId(null);
      setShowTestTypeForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving test type:', error);
    }
  };

  const handleTestTypeEdit = (testType) => {
    setTestTypeForm({
      name: testType.name || '',
      description: testType.description || '',
      price: testType.price || '',
      category: testType.category || ''
    });
    setEditingTestTypeId(testType.id);
    setShowTestTypeForm(true);
  };

  const handleTestTypeDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test type?')) {
      try {
        await testTypeService.deleteTestType(id);
        loadData();
      } catch (error) {
        console.error('Error deleting test type:', error);
      }
    }
  };

  // Test Result Handlers
  const handleTestResultSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestResultId) {
        await testResultService.updateTestResult({ ...testResultForm, id: editingTestResultId });
      } else {
        await testResultService.createTestResult(testResultForm);
      }
      setTestResultForm({
        patientId: '',
        testTypeId: '',
        result: '',
        notes: '',
        testDate: new Date().toISOString().split('T')[0]
      });
      setEditingTestResultId(null);
      setShowTestResultForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const handleTestResultEdit = (testResult) => {
    setTestResultForm({
      patientId: testResult.patientId || '',
      testTypeId: testResult.testTypeId || '',
      result: testResult.result || '',
      notes: testResult.notes || '',
      testDate: testResult.testDate ? new Date(testResult.testDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setEditingTestResultId(testResult.id);
    setShowTestResultForm(true);
  };

  const handleTestResultDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test result?')) {
      try {
        await testResultService.deleteTestResult(id);
        loadData();
      } catch (error) {
        console.error('Error deleting test result:', error);
      }
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  };

  const getTestTypeName = (testTypeId) => {
    const testType = testTypes.find(t => t.id === testTypeId);
    return testType ? testType.name : 'Unknown Test';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Management</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          variant={activeTab === 'types' ? 'default' : 'outline'}
          onClick={() => setActiveTab('types')}
        >
          Test Types
        </Button>
        <Button 
          variant={activeTab === 'results' ? 'default' : 'outline'}
          onClick={() => setActiveTab('results')}
        >
          Test Results
        </Button>
      </div>

      {activeTab === 'types' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Types</h2>
            <Button onClick={() => setShowTestTypeForm(true)}>Add Test Type</Button>
          </div>

          {showTestTypeForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingTestTypeId ? 'Edit Test Type' : 'Add Test Type'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTestTypeSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Test Name"
                      value={testTypeForm.name}
                      onChange={(e) => setTestTypeForm({ ...testTypeForm, name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Category"
                      value={testTypeForm.category}
                      onChange={(e) => setTestTypeForm({ ...testTypeForm, category: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={testTypeForm.price}
                      onChange={(e) => setTestTypeForm({ ...testTypeForm, price: e.target.value })}
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={testTypeForm.description}
                    onChange={(e) => setTestTypeForm({ ...testTypeForm, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">{editingTestTypeId ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowTestTypeForm(false);
                      setEditingTestTypeId(null);
                      setTestTypeForm({ name: '', description: '', price: '', category: '' });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {testTypes.map((testType) => (
              <Card key={testType.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{testType.name}</h3>
                      <p className="text-sm text-gray-600">{testType.description}</p>
                      <p className="text-sm text-gray-600">Category: {testType.category}</p>
                      <p className="text-sm text-gray-600">Price: ${testType.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleTestTypeEdit(testType)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleTestTypeDelete(testType.id)}>Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <Button onClick={() => setShowTestResultForm(true)}>Add Test Result</Button>
          </div>

          {showTestResultForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingTestResultId ? 'Edit Test Result' : 'Add Test Result'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTestResultSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="border rounded p-2"
                      value={testResultForm.patientId}
                      onChange={(e) => setTestResultForm({ ...testResultForm, patientId: e.target.value })}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded p-2"
                      value={testResultForm.testTypeId}
                      onChange={(e) => setTestResultForm({ ...testResultForm, testTypeId: e.target.value })}
                      required
                    >
                      <option value="">Select Test Type</option>
                      {testTypes.map(testType => (
                        <option key={testType.id} value={testType.id}>{testType.name}</option>
                      ))}
                    </select>
                    <Input
                      type="date"
                      value={testResultForm.testDate}
                      onChange={(e) => setTestResultForm({ ...testResultForm, testDate: e.target.value })}
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Test Result"
                    value={testResultForm.result}
                    onChange={(e) => setTestResultForm({ ...testResultForm, result: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Notes"
                    value={testResultForm.notes}
                    onChange={(e) => setTestResultForm({ ...testResultForm, notes: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">{editingTestResultId ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowTestResultForm(false);
                      setEditingTestResultId(null);
                      setTestResultForm({
                        patientId: '',
                        testTypeId: '',
                        result: '',
                        notes: '',
                        testDate: new Date().toISOString().split('T')[0]
                      });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {testResults.map((testResult) => (
              <Card key={testResult.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{getTestTypeName(testResult.testTypeId)}</h3>
                      <p className="text-sm text-gray-600">Patient: {getPatientName(testResult.patientId)}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(testResult.testDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Result: {testResult.result}</p>
                      {testResult.notes && <p className="text-sm text-gray-600">Notes: {testResult.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleTestResultEdit(testResult)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleTestResultDelete(testResult.id)}>Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement; 