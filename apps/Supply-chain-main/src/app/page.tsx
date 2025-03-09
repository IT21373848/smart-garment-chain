import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* SAMPLE CODE, USE SHADCN UI LIBRARY AND INSTALL ANY UI COMPONENT IF NEEDED */}
        <Button>Button</Button>
        <Input placeholder="Input" />
      </main>
      <Footer />
    </div>
  );
}
