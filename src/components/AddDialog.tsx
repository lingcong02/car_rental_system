"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookingModel,
  UserModel,
  VehicleModel,
  VehicleModelModel,
} from "@/model/Model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserInput } from "./UserInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { error } from "console";

const AddDialog = ({
  open,
  onOpenChange,
  vehicle,
  method,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vehicle?: VehicleModel;
  method: "add" | "update";
}) => {
  const router = useRouter();
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [showAlert, setShowAlert] = useState(false);

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [platNo, setPlatNo] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image,setImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = await fetch("/api/VehicleModel/GetAll", { method: "GET" });
      const response = await query.json();
      setVehicleModelList(response);
    };
    fetchData();
  }, []);

  //   console.log(name, model, platNo, desc, price, images, imagePreviews)

  //---Image Upload---
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    // Validate file count
    if (newFiles.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // Create previews
    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async (): Promise<boolean> => {
    if (files.length === 0) {
      toast.warning("No files selected");
      return false;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      // First check if response is OK
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use status text
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      // Now safely parse the JSON
      const result = await response.json();

      toast.success("Images uploaded successfully");
      console.log("Uploaded files:", result.files);
      setImage(result.files);
      console.log(image)

      // Reset form
      setFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);
  //--Image Upload--

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadImage = await handleUpload();
    if (uploadImage) {
      const vehicleModel = {
        name,
        model,
        platNo,
        desc,
        price,
        image: image.map((item) => ({
          path: item
        }))
      };
      console.log(vehicleModel);
      try {
        const query = await fetch("/api/Vehicle/Insert", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleModel),
        });
        const response = await query.json();
        console.log(response);
      } catch (err: any) {
        toast.error("Failed to insert vehicle", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[790px] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <UserInput label="Name" value={name} onChange={setName} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Model</Label>
              <Select value={model} onValueChange={setModel} required>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleModelList.map((vehicleModel) => (
                    <SelectItem
                      key={vehicleModel.id}
                      value={vehicleModel.id.toString()}
                    >
                      {vehicleModel.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <UserInput label="Plat No" value={platNo} onChange={setPlatNo} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <Textarea
                placeholder="Type your message here."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="col-span-3 max-w-[554px]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <div className="flex items-center w-full max-w-md rounded-lg border bg-background text-foreground col-span-2">
                <div className="flex items-center px-4 text-muted-foreground">
                  <span className="h-5 w-5">RM</span>
                </div>
                <Input
                  type="text"
                  required
                  className="flex-1 rounded-l-none rounded-r-lg border-0 bg-transparent py-2 pr-4 text-sm focus:outline-none focus:ring-0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Image</Label>
              <div className="col-span-3 space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
                  className="hidden"
                  disabled={isUploading}
                  required
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Images
                    </Button>

                    {previews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group h-48 flex flex-col"
                          >
                            <div className="flex-1 relative overflow-hidden rounded-lg border">
                              <img
                                src={preview.url}
                                alt={`Preview ${preview.name}`}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                disabled={isUploading}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground truncate">
                              {preview.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {files.length} image(s) selected (max 4)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Add Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this action? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAlert(false);
                onOpenChange(false); // Close the main dialog only on confirmation
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default AddDialog;
