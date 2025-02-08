/** @format */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { useDebounce } from "@/hooks/useDebounce";

// Types
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

// Constants
const ITEMS_PER_PAGE = 5;
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const STALE_TIME = 1000 * 60 * 1; // 1 minute
const DEBUG_CACHE = true;

// Cache debugging utilities
const logCacheOperation = (
  operation: string,
  data?: Record<string, unknown>
) => {
  if (DEBUG_CACHE) {
    // console.group(`Cache Operation: ${operation}`);
    // console.log("Timestamp:", new Date().toISOString());
    if (data) return; //  console.log("Data:", data);
    // console.groupEnd();
  }
};

// API Functions
const fetchUsers = async () => {
  logCacheOperation("Fetch Started");
  const startTime = performance.now();

  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 300 },
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  const data = await response.json();
  const endTime = performance.now();

  logCacheOperation("Fetch Completed", {
    duration: `${(endTime - startTime).toFixed(2)}ms`,
    dataSize: data.length,
  });

  return data;
};

function UserCard({ user }: { user: User }) {
  return (
    <Link href={`/users/${user.id}`}>
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">User ID:</span>
            <span>{user.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Full Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Address:</span>
            <span>
              {`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Company:</span>
            <span>{user.company.name}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="py-2">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

// Memoized filter function
const filterUsers = (users: User[], searchTerm: string) => {
  const lowercaseSearch = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowercaseSearch) ||
      user.email.toLowerCase().includes(lowercaseSearch)
  );
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  // Log cache operations
  useEffect(() => {
    if (users) {
      logCacheOperation("Query Success", {
        dataSize: users.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, [users]);

  useEffect(() => {
    if (error) {
      logCacheOperation("Query Error", { error });
    }
  }, [error]);

  // Initialize page from URL query parameter
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        setCurrentPage(parsedPage);
      }
    }
  }, [searchParams]);

  // Update URL when page changes
  useEffect(() => {
    router.replace(`?page=${currentPage}`, { scroll: false });
  }, [currentPage, router]);

  // Prefetch next page
  useEffect(() => {
    if (users) {
      const nextPage = currentPage + 1;
      const filteredUsers = filterUsers(users, debouncedSearchTerm);
      const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

      if (nextPage <= totalPages) {
        queryClient.prefetchQuery({
          queryKey: ["users"],
          queryFn: fetchUsers,
        });
      }
    }
  }, [currentPage, queryClient, users, debouncedSearchTerm]);

  const filteredUsers = users ? filterUsers(users, debouncedSearchTerm) : [];
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (isLoading) return <Loading />;
  if (isError || error) return <ErrorMessage message="Failed to load users" />;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {displayedUsers.length === 0 ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No Users Found
          </h2>
          <p className="text-gray-600 mt-2">
            Try adjusting your search criteria
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
export default function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent />
    </Suspense>
  );
}
