"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleModel, VehicleModelModel } from "@/model/Model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

const AddDialog = ({
  open,
  onOpenChange,
  vehicle,
  method,
  setFetchTable,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vehicle?: VehicleModel;
  method: "add" | "update";
  setFetchTable: (prev: any) => void;
}) => {
  const router = useRouter();
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(vehicle?.name || "");
  const [model, setModel] = useState(vehicle?.model.toString() || "");
  const [platNo, setPlatNo] = useState(vehicle?.platNo || "");
  const [desc, setDesc] = useState(vehicle?.desc || "");
  const [price, setPrice] = useState(vehicle?.price.toString() || "");
  // Image upload state
  const [previews, setPreviews] = useState<
    { url: string; name: string; fromServer?: boolean }[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name);
      setModel(vehicle.model.toString());
      setPlatNo(vehicle.platNo);
      setDesc(vehicle.desc);
      setPrice(vehicle.price.toString());
      setPreviews(
        vehicle?.image.map((img) => ({
          url: img.path,
          name: img.path.split("/").pop() || "unknown",
          fromServer: true,
        })) || []
      );
      setFiles([]);
    }
    console.log(files);
  }, [open]);

  // Fetch vehicle models
  useEffect(() => {
    const fetchData = async () => {
      const query = await fetch("/api/VehicleModel/GetAll", { method: "GET" });
      const response = await query.json();
      setVehicleModelList(response);
    };
    fetchData();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    if (newFiles.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index: number) => {
    const isFromServer = previews[index].fromServer;

    if (isFromServer) {
      // Remove from previews only
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from previews and files
      const previewToRemove = previews[index];
      URL.revokeObjectURL(previewToRemove.url);

      setFiles((prev) =>
        prev.filter((_, i) => i !== index - serverImageCount())
      );
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const serverImageCount = () => previews.filter((p) => p.fromServer).length;

  // Upload images to server
  const handleUpload = async (): Promise<string[] | false> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.files;
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

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  // Handle form submission (shows confirmation dialog)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
  };

  // Handle confirmed submission
  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!name || !model || !platNo || !desc || !price) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Upload images if any
      let uploadedImages: string[] = [];
      if (files.length > 0) {
        const uploadResult = await handleUpload();
        if (uploadResult === false) {
          toast.error("Image upload failed");
          return;
        }
        uploadedImages = uploadResult || [];
      }
      console.log(uploadedImages);

      // Prepare vehicle data
      const vehicleModel = {
        id: vehicle?.id || 0,
        name,
        model,
        platNo,
        desc,
        price: parseFloat(price),
        image: [
          ...previews
            .filter((img) => img.fromServer)
            .map((img) => ({ path: img.url })),
          ...uploadedImages.map((path) => ({ path })),
        ],
      };

      // Submit to server
      let response;
      if (method === "update") {
        response = await fetch("/api/Vehicle/Update", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleModel),
        });
      } else {
        response = await fetch("/api/Vehicle/Insert", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleModel),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to insert vehicle");
      }

      // Success
      toast.success("Vehicle update successfully!");
      setFiles([]);
      setPreviews([]);
      setName("");
      setModel("");
      setPlatNo("");
      setDesc("");
      setPrice("");
      setFetchTable((prev: any) => !prev);
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to create vehicle");
    } finally {
      setIsSubmitting(false);
      setShowAlert(false);
    }
  };

  const handleOpenChange = () => {
    setFiles([]);
    setPreviews([]);
    setName("");
    setModel("");
    setPlatNo("");
    setDesc("");
    setPrice("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                  type="number"
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
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
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
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Vehicle {method === "add" ? "Addition" : "Update"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {method === "add" ? "add" : "update"}{" "}
              this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default AddDialog;
