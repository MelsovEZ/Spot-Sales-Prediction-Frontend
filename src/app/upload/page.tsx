import CSVUploader from '@/components/dashboard/upload-button';

function UploadFilePage() {
  return (
    <div className="min-h-screen bg-[#252533] flex flex-col justify-center items-center px-6 lg:px-8">
      <div className="sm:max-w-lg w-full">
        <h2 className="text-center text-3xl font-extrabold text-gray-300">
          Upload Your File
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Please upload your file for processing. Ensure it is in the correct
          format.
        </p>

        <div className="mt-4 flex items-center justify-center">
          <CSVUploader />
        </div>
      </div>
    </div>
  );
}

export default UploadFilePage;
