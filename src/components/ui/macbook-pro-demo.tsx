import { MacbookPro } from "@/components/ui/macbook-pro";

export function MacbookProDemo() {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center p-4">
      <MacbookPro
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop"
        className="w-full h-auto drop-shadow-2xl"
      />
    </div>
  );
}

export default MacbookProDemo;
