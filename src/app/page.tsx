import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card";
import {
  Users,
  Package,
  Settings,
  FileText,
  List,
  BarChart2,
  PieChart,
  TrendingUp,
} from "lucide-react";

interface ClickableCardProps {
  href: string;
  title: string;
  icon: React.ElementType;
  value: string;
  change: string;
  className: string;
}

const ClickableCard = ({
  href,
  title,
  icon: Icon,
  value,
  change,
  className,
}: ClickableCardProps) => (
  <Link href={href} className="block">
    <Card
      className={`${className} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change} from last month
        </p>
      </CardContent>
    </Card>
  </Link>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ClickableCard
            href="/orders"
            title="受注総数"
            icon={TrendingUp}
            value="1,234"
            change="+20.1%"
            className="bg-blue-50 hover:bg-blue-100"
          />
          <ClickableCard
            href="/customers"
            title="得意先数"
            icon={Users}
            value="567"
            change="+5.6%"
            className="bg-green-50 hover:bg-green-100"
          />
          <ClickableCard
            href="/products"
            title="商品数"
            icon={Package}
            value="890"
            change="+12.3%"
            className="bg-yellow-50 hover:bg-yellow-100"
          />
          <ClickableCard
            href="/settings"
            title="制御マスタ"
            icon={Settings}
            value="23"
            change="0%"
            className="bg-purple-50 hover:bg-purple-100"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>売上推移</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <BarChart2 className="h-64 w-full text-blue-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>商品カテゴリ別売上</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <PieChart className="h-64 w-full text-green-500" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/recent-orders" className="block">
            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle>最近の受注</CardTitle>
              </CardHeader>
              <CardContent>
                <List className="h-48 w-full text-gray-500" />
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>クイックアクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/new-order" className="block">
                  <Card className="flex items-center justify-center bg-blue-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-200 hover:shadow-lg">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">新規受注伝票</span>
                  </Card>
                </Link>
                <Link href="/customers" className="block">
                  <Card className="flex items-center justify-center bg-green-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-green-200 hover:shadow-lg">
                    <Users className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">得意先マスタ</span>
                  </Card>
                </Link>
                <Link href="/products" className="block">
                  <Card className="flex items-center justify-center bg-yellow-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-200 hover:shadow-lg">
                    <Package className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">商品マスタ</span>
                  </Card>
                </Link>
                <Link href="/controls" className="block">
                  <Card className="flex items-center justify-center bg-purple-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-purple-200 hover:shadow-lg">
                    <Settings className="mr-2 h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">制御マスタ</span>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
