"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditBuilderSubscription } from "@prisma/client";

import { useRouter } from "next/navigation";
import { updateCreditHealth } from "@/actions/formActions";

interface CreditFactor {
  name: string;
  score: number;
  details?: any;
}

interface CreditFactors {
  creditUtilization: number;
  paymentHistory: number;
  creditAge: { years: number; months: number; days: number };
  creditMix: number;
  totalActiveAccounts: { count: number; lenders: string };
  delayHistory: { count: number; lenders: string };
  inquiries: { count: number; lenders: string };
  overdueAccounts: { count: number; lenders: string };
  scoringFactors: string;
  recommendation: string;
}

export const columns: ColumnDef<CreditBuilderSubscription>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "plan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscription Plan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscription Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "updateCreditHealth",
    header: "Update Credit Health",
    cell: ({ row }) => {
      const subscription = row.original;
      const [isUpdating, setIsUpdating] = useState(false);
      const [creditFactors, setCreditFactors] = useState<CreditFactors>({
        creditUtilization: 0,
        paymentHistory: 0,
        creditAge: { years: 0, months: 0, days: 0 },
        creditMix: 0,
        totalActiveAccounts: { count: 0, lenders: "" },
        delayHistory: { count: 0, lenders: "" },
        inquiries: { count: 0, lenders: "" },
        overdueAccounts: { count: 0, lenders: "" },
        scoringFactors: "",
        recommendation: "",
      });
      const [isOpen, setIsOpen] = useState(false);
      const router = useRouter();

      useEffect(() => {
        if (subscription.creditHealth) {
          try {
            const parsedCreditHealth: CreditFactor[] = JSON.parse(
              subscription.creditHealth
            );
            setCreditFactors({
              creditUtilization:
                parsedCreditHealth.find(
                  (f: CreditFactor) => f.name === "Credit Utilization"
                )?.score || 0,
              paymentHistory:
                parsedCreditHealth.find(
                  (f: CreditFactor) => f.name === "Payment History"
                )?.score || 0,
              creditAge: parsedCreditHealth.find(
                (f: CreditFactor) => f.name === "Credit Age"
              )?.details || { years: 0, months: 0, days: 0 },
              creditMix:
                parsedCreditHealth.find(
                  (f: CreditFactor) => f.name === "Credit Mix"
                )?.score || 0,
              totalActiveAccounts: parsedCreditHealth.find(
                (f: CreditFactor) => f.name === "Total Active Accounts"
              )?.details || { count: 0, lenders: "" },
              delayHistory: parsedCreditHealth.find(
                (f: CreditFactor) => f.name === "Delay History"
              )?.details || { count: 0, lenders: "" },
              inquiries: parsedCreditHealth.find(
                (f: CreditFactor) => f.name === "No. of Inquiries"
              )?.details || { count: 0, lenders: "" },
              overdueAccounts: parsedCreditHealth.find(
                (f: CreditFactor) => f.name === "Overdue Accounts"
              )?.details || { count: 0, lenders: "" },
              scoringFactors:
                parsedCreditHealth.find(
                  (f: CreditFactor) => f.name === "Scoring Factors"
                )?.details?.factors || "",
              recommendation:
                parsedCreditHealth.find(
                  (f: CreditFactor) => f.name === "Our Recommendation"
                )?.details?.recommendation || "",
            });
          } catch (error) {
            console.error("Error parsing creditHealth:", error);
          }
        }
      }, [subscription.creditHealth]);

      const handleUpdateCreditHealth = async () => {
        setIsUpdating(true);
        try {
          const result = await updateCreditHealth(
            subscription.id,
            creditFactors
          );
          if (result.success) {
            console.log("Credit health updated successfully");
            router.refresh();
            setIsOpen(false);
          } else {
            console.error("Failed to update credit health:", result.error);
          }
        } catch (error) {
          console.error("Error updating credit health:", error);
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Update Credit Health
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Update Credit Health</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label
                  htmlFor="creditUtilization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit Utilization
                </label>
                <Input
                  id="creditUtilization"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.creditUtilization}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      creditUtilization: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="paymentHistory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment History
                </label>
                <Input
                  id="paymentHistory"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.paymentHistory}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      paymentHistory: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="creditAge"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age of Credit
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="creditAgeYears"
                    type="number"
                    min="0"
                    placeholder="Years"
                    value={creditFactors.creditAge.years}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        creditAge: {
                          ...creditFactors.creditAge,
                          years: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Input
                    id="creditAgeMonths"
                    type="number"
                    min="0"
                    max="11"
                    placeholder="Months"
                    value={creditFactors.creditAge.months}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        creditAge: {
                          ...creditFactors.creditAge,
                          months: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Input
                    id="creditAgeDays"
                    type="number"
                    min="0"
                    max="30"
                    placeholder="Days"
                    value={creditFactors.creditAge.days}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        creditAge: {
                          ...creditFactors.creditAge,
                          days: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="creditMix"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit Mix
                </label>
                <Input
                  id="creditMix"
                  type="number"
                  min="0"
                  max="100"
                  value={creditFactors.creditMix}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      creditMix: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="totalActiveAccounts"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Active Accounts
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="totalActiveAccountsCount"
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={creditFactors.totalActiveAccounts.count}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        totalActiveAccounts: {
                          ...creditFactors.totalActiveAccounts,
                          count: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Textarea
                    id="totalActiveAccountsLenders"
                    placeholder="Lenders (comma-separated)"
                    value={creditFactors.totalActiveAccounts.lenders}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        totalActiveAccounts: {
                          ...creditFactors.totalActiveAccounts,
                          lenders: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="delayHistory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delay History
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="delayHistoryCount"
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={creditFactors.delayHistory.count}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        delayHistory: {
                          ...creditFactors.delayHistory,
                          count: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Textarea
                    id="delayHistoryLenders"
                    placeholder="Lenders (comma-separated)"
                    value={creditFactors.delayHistory.lenders}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        delayHistory: {
                          ...creditFactors.delayHistory,
                          lenders: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="inquiries"
                  className="block text-sm font-medium text-gray-700"
                >
                  No. of Inquiries
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="inquiriesCount"
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={creditFactors.inquiries.count}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        inquiries: {
                          ...creditFactors.inquiries,
                          count: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Textarea
                    id="inquiriesLenders"
                    placeholder="Lenders (comma-separated)"
                    value={creditFactors.inquiries.lenders}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        inquiries: {
                          ...creditFactors.inquiries,
                          lenders: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="overdueAccounts"
                  className="block text-sm font-medium text-gray-700"
                >
                  Overdue Accounts
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="overdueAccountsCount"
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={creditFactors.overdueAccounts.count}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        overdueAccounts: {
                          ...creditFactors.overdueAccounts,
                          count: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <Textarea
                    id="overdueAccountsLenders"
                    placeholder="Lenders (comma-separated)"
                    value={creditFactors.overdueAccounts.lenders}
                    onChange={(e) =>
                      setCreditFactors({
                        ...creditFactors,
                        overdueAccounts: {
                          ...creditFactors.overdueAccounts,
                          lenders: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="scoringFactors"
                  className="block text-sm font-medium text-gray-700"
                >
                  Scoring Factors
                </label>
                <Textarea
                  id="scoringFactors"
                  placeholder="Enter scoring factors"
                  value={creditFactors.scoringFactors}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      scoringFactors: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="recommendation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Our Recommendation
                </label>
                <Textarea
                  id="recommendation"
                  placeholder="Enter recommendation"
                  value={creditFactors.recommendation}
                  onChange={(e) =>
                    setCreditFactors({
                      ...creditFactors,
                      recommendation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCreditHealth} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Confirm Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(subscription.id)}
            >
              Copy subscription ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/credit-builder/subscription/${subscription.id}`}
              >
                View details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
