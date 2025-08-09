import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CompanyPage() {
  async function save(formData: FormData) {
    "use server"
    // This is a demo-only page; in a real app you'd persist to a DB.
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Update public recruiting details</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={save} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" name="name" placeholder="Acme Inc." />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" placeholder="https://example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea id="about" name="about" placeholder="Tell candidates about the company..." rows={6} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="hq">HQ Location</Label>
                <Input id="hq" name="hq" placeholder="San Francisco, CA" />
              </div>
              <div>
                <Label htmlFor="size">Company Size</Label>
                <Input id="size" name="size" placeholder="51-200" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team & Roles</CardTitle>
          <CardDescription>Manage who can post jobs and review applicants</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This demo does not implement auth. Add your auth provider and role checks here.
        </CardContent>
      </Card>
    </div>
  )
}
