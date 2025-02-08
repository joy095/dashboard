/** @format */
"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ErrorMessage from "@/components/ErrorMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
  };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetchUserDetails = async (userId: number): Promise<User> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  if (!response.ok) throw new Error("Failed to fetch user details");
  return response.json();
};

const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export default function UserDetailsContent({ id }: { id: string }) {
  const userId = parseInt(id, 10);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserDetails(userId),
  });

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery<Post[]>({
    queryKey: ["posts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  if (userError) return <ErrorMessage message="Failed to load user details" />;
  if (postsError) return <ErrorMessage message="Failed to load posts" />;
  if (!user && !userLoading) return <ErrorMessage message="User not found" />;

  const formattedAddress = user
    ? `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`
    : "";

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          {userLoading ? (
            <Skeleton height={30} width={200} />
          ) : user ? (
            <h1 className="text-3xl font-bold">{user.name}</h1>
          ) : null}
          {userLoading ? (
            <Skeleton height={20} width={150} />
          ) : user ? (
            <p className="text-gray-600">@{user.username}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {userLoading ? (
            <>
              <Skeleton height={20} width={250} />
              <Skeleton height={20} width={300} />
              <Skeleton height={20} width={200} />
            </>
          ) : user ? (
            <>
              <div>
                <strong>Email:</strong> {user.email}
                <br />
                <strong>Company:</strong> {user.company.name}
                <br />
                <em>&#34;{user.company.catchPhrase}&#34;</em>
              </div>
              <div>
                <strong>Address:</strong> {formattedAddress}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <div className="space-y-4">
        {postsLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton height={25} width={300} />
                </CardHeader>
                <CardContent>
                  <Skeleton count={3} />
                </CardContent>
              </Card>
            ))
          : posts?.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{post.body}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
