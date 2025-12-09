"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import axios from "axios";
import { toast } from "sonner";

import { DomainExtension } from "@/data/domain-extention";

import { SpamMeter } from "@/components/partials/spam-meter";
import { CharCounter } from "@/components/partials/char-counter";
import { SendAnimation } from "@/components/partials/send-animation";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "../ui/toggle";

import { useDebounce } from "@/hooks/useDebounce";
import { calculateSpamScore } from "@/utils/spam-score";
import { updateAnalytics } from "@/utils/analytics";

import { Paperclip, SendHorizonal, Bold, Italic, Link2 } from "lucide-react";

const formSchema = z.object({
  fromName: z.string().min(1, "Required"),
  fromUser: z.string().min(1, "Required"),
  fromOrg: z.string().min(1, "Required"),
  ext: z.nativeEnum(DomainExtension),

  to: z.string().email("Invalid email"),
  cc: z.string().optional(),
  bcc: z.string().optional(),

  subject: z.string().min(1, "Subject required"),
});
type FormValues = z.infer<typeof formSchema>;

export default function EmailComposer() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [html, setHtml] = useState("");
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const debouncedHtml = useDebounce(html, 300);
  const spamResult = debouncedHtml ? calculateSpamScore(debouncedHtml) : null;

  function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      ListItem,
      BulletList,
      OrderedList,
      Highlight,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ext: DomainExtension.US,
    },
  });

  async function convertFile(
    file: File
  ): Promise<{ filename: string; content: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          filename: file.name,
          content: (reader.result as string).split(",")[1], // base64 only
        });
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: FormValues) {
    if (!editor) return;

    if (!html || html.length < 5) {
      toast.error("Email body is too short");
      return;
    }

    setStatus("sending");

    const fullFromEmail = `${values.fromUser}@${values.fromOrg}.${values.ext}`;
    const apiEndpoint =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") + "/send";

    const encodedAttachments = await Promise.all(
      attachments.map((file) => convertFile(file))
    );

    try {
      const payload = {
        fromName: values.fromName,
        from: fullFromEmail,
        to: values.to,
        cc: values.cc || null,
        bcc: values.bcc || null,
        subject: values.subject,
        html,
        attachments: encodedAttachments,
      };

      await axios.post(apiEndpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Email sent successfully");
      updateAnalytics("sent");
      setStatus("success");

      editor.commands.clearContent();
      form.reset();
      setAttachments([]);
      setHtml("");
      setShowCC(false);
      setShowBCC(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
      updateAnalytics("failed");
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div className="w-full md:max-w-5xl max-md:layout-standard md:mx-auto section-margin-standard flex flex-col gap-6">
      {/* FROM NAME */}
      <div>
        <Label className="text-sm font-medium">From Name</Label>
        <Input
          placeholder="what client will see prominently"
          {...form.register("fromName")}
          className="mt-1 h-[50px] border-border bg-input"
        />
      </div>

      {/* FROM FIELD */}
      <div>
        <Label className="text-sm font-medium">From</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            placeholder="name before @"
            {...form.register("fromUser")}
            className="w-40 h-[50px] border-border bg-input"
          />

          <span className="text-foreground">@</span>

          <Input
            placeholder="domain"
            {...form.register("fromOrg")}
            className="w-40 h-[50px] border-border bg-input"
          />

          <span className="text-foreground">.</span>

          <select
            {...form.register("ext")}
            className="h-[50px] px-2 border border-border bg-input rounded-md text-sm"
          >
            {Object.values(DomainExtension).map((ext) => (
              <option key={ext} value={ext}>
                {ext}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TO FIELD */}
      <div className="space-y-2">
        <Label>To</Label>
        <Input
          placeholder="recipient@example.com"
          {...form.register("to")}
          className="h-[50px] border-border bg-input"
        />
      </div>

      {/* CC / BCC TOGGLES */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          className="px-8 py-4 rounded-sm hover:bg-primary-hover"
          onClick={() => setShowCC((v) => !v)}
        >
          CC
        </Button>

        <Button
          type="button"
          className="px-8 py-4 rounded-sm hover:bg-primary-hover"
          onClick={() => setShowBCC((v) => !v)}
        >
          BCC
        </Button>
      </div>

      {/* CC FIELD */}
      {showCC && (
        <div className="space-y-2">
          <Label>CC</Label>
          <Input
            placeholder="cc@example.com"
            {...form.register("cc")}
            className="h-[50px] border-border bg-input"
          />
        </div>
      )}

      {/* BCC FIELD */}
      {showBCC && (
        <div className="space-y-2">
          <Label>BCC</Label>
          <Input
            placeholder="bcc@example.com"
            {...form.register("bcc")}
            className="h-[50px] border-border bg-input"
          />
        </div>
      )}

      {/* SUBJECT */}
      <div className="space-y-1">
        <Label>Subject</Label>
        <Input
          placeholder="Email subject"
          {...form.register("subject")}
          className="h-[50px] border-border bg-input"
        />

        <CharCounter
          // eslint-disable-next-line react-hooks/incompatible-library
          value={form.watch("subject") || ""}
          limit={150}
          className="mt-1"
        />
      </div>

      {/* TOOLBAR */}
      <Separator />

      <div className="flex items-center gap-3">
        <Toggle
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          variant="outline"
          className="bg-muted border-border hover:bg-muted-hover"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          variant="outline"
          className="bg-muted border-border hover:bg-muted-hover"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          variant="outline"
          className="bg-muted border-border hover:bg-muted-hover"
        >
          • • •
        </Toggle>

        <Toggle
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
          variant="outline"
          className="bg-muted border-border hover:bg-muted-hover"
        >
          1.
        </Toggle>

        <Toggle
          onPressedChange={() => {
            const url = prompt("Enter link URL");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          variant="outline"
          className="bg-muted border-border hover:bg-muted-hover"
        >
          <Link2 className="h-4 w-4" />
        </Toggle>

        <Tooltip>
          <TooltipTrigger
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Paperclip className="h-4 w-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>Attach files</TooltipContent>
        </Tooltip>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 bg-muted border rounded-full text-sm"
            >
              <span>{file.name}</span>
              <button
                type="button"
                className="text-red-500"
                onClick={() =>
                  setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        id="file-input"
        className="hidden"
        multiple
        onChange={handleAttachment}
      />

      {/* BODY EDITOR */}
      <div className="min-h-[200px] border rounded-md p-3 bg-white">
        <EditorContent editor={editor} className="tiptap" />
      </div>

      {/* SPAM METER */}
      {spamResult && <SpamMeter result={spamResult} />}

      {/* SEND BUTTON / STATUS */}
      <div className="flex items-center justify-between mt-4">
        <SendAnimation status={status} />

        <Button
          className="flex items-center gap-2 h-12 hover:bg-primary-hover"
          onClick={form.handleSubmit(onSubmit)}
        >
          <SendHorizonal className="h-4 w-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
}
