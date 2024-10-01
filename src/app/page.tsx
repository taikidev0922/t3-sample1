"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const FlexGrid = dynamic(
  () => import("./components/FlexGrid").then((mod) => mod.FlexGrid),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);
import { api } from "~/trpc/react";

export default function Home() {
  const [code, setCode] = useState("");
  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = api.customer.findAll.useQuery({
    code: code,
  });
  return (
    <div>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <FlexGrid items={customers ?? []} />
    </div>
  );
}
