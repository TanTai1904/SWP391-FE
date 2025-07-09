import React, { useState, useEffect } from 'react';
import treatmentService from '../../services/treatmentService';
import patientService from '../../services/patientService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';

const TreatmentManagement = () => {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    treatmentName: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    dosage: '',
    frequency: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [treatmentsRes, patientsRes] = await Promise.all([
        treatmentService.getAllTreatments(),
        patientService.getAllPatients()
      ]);
      
      setTreatments(treatmentsRes.data || []);
      setPatients(patientsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await treatmentService.updateTreatment({ ...formData, id: editingId });
      } else {
        await treatmentService.createTreatment(formData);
      }
      setFormData({
        patientId: '',
        treatmentName: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        dosage: '',
        frequency: '',
        notes: ''
      });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  const handleEdit = (treatment) => {
    setFormData({
      patientId: treatment.patientId || '',
      treatmentName: treatment.treatmentName || '',
      description: treatment.description || '',
      startDate: treatment.startDate ? new Date(treatment.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: treatment.endDate ? new Date(treatment.endDate).toISOString().split('T')[0] : '',
      status: treatment.status || 'active',
      dosage: treatment.dosage || '',
      frequency: treatment.frequency || '',
      notes: treatment.notes || ''
    });
    setEditingId(treatment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        await treatmentService.deleteTreatment(id);
        loadData();
      } catch (error) {
        console.error('Error deleting treatment:', error);
      }
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      discontinued: 'destructive',
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Treatment Management</h1>
        <Button onClick={() => setShowForm(true)}>Add New Treatment</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Treatment' : 'Add New Treatment'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="border rounded p-2"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                  ))}
                </select>
                <Input
                  placeholder="Treatment Name"
                  value={formData.treatmentName}
                  onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <select
                  className="border rounded p-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="pending">Pending</option>
                </select>
                <Input
                  placeholder="Dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
                <Input
                  placeholder="Frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    patientId: '',
                    treatmentName: '',
                    description: '',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    status: 'active',
                    dosage: '',
                    frequency: '',
                    notes: ''
                  });
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {treatments.map((treatment) => (
            <Card key={treatment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{treatment.treatmentName}</h3>
                      {getStatusBadge(treatment.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Patient:</strong> {getPatientName(treatment.patientId)}</p>
                        <p><strong>Start Date:</strong> {new Date(treatment.startDate).toLocaleDateString()}</p>
                        {treatment.endDate && (
                          <p><strong>End Date:</strong> {new Date(treatment.endDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div>
                        {treatment.dosage && <p><strong>Dosage:</strong> {treatment.dosage}</p>}
                        {treatment.frequency && <p><strong>Frequency:</strong> {treatment.frequency}</p>}
                        {treatment.notes && <p><strong>Notes:</strong> {treatment.notes}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" onClick={() => handleEdit(treatment)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(treatment.id)}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentManagement; 