import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-extrabold text-gray-300 tracking-widest">404</h1>
            <div className="absolute rotate-12 rounded bg-blue-500 px-2 text-sm text-white shadow">
                Page Not Found
            </div>

            <p className="mt-6 text-lg text-gray-600">
                Sorry, the page you are looking for doesn’t exist or has been moved.
            </p>

            <div className="mt-8">
                <Link
                    href="/"
                    className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium shadow transition hover:bg-blue-700"
                >
                    Go Home
                </Link>
            </div>
        </main>
    );
}