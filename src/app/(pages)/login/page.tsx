import React from "react";
import Link from "next/link"; // Next.jsのLinkコンポーネントをインポート
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card";
import { Label } from "~/app/components/ui/label";
import { Input } from "~/app/components/ui/input";
import { Button } from "~/app/components/ui/button";
import { Checkbox } from "~/app/components/ui/checkbox";
import { LockIcon, UnlockIcon } from "lucide-react";

const LoginScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Card className="mx-auto w-full max-w-md bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/50">
        <CardHeader className="space-y-1">
          <CardTitle className="group text-center text-2xl font-bold">
            <span className="inline-block transition-all duration-300 group-hover:-translate-y-1">
              ログイン
            </span>
          </CardTitle>
          <div className="flex justify-center">
            <LockIcon className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              className="transition-all duration-300 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              required
              className="transition-all duration-300 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">ログイン情報を保存する</Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/" passHref legacyBehavior>
            <Button
              type="submit"
              className="w-full bg-purple-600 transition-all duration-300 hover:bg-purple-700"
            >
              ログイン
              <UnlockIcon className="ml-2 h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
            </Button>
          </Link>
          <div className="text-center text-sm text-gray-500">
            アカウントをお持ちでない方は{" "}
            <a href="#" className="text-purple-600 hover:underline">
              こちら
            </a>
          </div>
          <div className="mt-4 text-center text-xs text-gray-400">
            このログイン画面はサンプルです。
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
