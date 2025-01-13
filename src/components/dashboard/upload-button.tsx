'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const CSVUploader = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/upload'
          : 'https://spot-sales-prediction-1.onrender.com/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
      event.target.value = '';
      if (pathname === '/') {
        window.location.reload();
      } else {
        router.push('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Upload failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 w-full md:w-36 px-4 py-2 bg-[#5a5b6a] hover:bg-[#464756] rounded-md cursor-pointer transition-colors disabled:bg-muted disabled:cursor-not-allowed">
      <Upload className="w-4 h-4 text-gray-300" />
      <span className="text-gray-300 text-sm">
        {loading ? 'Uploading...' : 'Select CSV'}
      </span>
      <input
        type="file"
        className="hidden"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
      />
    </label>
  );
};

export default CSVUploader;
