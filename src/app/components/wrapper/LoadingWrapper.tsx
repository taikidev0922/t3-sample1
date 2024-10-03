import { LoaderCircle } from "lucide-react";
interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}
export function LoadingWrapper({ isLoading, children }: LoadingWrapperProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <LoaderCircle className="animate-spin text-indigo-600" size={48} />
        </div>
      )}
    </div>
  );
}
