
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: string;
  started: string;
  nextBilling: string;
  amount: string;
  status: 'active' | 'inactive';
}

export const Subscribers = () => {
  const { data: subscribers, isLoading, error } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/subscription/subscribers');
        console.log('Subscribers data:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        toast.error('Failed to load subscribers');
        
        // Return sample data for development
        return [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            plan: 'Pro Plan',
            started: '2023-01-15T00:00:00.000Z',
            nextBilling: '2023-02-15T00:00:00.000Z',
            amount: '$99/mo',
            status: 'active'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            plan: 'Basic Plan',
            started: '2023-02-01T00:00:00.000Z',
            nextBilling: '2023-03-01T00:00:00.000Z',
            amount: '$49/mo',
            status: 'active'
          }
        ];
      }
    }
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <p className="text-sm text-muted-foreground">Loading subscription data...</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <p className="text-sm text-muted-foreground">Failed to load subscriber data</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p>Error loading subscribers. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribers</CardTitle>
        <p className="text-sm text-muted-foreground">Users who have subscribed to paid plans</p>
      </CardHeader>
      <CardContent>
        {subscribers && subscribers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber: Subscriber, index: number) => (
                <TableRow key={subscriber.id || index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subscriber.name}</p>
                      <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{subscriber.plan}</TableCell>
                  <TableCell>{formatDate(subscriber.started)}</TableCell>
                  <TableCell>{formatDate(subscriber.nextBilling)}</TableCell>
                  <TableCell>{subscriber.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={subscriber.status === 'active' ? "success" : "secondary"}
                      className={`${
                        subscriber.status === 'active' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {subscriber.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p>No subscribers found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
