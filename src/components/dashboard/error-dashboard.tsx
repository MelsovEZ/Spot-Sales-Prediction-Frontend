function ErrorDashboard({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-[#252533] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          Error Occurred
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#3a3a47] text-gray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorDashboard;
