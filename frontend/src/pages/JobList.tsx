import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JobForm } from "@/components/JobForm";
import api from "@/lib/api";

interface Job {
  id: number;
  name: string;
  description: string;
  cron: string;
  status: boolean;
}

const fetchJobs = async (): Promise<Job[]> => {
  const response = await api.get("/jobs");
  return response.data as Job[];
};

export function JobList() {
  const { data: jobs, isLoading, isError } = useQuery<Job[]>({ queryKey: ["jobs"], queryFn: fetchJobs });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching jobs</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rabbit Job</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Job</DialogTitle>
            </DialogHeader>
            <JobForm job={null} onSubmit={() => {}} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>CRON</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((job: Job) => (
            <TableRow key={job.id}>
              <TableCell>{job.name}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>{job.cron}</TableCell>
              <TableCell>{job.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Logs</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
