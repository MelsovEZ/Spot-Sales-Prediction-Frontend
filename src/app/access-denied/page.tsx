import Image from 'next/image';

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    src="/logo.svg?height=60&width=60"
                    alt="I'M's Logo"
                    width={60}
                    height={60}
                    className="mx-auto"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Access Denied
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <p className="text-xl text-gray-700 mb-4">
                            You can`t access this page or resource
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            It looks like you don`t have the necessary permissions to view this content. If you believe this is an error, please contact support.
                        </p>
                        <Image
                            src="/alert.svg?height=150&width=150"
                            alt="Access Denied Illustration"
                            width={100}
                            height={100}
                            className="mx-auto mb-6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

