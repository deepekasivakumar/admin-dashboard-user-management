import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface UserFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function UserFormPanel({ isOpen, onClose, onSubmit, initialData }: UserFormPanelProps) {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    role: '',
    age: '',
    gender: 'Male'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || '',
        age: initialData.age || '',
        gender: initialData.gender || 'Male'
      });
    } else {
      setFormData({
        company: '',
        name: '',
        email: '',
        role: '',
        age: '',
        gender: 'Male'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = "Company Name is required";
    if (!formData.name.trim()) newErrors.name = "Contact Person is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = "Valid age is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setSaveConfirmOpen(false);
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const isDirty = () => {
    if (initialData) {
      return formData.company !== (initialData.company || '') ||
             formData.name !== (initialData.name || '') ||
             formData.email !== (initialData.email || '') ||
             formData.role !== (initialData.role || '') ||
             formData.age !== (initialData.age?.toString() || '') ||
             formData.gender !== (initialData.gender || 'Male');
    } else {
      return formData.company !== '' ||
             formData.name !== '' ||
             formData.email !== '' ||
             formData.role !== '' ||
             formData.age !== '' ||
             formData.gender !== 'Male';
    }
  };

  const handleClose = () => {
    if (isDirty()) {
      setCloseConfirmOpen(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/50 flex justify-end">
      <div className="w-[400px] h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit User' : 'Add User'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="user-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => { setFormData({...formData, name: e.target.value}); if (errors.name) setErrors({...errors, name: ''}); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ${errors.name ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors({...errors, email: ''}); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ${errors.email ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => { setFormData({...formData, age: e.target.value}); if (errors.age) setErrors({...errors, age: ''}); }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ${errors.age ? 'border-red-500' : 'border-gray-200'}`} 
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.company}
                onChange={e => { setFormData({...formData, company: e.target.value}); if (errors.company) setErrors({...errors, company: ''}); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ${errors.company ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.role}
                onChange={e => { setFormData({...formData, role: e.target.value}); if (errors.role) setErrors({...errors, role: ''}); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ${errors.role ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            type="button" 
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="user-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={saveConfirmOpen}
        title="Confirm Save"
        message={`Are you sure you want to save ${initialData ? 'changes to this user' : 'this new user'}?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setSaveConfirmOpen(false)}
        confirmText="Yes, Save"
        cancelText="Cancel"
      />

      <ConfirmDialog 
        isOpen={closeConfirmOpen}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close this form without saving?"
        onConfirm={() => {
          setCloseConfirmOpen(false);
          onClose();
        }}
        onCancel={() => setCloseConfirmOpen(false)}
        confirmText="Yes, Close"
        cancelText="Keep Editing"
        isDestructive={true}
      />
    </div>
  );
}
