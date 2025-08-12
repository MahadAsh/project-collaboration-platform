import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, X } from 'lucide-react';

function ProjectForm({ onClose, onProjectAdded }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const projectData = {
        title: title.trim(),
        description: description.trim(),
        authorName: currentUser.displayName,
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL,
        timestamp: serverTimestamp(),
        joinRequests: []
      };

      await addDoc(collection(db, 'projects'), projectData);
      
      toast.success('Project created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      
      // Notify parent component
      if (onProjectAdded) {
        onProjectAdded();
      }
      
      // Close form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your project title..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your project, what skills you're looking for, and what you hope to achieve..."
              required
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Contact Info:</strong> Your email ({currentUser?.email}) will be visible to interested collaborators.
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !description.trim()}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;

