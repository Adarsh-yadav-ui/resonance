"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { ScrollArea } from "../components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Field, FieldLabel, FieldError } from "../components/ui/field";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form } from "../components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { UploadButton } from "@/utils/uploadthing";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, UploadCloud } from "lucide-react";

const formSchema = z.object({
  Name: z.string().min(3).max(50),
  Description: z.string().min(3).max(180),
  Visibility: z.enum(["public", "private"]),
  FileType: z.enum(["PDF", "Image", "Document", "Audio", "Video", "other"]),
});

export default function FileUploadDialog() {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const [open, setOpen] = useState(false);

  const createVoice = useMutation(api.voice.createVoice);
  const currentUser = useQuery(api.users.current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Description: "",
      Visibility: "private",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!uploadedFile) {
      toast("Upload file first");
      return;
    }

    if (!currentUser) {
      toast("User not authenticated");
      return;
    }

    await createVoice({
      name: values.Name,
      description: values.Description,
      category: "general",
      userId: currentUser._id,
      cloudId: uploadedFile.url,
      language: "en-us",
    });

    toast("File uploaded successfully");

    form.reset();
    setUploadedFile(null);
    setOpen(false);
  }

  return (
    <main className="p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-2xl bg-[#fa7275] text-white">
            <UploadCloud className="w-5 h-5" />
            Upload
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Private files are visible only to you
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                {/* Name */}
                <Field>
                  <FieldLabel>File Name</FieldLabel>
                  <Input {...form.register("Name")} />
                  <FieldError>{form.formState.errors.Name?.message}</FieldError>
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input {...form.register("Description")} />
                  <FieldError>
                    {form.formState.errors.Description?.message}
                  </FieldError>
                </Field>

                {/* Upload */}
                <Field>
                  <FieldLabel>Upload File</FieldLabel>

                  <div className="border-dashed border-2 p-6 rounded-lg text-center">
                    {uploadedFile ? (
                      <div className="flex justify-center gap-2 text-green-600">
                        <CheckCircle2 />
                        {uploadedFile.name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Upload your Audio
                        </p>
                      </div>
                    )}

                    <div className="bg-black rounded-lg hover:scale-105 transition-all">
                      <UploadButton
                        endpoint="audioUploader"
                        onClientUploadComplete={(res) => {
                          const file = res?.[0];
                          if (!file) return;
                          setUploadedFile({
                            name: file.name,
                            url: file.ufsUrl,
                          });
                          toast("Upload complete");
                        }}
                      />
                    </div>
                  </div>
                </Field>

                <Button type="submit" disabled={!uploadedFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}
