import Layout from "@/components/kokonutui/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { actionSaveSettings } from "@/app/actions/settings"
import { getSettings } from "@/lib/settings"
import { ApiKeyInput } from "@/components/settings/api-key-input"

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <Layout>
      <div className="max-w-3xl space-y-4">
        {/* Branding & Careers */}
        <Card>
          <CardHeader>
            <CardTitle>Branding & Careers</CardTitle>
            <CardDescription>Manage brand color and careers page details</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={actionSaveSettings} className="space-y-4">
              <div>
                <Label htmlFor="brandColor">Brand color</Label>
                <Input id="brandColor" name="brandColor" placeholder="#111111" defaultValue={settings.brandColor} />
                <p className="mt-1 text-xs text-muted-foreground">Used across the dashboard for primary accents.</p>
              </div>
              <div>
                <Label htmlFor="careersUrl">Careers page URL</Label>
                <Input
                  id="careersUrl"
                  name="careersUrl"
                  placeholder="https://example.com/careers"
                  defaultValue={settings.careersUrl}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Meetings Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Meetings Integration</CardTitle>
            <CardDescription>Connect your preferred meeting provider to streamline scheduling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={actionSaveSettings} className="space-y-4">
              <div>
                <Label htmlFor="meetingProvider">Provider</Label>
                <select
                  id="meetingProvider"
                  name="meetingProvider"
                  defaultValue={settings.meetingProvider || "google_meet"}
                  className="h-10 w-full rounded-md border bg-background px-3"
                >
                  <option value="google_meet">Google Meet</option>
                  <option value="zoom">Zoom</option>
                  <option value="msteams">Microsoft Teams</option>
                  <option value="webex">Webex</option>
                  <option value="other">Other</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose the provider your team uses for interviews and offer calls.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="meetingApiKey">Provider API key</Label>
                  <span className="text-xs text-muted-foreground">
                    Demo only — do not use real production keys here.
                  </span>
                </div>
                <ApiKeyInput defaultValue={settings.meetingApiKey || ""} />
                <p className="mt-1 text-xs text-muted-foreground">
                  We store this in the in-memory demo store. In production, store provider secrets in environment
                  variables or a secret manager.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
