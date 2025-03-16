
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

interface Subscriber {
  name: string;
  email: string;
  plan: string;
  started: string;
  nextBilling: string;
  amount: string;
  status: 'active' | 'inactive';
}

const subscribers: Subscriber[] = [
  {
    name: 'John Doe',
    email: 'client@chatsass.com',
    plan: 'Pro',
    started: '5/10/2023',
    nextBilling: '5/10/2024',
    amount: '$49.99/mo',
    status: 'active'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    plan: 'Business',
    started: '6/15/2023',
    nextBilling: '6/15/2024',
    amount: '$99.99/mo',
    status: 'active'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    plan: 'Basic',
    started: '7/22/2023',
    nextBilling: '7/22/2024',
    amount: '$24.99/mo',
    status: 'inactive'
  }
];

export const Subscribers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribers</CardTitle>
        <p className="text-sm text-muted-foreground">Users who have subscribed to paid plans</p>
      </CardHeader>
      <CardContent>
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
            {subscribers.map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <p className="font-medium">{subscriber.name}</p>
                    <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                  </div>
                </TableCell>
                <TableCell>{subscriber.plan}</TableCell>
                <TableCell>{subscriber.started}</TableCell>
                <TableCell>{subscriber.nextBilling}</TableCell>
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
      </CardContent>
    </Card>
  );
};
