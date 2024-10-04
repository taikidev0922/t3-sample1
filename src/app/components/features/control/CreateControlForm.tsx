import React, { useState } from "react";
import { Button } from "~/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { api } from "~/trpc/react";
import { toast } from "react-hot-toast";

interface CreateControlFormProps {
  onSuccess: () => void;
}

export const CreateControlForm: React.FC<CreateControlFormProps> = ({
  onSuccess,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newControlCode, setNewControlCode] = useState("");
  const [newControlName, setNewControlName] = useState("");

  const createControlMutation = api.control.createControl.useMutation({
    onSuccess: () => {
      toast.success("新しい制御マスタが作成されました。");
      onSuccess();
      setIsDialogOpen(false);
      setNewControlCode("");
      setNewControlName("");
    },
    onError: (error) => {
      toast.error(`エラーが発生しました: ${error.message}`);
    },
  });

  const handleCreateControl = () => {
    if (newControlCode.trim() && newControlName.trim()) {
      createControlMutation.mutate({
        code: newControlCode.trim(),
        name: newControlName.trim(),
      });
    } else {
      toast.error("コードと名称を入力してください。");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">新規制御マスタ作成</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規制御マスタの作成</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">コード</Label>
            <Input
              id="code"
              value={newControlCode}
              onChange={(e) => setNewControlCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={newControlName}
              onChange={(e) => setNewControlName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateControl}>作成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
