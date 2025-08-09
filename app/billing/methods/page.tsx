import Layout from "@/components/kokonutui/layout"
import { BillingNav } from "@/components/billing/billing-nav"
import { getPaymentMethods } from "@/lib/store"
import { actionAddPaymentMethod, actionRemoveMethod, actionSetDefaultMethod } from "@/app/actions/billing"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function MethodsPage() {
  const methods = await getPaymentMethods()
  return (
    <Layout>
      <BillingNav />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {methods.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-[#1F1F23] p-3"
              >
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {m.brand} •••• {m.last4}{" "}
                    {m.isDefault && (
                      <span className="ml-2 text-xs rounded-md px-2 py-0.5 bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Expires {String(m.expMonth).padStart(2, "0")}/{m.expYear}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!m.isDefault && (
                    <form action={actionSetDefaultMethod}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button variant="outline" size="sm" type="submit">
                        Make Default
                      </Button>
                    </form>
                  )}
                  <form action={actionRemoveMethod}>
                    <input type="hidden" name="id" value={m.id} />
                    <Button variant="outline" size="sm" type="submit" disabled={m.isDefault}>
                      Remove
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {methods.length === 0 && (
              <div className="text-sm text-muted-foreground">No payment methods. Add one below.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={actionAddPaymentMethod} className="space-y-3 max-w-sm">
              <div>
                <label htmlFor="brand" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Card Brand
                </label>
                <Input id="brand" name="brand" placeholder="Visa" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="last4" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Last 4
                  </label>
                  <Input id="last4" name="last4" placeholder="4242" pattern="\d{4}" required />
                </div>
                <div>
                  <label htmlFor="exp" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <Input id="exp" name="exp" placeholder="12/28" pattern="\d{2}/\d{2}" required />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="makeDefault" name="makeDefault" type="checkbox" className="h-4 w-4" />
                <label htmlFor="makeDefault" className="text-sm text-gray-700 dark:text-gray-300">
                  Set as default
                </label>
              </div>
              <Button type="submit">Add Method</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
