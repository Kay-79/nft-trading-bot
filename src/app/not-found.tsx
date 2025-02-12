import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-red-500 mb-4">404 - Not Found</h2>
      <p className="text-gray-700 mb-8">
        Oops! The page you are looking for could not be found.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Return Home
      </Link>
    </div>
  );
}
