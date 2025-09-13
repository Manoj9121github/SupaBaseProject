'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-pink-50 ">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800 text-center">
        Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* User Card */}
        <Link
          href="/user"
          className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-300 w-48"
        >
          <Image
            src="/images/user.png"
            alt="User"
            width={100}
            height={100}
            className="w-20 h-20 mb-4"
          />
          <span className="text-lg font-semibold text-gray-700">User</span>
        </Link>

        {/* Admin Card */}
        <Link
          href="/admin"
          className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-300 w-48"
        >
          <Image
            src="/images/admin.jpg"
            alt="Admin"
            width={100}
            height={100}
            className="w-20 h-20 mb-4"
          />
          <span className="text-lg font-semibold text-gray-700">Admin</span>
        </Link>
      </div>
    </div>
  );
}
