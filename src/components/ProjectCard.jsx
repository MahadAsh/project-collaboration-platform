import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Clock, Mail, User, Bell, Trash2 } from 'lucide-react';

function ProjectCard({ project, onJoinProject }) {
  const { currentUser } = useAuth();
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnProject = currentUser?.email === project.authorEmail;
  const hasJoinRequest = project.joinRequests?.some(
    request => request.userEmail === currentUser?.email
  );
  const hasPendingRequests = isOwnProject && project.joinRequests && project.joinRequests.length > 0;

  const handleJoinClick = () => {
    if (onJoinProject) {
      onJoinProject(project);
    }
  };

  const handleDeleteProject = async () => {
    if (!isOwnProject) return;

    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'projects', project.id));
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow relative">
      {/* Notification badge for project owners */}
      {hasPendingRequests && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          <Bell className="h-3 w-3" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
          {project.title}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(project.timestamp)}
          </div>
          {isOwnProject && (
            <Button
              onClick={handleDeleteProject}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
              title="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {project.authorPhoto && (
              <img
                src={project.authorPhoto}
                alt={project.authorName}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {project.authorName}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {project.authorEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {project.joinRequests && project.joinRequests.length > 0 && (
            <span className="text-sm text-gray-500">
              {project.joinRequests.length} interested
            </span>
          )}
          
          {!isOwnProject && (
            <Button
              onClick={handleJoinClick}
              disabled={hasJoinRequest}
              size="sm"
              className={hasJoinRequest ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {hasJoinRequest ? 'Request Sent' : 'Join Project'}
            </Button>
          )}
          
          {isOwnProject && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600 font-medium">
                Your Project
              </span>
              {hasPendingRequests && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {project.joinRequests.length} pending
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

