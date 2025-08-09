import Layout from "@/components/kokonutui/layout"
import { BillingNav } from "@/components/billing/billing-nav"
import { getInvoices } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  return (
    <Layout>
      <BillingNav />
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.number}</TableCell>
                  <TableCell>{new Date(inv.issuedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(inv.dueAt).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{inv.status}</TableCell>
                  <TableCell className="text-right tabular-nums">${(inv.amount / 100).toFixed(2)}</TableCell>
                  <TableCell className="space-x-2">
                    <a href="#" className="text-sm underline">
                      View
                    </a>
                    <a href="#" className="text-sm underline">
                      Download PDF
                    </a>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                    No invoices yet.
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
