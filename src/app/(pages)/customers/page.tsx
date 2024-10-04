"use client";
import { useCallback } from "react";
import { api } from "~/trpc/react";
import { useFlexGrid } from "~/app/hooks/useFlexGrid";
import { Button } from "~/app/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { LoadingWrapper } from "~/app/components/wrapper/LoadingWrapper";
import { type FlexGridColumn } from "~/app/types/FlexGridColumn";
import { ClientFlexGrid } from "~/app/components/molecules/ClientFlexGrid";

interface Customer {
  id?: number;
  code: string;
  name: string;
  address?: string | null;
  phoneNumber?: string | null;
  emailAddress?: string | null;
}

export default function Home() {
  const {
    data: customers,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = api.customer.findAll.useQuery(undefined, {
    enabled: true, // 画面表示時に自動的にデータを取得
    refetchOnWindowFocus: false,
  });

  const bulkUpsertMutation = api.customer.bulkUpsert.useMutation({
    onSuccess: () => {
      toast.success("一括登録が成功しました。");
      void refetch();
    },
    onError: (error) => {
      toast.error(`エラーが発生しました: ${error.message}`);
    },
  });

  const columns: FlexGridColumn<Customer>[] = [
    { header: "コード", binding: "code", isRequired: true },
    { header: "名前", binding: "name", isRequired: true },
    { header: "住所", binding: "address", isRequired: false },
    { header: "電話番号", binding: "phoneNumber", isRequired: false },
    {
      header: "メールアドレス",
      binding: "emailAddress",
      isRequired: false,
      rule(_, value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value)
          ? "メールアドレスの形式が正しくありません。"
          : "";
      },
    },
  ];

  const { register, getChanges, validate } = useFlexGrid(columns);

  const handleReset = async () => {
    await refetch();
  };

  const handleBulkUpsert = useCallback(() => {
    if (!validate()) return;
    const selectedItems = getChanges?.();
    if (selectedItems) {
      const updatedCustomers = selectedItems.map((item: Partial<Customer>) => ({
        ...item,
        id: item.id ? String(item.id) : undefined,
        code: item.code ?? "",
        name: item.name ?? "",
      }));
      bulkUpsertMutation.mutate(updatedCustomers);
    }
  }, [getChanges, bulkUpsertMutation, validate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4 flex justify-end">
        <Button onClick={handleReset} disabled={isFetching}>
          {isFetching ? "処理中..." : "リセット"}
        </Button>
        <Button
          onClick={handleBulkUpsert}
          disabled={bulkUpsertMutation.isPending}
        >
          {bulkUpsertMutation.isPending ? "処理中..." : "一括登録・更新"}
        </Button>
      </div>
      <Toaster position="top-center" />
      <h1 className="mb-4 text-2xl font-bold">顧客一覧</h1>
      <LoadingWrapper isLoading={isFetching || bulkUpsertMutation.isPending}>
        <ClientFlexGrid<Customer> items={customers ?? []} {...register()} />
      </LoadingWrapper>
    </div>
  );
}
