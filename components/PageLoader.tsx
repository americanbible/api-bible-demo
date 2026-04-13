import { Loader } from "lucide-react";

/**
 * Simple loading screen
 */
export default function PageLoader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loader className="animate-spin" />
    </div>
  );
}
