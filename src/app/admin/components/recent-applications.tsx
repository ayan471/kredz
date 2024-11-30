import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentApplications = [
  {
    id: "1",
    name: "John Doe",
    type: "Credit Builder",
    amount: "$5,000",
    status: "Pending",
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "Loan",
    amount: "$10,000",
    status: "Approved",
  },
  {
    id: "3",
    name: "Bob Johnson",
    type: "Credit Builder",
    amount: "$3,000",
    status: "Rejected",
  },
  {
    id: "4",
    name: "Alice Brown",
    type: "Loan",
    amount: "$15,000",
    status: "Pending",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    type: "Credit Builder",
    amount: "$2,000",
    status: "Approved",
  },
];

export function RecentApplications() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.name}</TableCell>
              <TableCell>{application.type}</TableCell>
              <TableCell>{application.amount}</TableCell>
              <TableCell>{application.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
