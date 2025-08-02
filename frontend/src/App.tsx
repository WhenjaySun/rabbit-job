import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JobList } from "@/pages/JobList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JobList />
    </QueryClientProvider>
  );
}

export default App;