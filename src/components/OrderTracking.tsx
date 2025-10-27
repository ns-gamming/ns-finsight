import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Plus, Calendar, TrendingUp } from "lucide-react";

interface Order {
  id: string;
  item_name: string;
  category: string;
  amount: number;
  currency: string;
  order_date: string;
  delivery_date?: string;
  status: string;
  tracking_number?: string;
  merchant?: string;
}

export const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    category: "electronics",
    amount: "",
    currency: "INR",
    order_date: new Date().toISOString().split("T")[0],
    delivery_date: "",
    tracking_number: "",
    merchant: "",
    status: "pending",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("order_date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Failed to load orders");
    }
  };

  const addOrder = async () => {
    if (!formData.item_name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        item_name: formData.item_name,
        category: formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        order_date: formData.order_date,
        delivery_date: formData.delivery_date || null,
        tracking_number: formData.tracking_number || null,
        merchant: formData.merchant || null,
        status: formData.status,
      });

      if (error) throw error;

      toast.success("Order added successfully");
      setOpen(false);
      setFormData({
        item_name: "",
        category: "electronics",
        amount: "",
        currency: "INR",
        order_date: new Date().toISOString().split("T")[0],
        delivery_date: "",
        tracking_number: "",
        merchant: "",
        status: "pending",
      });
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to add order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "pending": return "outline";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const totalSpent = orders.reduce((sum, order) => {
    if (order.currency === "INR") return sum + Number(order.amount);
    return sum;
  }, 0);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>Track all your online purchases</CardDescription>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item_name">Item Name *</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    placeholder="iPhone 15 Pro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="food">Food & Groceries</SelectItem>
                        <SelectItem value="home">Home & Living</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="999.99"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order_date">Order Date</Label>
                    <Input
                      id="order_date"
                      type="date"
                      value={formData.order_date}
                      onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="delivery_date">Delivery Date</Label>
                    <Input
                      id="delivery_date"
                      type="date"
                      value={formData.delivery_date}
                      onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    placeholder="Amazon, Flipkart, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    id="tracking_number"
                    value={formData.tracking_number}
                    onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    placeholder="ABC123456789"
                  />
                </div>

                <Button onClick={addOrder} disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Order"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Total Spent on Orders</p>
          </div>
          <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders tracked yet. Add your first order!</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors animate-fade-in">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{order.item_name}</h4>
                    <p className="text-sm text-muted-foreground">{order.merchant || order.category}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(order.order_date).toLocaleDateString()}
                  </span>
                  <span className="font-semibold">
                    {order.currency === "INR" ? "₹" : order.currency === "USD" ? "$" : "€"}
                    {Number(order.amount).toFixed(2)}
                  </span>
                </div>
                {order.tracking_number && (
                  <p className="text-xs text-muted-foreground mt-2">Tracking: {order.tracking_number}</p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
