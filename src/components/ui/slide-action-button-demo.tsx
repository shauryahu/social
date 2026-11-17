import SlideActionButton from "@/components/ui/slide-action-button";

export default function SlideActionButtonDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-8">
      <SlideActionButton
        completeLabel="Confirmed"
        onComplete={() => console.log("confirmed")}
      >
        Slide to confirm
      </SlideActionButton>
    </div>
  );
}
