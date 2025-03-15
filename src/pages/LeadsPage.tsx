
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DownloadCloud, Loader2, Search, UserPlus } from "lucide-react";
import axios from 'axios';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  chatbot: string;
  created_at: string;
  status: string;
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LeadsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  // Fetch leads
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/api/leads`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
    }
  });

  const leads = data?.leads || [];

  const handleExportLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leads/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Export Successful",
        description: "Your leads have been exported successfully."
      });
    } catch (error) {
      console.error('Failed to export leads:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your leads. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredLeads = leads ? leads.filter((lead: Lead) => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Leads</h2>
          <p className="text-red-600">Failed to load your leads. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4" variant="outline">Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Manage and export your collected leads.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportLeads}
            >
              <DownloadCloud size={16} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span className="hidden sm:inline">Add Lead</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lead Management</CardTitle>
            <div className="flex items-center mt-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden md:table-cell">Chatbot</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead: Lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{lead.phone || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell">{lead.chatbot}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === 'new' ? 'bg-green-100 text-green-800' : 
                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status || 'new'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No leads found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try adjusting your search terms." : "You haven't collected any leads yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
