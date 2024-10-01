"use client";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { api } from "~/trpc/react";
import { useFlexGrid } from "./hooks/useFlexGrid";
import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/components/ui/accordion";

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

interface SearchCriteria {
  code: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
}

const initialSearchCriteria: SearchCriteria = {
  code: "",
  name: "",
  address: "",
  phoneNumber: "",
  emailAddress: "",
};

const searchFields = [
  { key: "code", label: "コード" },
  { key: "name", label: "名前" },
  { key: "address", label: "住所" },
  { key: "phoneNumber", label: "電話番号" },
  { key: "emailAddress", label: "メールアドレス" },
];

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(
    initialSearchCriteria,
  );
  const [submittedSearchCriteria, setSubmittedSearchCriteria] =
    useState<SearchCriteria>(initialSearchCriteria);
  const [openSections, setOpenSections] = useState<string[]>([
    "search",
    "customerList",
  ]);
  const [searchKey, setSearchKey] = useState<number>(0);

  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = api.customer.findAll.useQuery(submittedSearchCriteria, {
    enabled: searchKey > 0,
  });

  const bulkUpsertMutation = api.customer.bulkUpsert.useMutation({
    onSuccess: () => {
      toast.success("一括登録が成功しました。");
      setSearchKey((prev) => prev + 1);
    },
    onError: (error) => {
      toast.error(`エラーが発生しました: ${error.message}`);
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSearchCriteria((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSearch = useCallback(() => {
    setSubmittedSearchCriteria(searchCriteria);
    setSearchKey((prev) => prev + 1);
    if (!openSections.includes("customerList")) {
      setOpenSections((prev) => [...prev, "customerList"]);
    }
  }, [searchCriteria, openSections]);

  const handleReset = useCallback(() => {
    setSearchCriteria(initialSearchCriteria);
    setSubmittedSearchCriteria(initialSearchCriteria);
    setSearchKey(0);
  }, []);

  const handleBulkUpsert = useCallback(() => {
    const selectedItems = getSelectedItems?.();
    if (selectedItems) {
      const updatedCustomers = selectedItems.map((item: Customer) => ({
        ...item,
        id: item.id ? String(item.id) : undefined,
        address: item.address ?? null,
        phoneNumber: item.phoneNumber ?? null,
        emailAddress: item.emailAddress ?? null,
      }));
      bulkUpsertMutation.mutate(updatedCustomers);
    }
  }, [getSelectedItems, bulkUpsertMutation]);

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
      >
        <AccordionItem value="search">
          <AccordionTrigger>顧客検索</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              {searchFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    type="text"
                    id={field.key}
                    name={field.key}
                    value={searchCriteria[field.key as keyof SearchCriteria]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "検索中..." : "検索"}
              </Button>
              <Button
                onClick={handleReset}
                disabled={isLoading}
                variant="outline"
              >
                リセット
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customerList">
          <AccordionTrigger>顧客一覧</AccordionTrigger>
          <AccordionContent>
            {isError && (
              <div className="text-center text-red-500">
                エラーが発生しました: {error.message}
              </div>
            )}
            <FlexGrid items={customers ?? []} {...register()} />
            {customers && customers.length === 0 && (
              <div className="mt-4 text-center">
                該当する顧客が見つかりません。
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleBulkUpsert}
                disabled={
                  bulkUpsertMutation.isPending ||
                  !customers ||
                  customers.length === 0
                }
              >
                {bulkUpsertMutation.isPending ? "処理中..." : "一括登録・更新"}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
