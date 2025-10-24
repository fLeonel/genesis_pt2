import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
