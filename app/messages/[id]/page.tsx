"use client";

import { useParams } from "next/navigation";
import { Inbox } from "../page";

export default function MessageThreadPage() {
  const { id } = useParams<{ id: string }>();
  return <Inbox activeId={id} />;
}
