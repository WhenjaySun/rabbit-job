import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const jobSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  cron: z.string().min(1, "CRON expression is required"),
  script_type: z.enum(["shell", "python"]),
  script_content: z.string().min(1, "Script content is required"),
  status: z.boolean().default(true),
  timeout: z.number().int().positive().default(60),
});

export function JobForm({ job, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: job || { script_type: "shell", status: true, timeout: 60 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="cron">CRON</Label>
        <Input id="cron" {...register("cron")} />
        {errors.cron && <p className="text-red-500 text-sm">{errors.cron.message}</p>}
      </div>
      <div>
        <Label htmlFor="script_type">Script Type</Label>
        <select id="script_type" {...register("script_type")}>
          <option value="shell">Shell</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div>
        <Label htmlFor="script_content">Script Content</Label>
        <textarea id="script_content" {...register("script_content")} className="w-full h-40 p-2 border rounded-md" />
        {errors.script_content && <p className="text-red-500 text-sm">{errors.script_content.message}</p>}
      </div>
      <div>
        <Label htmlFor="timeout">Timeout (seconds)</Label>
        <Input id="timeout" type="number" {...register("timeout", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="status" {...register("status")} />
        <Label htmlFor="status">Active</Label>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
