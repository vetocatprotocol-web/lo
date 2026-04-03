import Link from 'next/link';

export const metadata = {
  title: 'Military Attendance System',
  description: 'Admin Dashboard for Military Attendance System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="sidebar">
            <nav className="p-6 space-y-2">
              <div className="text-xl font-bold mb-8">MAS Admin</div>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/members">Members</NavLink>
              <NavLink href="/import">Bulk Import</NavLink>
              <NavLink href="/logs">Activity Logs</NavLink>
              <NavLink href="/settings">Settings</NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded hover:bg-military-700 transition"
    >
      {children}
    </Link>
  );
}
