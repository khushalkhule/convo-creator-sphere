
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Chatbot Management</h2>
          <p className="text-gray-600 mb-4">Create and manage your AI chatbots</p>
          <Button 
            onClick={() => navigate('/chatbots')}
            className="w-full"
          >
            Manage Chatbots
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Management</h2>
          <p className="text-gray-600 mb-4">View and manage captured leads</p>
          <Button 
            onClick={() => navigate('/leads')}
            className="w-full"
          >
            View Leads
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-gray-600 mb-4">View conversation and performance metrics</p>
          <Button 
            onClick={() => navigate('/analytics')}
            className="w-full"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
