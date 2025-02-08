/** @format */

"use client";

import { Suspense, use } from "react";
import UserDetailsContent from "./UserDetailsContent";
import Loading from "@/components/Loading";

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<Loading />}>
      <UserDetailsContent id={id} />
    </Suspense>
  );
}
