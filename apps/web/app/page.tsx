export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Military Attendance System</h1>
        <p className="text-gray-600 mb-8">QR-based, high-security attendance tracking</p>
        <a href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
