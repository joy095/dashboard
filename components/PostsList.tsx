/** @format */

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsListProps {
  userId: number;
}

const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export default function PostsList({ userId }: PostsListProps) {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="Failed to load posts" />;
  if (!posts?.length)
    return <ErrorMessage message="No posts found for this user" />;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <h3 className="text-lg font-semibold">{post.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{post.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
