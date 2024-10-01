"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useFlexGrid } from "./hooks/useFlexGrid";

const FlexGrid = dynamic(
  () => import("./components/FlexGrid").then((mod) => mod.FlexGrid),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

interface Customer {
  id?: string;
  code: string;
  name: string;
  address?: string | null;
  phoneNumber?: string | null;
  emailAddress?: string | null;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const {
    data: customers,
    isLoading,
    isError,
    error,
    refetch,
  } = api.customer.findAll.useQuery({
    code: code,
  });

  const bulkUpsertMutation = api.customer.bulkUpsert.useMutation({
    onSuccess: async () => {
      setMessage("一括登録が成功しました。");
      await refetch();
    },
    onError: (error) => {
      setMessage(`エラーが発生しました: ${error.message}`);
    },
  });

  const columns = [
    { header: "コード", binding: "code" },
    { header: "名前", binding: "name" },
    { header: "住所", binding: "address" },
    { header: "電話番号", binding: "phoneNumber" },
    { header: "メールアドレス", binding: "emailAddress" },
  ];

  const { register, getSelectedItems } = useFlexGrid(columns);

  const handleBulkUpsert = () => {
    if (getSelectedItems) {
      const updatedCustomers = getSelectedItems()?.map((item: Customer) => ({
        ...item,
        id: item.id ? String(item.id) : undefined, // idを文字列に変換
        address: item.address ?? null, // undefinedの場合はnullに
        phoneNumber: item.phoneNumber ?? null,
        emailAddress: item.emailAddress ?? null,
      }));
      if (!updatedCustomers) {
        return;
      }
      bulkUpsertMutation.mutate(updatedCustomers);
    }
  };

  if (isLoading) return <div>データを読み込み中...</div>;
  if (isError) return <div>エラーが発生しました: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="顧客コードで検索"
      />
      <FlexGrid items={customers ?? []} {...register()} />
      <button
        onClick={handleBulkUpsert}
        disabled={bulkUpsertMutation.isPending}
      >
        {bulkUpsertMutation.isPending ? "処理中..." : "一括登録・更新"}
      </button>
      {message && <div>{message}</div>}
    </div>
  );
}
