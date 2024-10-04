"use client";
import { useCallback, useState } from "react";
import { api } from "~/trpc/react";
import { useFlexGrid } from "~/app/hooks/useFlexGrid";
import { Button } from "~/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select";
import { toast, Toaster } from "react-hot-toast";
import { LoadingWrapper } from "~/app/components/wrapper/LoadingWrapper";
import { CreateControlForm } from "~/app/components/features/control/CreateControlForm";
import { ClientFlexGrid } from "~/app/components/molecules/ClientFlexGrid";

interface ControlDetail {
  id?: number;
  controlId: number;
  code: string;
  name: string;
}

export default function ControlManagement() {
  const [selectedControlId, setSelectedControlId] = useState<number | null>(
    null,
  );

  const {
    data: controls,
    isLoading: isControlsLoading,
    refetch: refetchControls,
  } = api.control.findAll.useQuery();

  const bulkUpsertDetailsMutation = api.control.bulkUpsertDetails.useMutation({
    onSuccess: () => {
      toast.success("詳細の更新が成功しました。");
      void refetchControls();
    },
    onError: (error) => {
      toast.error(`エラーが発生しました: ${error.message}`);
    },
  });

  const columns = [
    { header: "コード", binding: "code", isRequired: true },
    { header: "名前", binding: "name", isRequired: true },
  ];

  const { register, getChanges, validate } =
    useFlexGrid<ControlDetail>(columns);

  const handleControlChange = (value: string) => {
    setSelectedControlId(Number(value));
  };

  const handleBulkUpsert = useCallback(() => {
    if (!validate() || !selectedControlId) return;
    const changedItems = getChanges?.();
    if (changedItems) {
      const updatedDetails = changedItems.map((item) => ({
        ...item,
        id: item.id ? parseInt(item.id) : undefined,
        controlId: selectedControlId,
      }));
      bulkUpsertDetailsMutation.mutate(updatedDetails);
    }
  }, [getChanges, bulkUpsertDetailsMutation, validate, selectedControlId]);

  if (isControlsLoading) {
    return <div>Loading controls...</div>;
  }

  const selectedControl = controls?.find((c) => c.id === selectedControlId);

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="mb-4 text-2xl font-bold">制御マスタ管理</h1>

      <div className="mb-4 flex items-center space-x-4">
        <Select onValueChange={handleControlChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="制御マスタを選択" />
          </SelectTrigger>
          <SelectContent>
            {controls?.map((control) => (
              <SelectItem key={control.id} value={String(control.id)}>
                {control.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CreateControlForm onSuccess={refetchControls} />
      </div>

      {selectedControlId && selectedControl && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-semibold">詳細</h2>
          <LoadingWrapper isLoading={bulkUpsertDetailsMutation.isPending}>
            <ClientFlexGrid<ControlDetail>
              items={selectedControl.details ?? []}
              {...register()}
            />
          </LoadingWrapper>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              onClick={() => refetchControls()}
              disabled={isControlsLoading}
            >
              リセット
            </Button>
            <Button
              onClick={handleBulkUpsert}
              disabled={bulkUpsertDetailsMutation.isPending}
            >
              {bulkUpsertDetailsMutation.isPending ? "処理中..." : "一括更新"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
