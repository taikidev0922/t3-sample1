"use client";

import * as React from "react";
import { Button } from "~/app/components/ui/button";
import { api } from "~/trpc/react";
import { useFlexGrid } from "~/app/hooks/useFlexGrid";
import { toast, Toaster } from "react-hot-toast";
import { LoadingWrapper } from "~/app/components/wrapper/LoadingWrapper";
import { CreateControlForm } from "~/app/components/features/control/CreateControlForm";
import { ClientFlexGrid } from "~/app/components/molecules/ClientFlexGrid";
import { Combobox } from "~/app/components/molecules/Combobox";

interface ControlDetail {
  id?: number;
  controlId: number;
  code: string;
  name: string;
}

interface SelectedControl {
  id: number;
  code: string;
  name: string;
}

export default function ControlManagement() {
  const [selectedControl, setSelectedControl] =
    React.useState<SelectedControl | null>(null);

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
    { header: "名称", binding: "name", isRequired: true },
  ];

  const { register, getChanges, validate } =
    useFlexGrid<ControlDetail>(columns);

  const handleControlChange = (value: string) => {
    const selectedItem = controls?.find(
      (control) => control.id.toString() === value,
    );
    if (selectedItem) {
      setSelectedControl({
        id: selectedItem.id,
        code: selectedItem.code,
        name: selectedItem.name,
      });
    }
  };

  const handleBulkUpsert = React.useCallback(() => {
    if (!validate() || !selectedControl) return;
    const changedItems = getChanges?.();
    if (changedItems) {
      const updatedDetails = changedItems.map((item) => ({
        ...item,
        id: item.id ? parseInt(item.id) : undefined,
        controlId: selectedControl.id,
      }));
      bulkUpsertDetailsMutation.mutate(updatedDetails);
    }
  }, [getChanges, bulkUpsertDetailsMutation, validate, selectedControl]);

  if (isControlsLoading) {
    return <div>Loading controls...</div>;
  }

  const controlCodeItems =
    controls?.map((control) => ({
      value: control.id.toString(),
      label: control.code,
    })) ?? [];
  const controlNameItems =
    controls?.map((control) => ({
      value: control.id.toString(),
      label: control.name,
    })) ?? [];

  const selectedControlDetails =
    controls?.find((c) => c.id === selectedControl?.id)?.details ?? [];

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="mb-4 text-2xl font-bold">制御マスタ管理</h1>

      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="rounded-md border bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium">制御マスタ検索</h3>
            <div className="flex space-x-2">
              <Combobox
                placeholder="コードを選択"
                emptyText="見つかりません。"
                items={controlCodeItems}
                defaultValue={selectedControl?.id.toString()}
                onSelect={handleControlChange}
              />
              <Combobox
                placeholder="名称を選択"
                emptyText="見つかりません。"
                items={controlNameItems}
                defaultValue={selectedControl?.id.toString()}
                onSelect={handleControlChange}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <CreateControlForm onSuccess={refetchControls} />
          <div className="flex space-x-2">
            <Button
              onClick={() => refetchControls()}
              disabled={isControlsLoading}
              variant="outline"
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
      </div>

      {selectedControl && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-semibold">詳細</h2>
          <LoadingWrapper isLoading={bulkUpsertDetailsMutation.isPending}>
            <ClientFlexGrid<ControlDetail>
              items={selectedControlDetails}
              {...register()}
            />
          </LoadingWrapper>
        </div>
      )}
    </div>
  );
}
