"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useFlexGrid } from "./hooks/useFlexGrid";
import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
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
  const [searchParams, setSearchParams] = useState<SearchCriteria>(
    initialSearchCriteria,
  );
  const [message, setMessage] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([
    "search",
    "customerList",
  ]);

  const {
    data: customers,
    isLoading,
    isError,
    error,
    refetch,
  } = api.customer.findAll.useQuery(searchParams, {
    enabled: Object.values(searchParams).some((value) => value !== ""),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Error refetching data:", error);
      }
    };

    void fetchData();
  }, [searchParams, refetch]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setSearchParams(searchCriteria);
    if (!openSections.includes("customerList")) {
      setOpenSections([...openSections, "customerList"]);
    }
  };

  const handleReset = () => {
    setSearchCriteria(initialSearchCriteria);
    setSearchParams(initialSearchCriteria);
  };

  const handleBulkUpsert = () => {
    if (getSelectedItems) {
      const updatedCustomers = getSelectedItems()?.map((item: Customer) => ({
        ...item,
        id: item.id ? String(item.id) : undefined,
        address: item.address ?? null,
        phoneNumber: item.phoneNumber ?? null,
        emailAddress: item.emailAddress ?? null,
      }));
      if (!updatedCustomers) {
        return;
      }
      bulkUpsertMutation.mutate(updatedCustomers);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
      >
        <AccordionItem value="search">
          <AccordionTrigger>顧客検索</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    type="text"
                    id={field.key}
                    name={field.key}
                    value={searchCriteria[field.key as keyof SearchCriteria]}
                    onChange={handleInputChange}
                    placeholder={`${field.label}で検索`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 space-x-2">
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
            <div className="mt-4">
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

      {message && <div className="mt-4 text-center">{message}</div>}
    </div>
  );
}
