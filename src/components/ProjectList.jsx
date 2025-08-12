import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import { Plus, Loader2 } from 'lucide-react';

function ProjectList() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleJoinProject = async (project) => {
    if (!currentUser) return;

    try {
      const joinRequest = {
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        timestamp: new Date()
      };

      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        joinRequests: arrayUnion(joinRequest)
      });

      toast.success(`Join request sent to ${project.authorName}!`);
      
      // Send email notification (this would typically be handled by a backend service)
      // For now, we'll just log it
      console.log(`Join request sent for project: ${project.title}`);
      console.log(`From: ${currentUser.displayName} (${currentUser.email})`);
      console.log(`To: ${project.authorEmail}`);
      
    } catch (error) {
      console.error('Error joining project:', error);
      toast.error('Failed to send join request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
          <p className="text-gray-600 mt-1">
            Discover amazing projects and find your next collaboration
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to post a project and start building something amazing!
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Project</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onJoinProject={handleJoinProject}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onProjectAdded={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default ProjectList;

