import { Header } from "@/components/header";
import ThemeToggle from "@/components/theme-toggle";

export default function Boards() {
  return (
    <div className="w-full h-screen bg-muted-foreground">
      <Header />
      <ThemeToggle />
    </div>
  )
}