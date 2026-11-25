"use client";

import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const MAX_SIZE = 5 * 1024 * 1024;

export function ImageUpload({
  value,
  onChange,
  label = "Profile image",
}: {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(value);
  const [progress, setProgress] = useState<number | null>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be 5 MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profileImage", file);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
    const normalizedBackendUrl = backendUrl.replace(/\/api\/v1$/, "");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${normalizedBackendUrl}/api/v1/auth/image-upload`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as {
            data?: { imageUrl?: string };
          };
          if (body.data?.imageUrl) {
            onChange(body.data.imageUrl);
            setPreview(body.data.imageUrl);
            toast.success("Image uploaded");
          } else {
            toast.error("Upload did not return an image URL");
          }
        } catch {
          toast.error("Invalid upload response");
        }
      } else {
        toast.error("Image upload failed");
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      toast.error("Image upload failed");
    };
    xhr.send(formData);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UploadCloud className="m-auto h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {progress !== null && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            PNG or JPG, max 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}
