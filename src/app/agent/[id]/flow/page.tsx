"use client";

import { useParams, redirect } from "next/navigation";

export default function AgentFlowPage() {
  const params = useParams();
  const id = params?.id as string;
  redirect(`/agent/${id}`);
}
