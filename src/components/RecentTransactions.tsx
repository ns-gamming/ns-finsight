import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  merchant: string;
  timestamp: string;
  memberName?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  familyMemberId?: string;
  limit?: number;
}

export const RecentTransactions = ({ transactions, familyMemberId, limit }: RecentTransactionsProps) => {
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions || []);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (familyMemberId && !transactions) {
      fetchMemberTransactions();
    } else if (transactions) {
      setLocalTransactions(transactions);
    }
  }, [familyMemberId, transactions]);

  const fetchMemberTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id,
          amount,
          type,
          merchant,
          timestamp
        `)
        .eq("family_member_id", familyMemberId)
        .order("timestamp", { ascending: false })
        .limit(limit || 20);

      if (error) throw error;

      const formatted = data?.map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        type: t.type,
        merchant: t.merchant || "Unknown",
        timestamp: t.timestamp,
      })) || [];

      setLocalTransactions(formatted);
    } catch (error) {
      console.error("Failed to fetch member transactions:", error);
    }
  };

  const filteredTransactions = localTransactions.filter((t) => {
    if (!startDate && !endDate) return true;
    const txDate = new Date(t.timestamp);
    if (startDate && txDate < startDate) return false;
    if (endDate && txDate > endDate) return false;
    return true;
  });

  if (localTransactions.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet. Start by adding your first transaction!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
        <DateRangeFilter onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found for this date range</p>
          ) : (
            filteredTransactions.slice(0, limit || 20).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {transaction.merchant}
                      {transaction.memberName && (
                        <Badge variant="secondary" className="text-[10px]">{transaction.memberName}</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === "income" ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Badge variant={transaction.type === "income" ? "default" : "secondary"} className="text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
