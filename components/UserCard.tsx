/** @format */

import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

export default function UserCard({ user, isSelected, onClick }: UserCardProps) {
  const formattedAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">ID: {user.id}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-sm">
            <span className="font-medium">Address:</span> {formattedAddress}
          </p>
          <p className="text-sm">
            <span className="font-medium">Company:</span> {user.company.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
