import Layout from "@/components/kokonutui/layout"
import { BillingNav } from "@/components/billing/billing-nav"
import { getPayments } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function PaymentsPage() {
  const payments = await getPayments()
  return (
    <Layout>
      <BillingNav />
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.date).toLocaleString()}</TableCell>
                  <TableCell>{p.invoiceNumber || "—"}</TableCell>
                  <TableCell>
                    {p.methodBrand} •••• {p.methodLast4}
                  </TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell className="text-right tabular-nums">${(p.amount / 100).toFixed(2)}</TableCell>
                  <TableCell className="space-x-2">
                    <a href="#" className="text-sm underline">
                      Receipt
                    </a>
                    {p.status === "failed" && (
                      <a href="#" className="text-sm underline">
                        Retry
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  )
}
