"use client";

import { useParams } from "next/navigation";
import { ProfileView } from "../page";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <ProfileView userId={id} />;
}
