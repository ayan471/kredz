"use client";

import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
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
import type { CreditBuilderSubscription } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import {
  updateMonthlyCreditHealth,
  toggleSubscriptionStatus,
} from "@/actions/formActions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface CreditFactor {
  name: string;
  score: number;
  details?: any;
}

interface CreditHealthFactor extends CreditFactor {
  details?: {
    factors?: string;
    recommendation?: string;
  };
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
  creditScore: number;
  poweredBy: string;
}

interface MonthlyHealthData {
  year: number;
  month: number;
  creditHealth: string;
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
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Status
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as string;

  //     if (status === "active") {
  //       return (
  //         <Badge className="bg-green-500">
  //           <CheckCircle className="h-3.5 w-3.5 mr-1" />
  //           Active
  //         </Badge>
  //       );
  //     } else if (status === "inactive") {
  //       return (
  //         <Badge variant="outline" className="text-gray-500 border-gray-300">
  //           <XCircle className="h-3.5 w-3.5 mr-1" />
  //           Inactive
  //         </Badge>
  //       );
  //     } else if (status === "pending_payment") {
  //       return (
  //         <Badge
  //           variant="outline"
  //           className="bg-yellow-100 text-yellow-800 border-yellow-300"
  //         >
  //           <AlertTriangle className="h-3.5 w-3.5 mr-1" />
  //           Pending Payment
  //         </Badge>
  //       );
  //     } else {
  //       return (
  //         <Badge variant="outline" className="text-gray-500">
  //           {status || "Unknown"}
  //         </Badge>
  //       );
  //     }
  //   },
  // },
  {
    accessorKey: "isActive",
    header: "Activation",
    cell: ({ row }) => {
      const subscription = row.original;
      const [isActive, setIsActive] = useState(subscription.isActive || false);
      const [isUpdating, setIsUpdating] = useState(false);
      const router = useRouter();

      const handleToggleStatus = async () => {
        setIsUpdating(true);
        try {
          const newStatus = !isActive;
          const result = await toggleSubscriptionStatus(
            subscription.id,
            newStatus
          );

          if (result.success) {
            setIsActive(newStatus);
            toast({
              title: `Subscription ${newStatus ? "Activated" : "Deactivated"}`,
              description: `The subscription is now ${newStatus ? "activated" : "deactivated"} for the user.`,
              variant: newStatus ? "default" : "destructive",
            });
            router.refresh();
          } else {
            toast({
              title: "Update Failed",
              description:
                result.error || "Failed to update subscription status",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error toggling subscription status:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`activate-${subscription.id}`}
            checked={isActive}
            onCheckedChange={handleToggleStatus}
            disabled={isUpdating}
          />
          <Label
            htmlFor={`activate-${subscription.id}`}
            className="text-sm cursor-pointer"
          >
            {isActive ? "Activate" : "Deactivate"}
          </Label>
        </div>
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
      const [selectedMonth, setSelectedMonth] = useState<string>("");
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
        creditScore: 0,
        poweredBy: "",
      });
      const [isOpen, setIsOpen] = useState(false);
      const router = useRouter();

      useEffect(() => {
        if (subscription.monthlyHealthData) {
          try {
            const parsedMonthlyHealthData = JSON.parse(
              subscription.monthlyHealthData
            );
            if (selectedMonth && parsedMonthlyHealthData[selectedMonth]) {
              setCreditFactors(parsedMonthlyHealthData[selectedMonth]);
            }
          } catch (error) {
            console.error("Error parsing monthlyHealthData:", error);
          }
        }
      }, [subscription.monthlyHealthData, selectedMonth]);

      const handleUpdateCreditHealth = async () => {
        setIsUpdating(true);
        try {
          const [year, month] = selectedMonth.split("-").map(Number);
          const result = await updateMonthlyCreditHealth(
            subscription.id,
            month,
            year,
            {
              ...creditFactors,
              creditScore: creditFactors.creditScore,
              poweredBy: creditFactors.poweredBy,
            }
          );
          if (result.success) {
            console.log("Monthly credit health updated successfully");
            router.refresh();
            setIsOpen(false);
          } else {
            console.error(
              "Failed to update monthly credit health:",
              result.error
            );
          }
        } catch (error) {
          console.error("Error updating monthly credit health:", error);
        } finally {
          setIsUpdating(false);
        }
      };

      const getMonthOptions = () => {
        const options = [];
        const startDate = new Date(subscription.createdAt);
        const endDate = subscription.expiryDate
          ? new Date(subscription.expiryDate)
          : new Date();
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
          options.push({
            value: monthKey,
            label: currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            }),
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return options;
      };

      const monthOptions = getMonthOptions();

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Update Credit Health
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Update Monthly Credit Health</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedMonth && (
                <>
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
                          creditUtilization: Number.parseInt(e.target.value),
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
                          paymentHistory: Number.parseInt(e.target.value),
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
                              years: Number.parseInt(e.target.value),
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
                              months: Number.parseInt(e.target.value),
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
                              days: Number.parseInt(e.target.value),
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
                          creditMix: Number.parseInt(e.target.value),
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
                              count: Number.parseInt(e.target.value),
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
                              count: Number.parseInt(e.target.value),
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
                              count: Number.parseInt(e.target.value),
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
                              count: Number.parseInt(e.target.value),
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
                      htmlFor="creditScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Credit Score
                    </label>
                    <Input
                      id="creditScore"
                      type="number"
                      min="300"
                      max="900"
                      value={creditFactors.creditScore}
                      onChange={(e) =>
                        setCreditFactors({
                          ...creditFactors,
                          creditScore: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="poweredBy"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Powered By
                    </label>
                    <Input
                      id="poweredBy"
                      type="text"
                      value={creditFactors.poweredBy}
                      onChange={(e) =>
                        setCreditFactors({
                          ...creditFactors,
                          poweredBy: e.target.value,
                        })
                      }
                    />
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
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCreditHealth}
                disabled={isUpdating || !selectedMonth}
                className="text-white bg-orange-500"
              >
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
      const [isActivating, setIsActivating] = useState(false);
      const [isDeactivating, setIsDeactivating] = useState(false);
      const router = useRouter();

      const handleActivate = async () => {
        setIsActivating(true);
        try {
          const result = await toggleSubscriptionStatus(subscription.id, true);
          if (result.success) {
            toast({
              title: "Subscription Activated",
              description: "The subscription is now visible to the user.",
            });
            router.refresh();
          } else {
            toast({
              title: "Activation Failed",
              description: result.error || "Failed to activate subscription",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error activating subscription:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setIsActivating(false);
        }
      };

      const handleDeactivate = async () => {
        setIsDeactivating(true);
        try {
          const result = await toggleSubscriptionStatus(subscription.id, false);
          if (result.success) {
            toast({
              title: "Subscription Deactivated",
              description: "The subscription is now hidden from the user.",
              variant: "destructive",
            });
            router.refresh();
          } else {
            toast({
              title: "Deactivation Failed",
              description: result.error || "Failed to deactivate subscription",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error deactivating subscription:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setIsDeactivating(false);
        }
      };

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
            <DropdownMenuSeparator />
            {subscription.isActive ? (
              <DropdownMenuItem
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="text-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isDeactivating ? "Deactivating..." : "Deactivate Subscription"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleActivate}
                disabled={isActivating}
                className="text-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isActivating ? "Activating..." : "Activate Subscription"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
