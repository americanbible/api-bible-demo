import { Loader } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loader className="animate-spin" />
    </div>
  );
}
