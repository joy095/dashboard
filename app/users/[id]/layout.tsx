/** @format */

import { Metadata } from "next";

type LayoutProps = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export const generateMetadata = async ({
  params,
}: LayoutProps): Promise<Metadata> => {
  const { id } = await params;

  return {
    title: `User Details - ID: ${id} | Dashboard`,
    description: `View detailed information about user ${id} including their profile and activities`,
    keywords: ["user", "profile", "dashboard", "details"],
    openGraph: {
      title: `User Details - ID: ${id}`,
      description: `User profile and details for ID: ${id}`,
      type: "website",
    },
  };
};
export default function UserLayout({ children }: LayoutProps) {
  return children;
}
