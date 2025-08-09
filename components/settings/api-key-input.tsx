"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  id?: string
  name?: string
  defaultValue?: string
  placeholder?: string
}

export function ApiKeyInput({ id = "meetingApiKey", name = "meetingApiKey", defaultValue, placeholder }: Props) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="flex gap-2 items-center">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder={placeholder || "Paste API key"}
        autoComplete="off"
      />
      <Button
        type="button"
        variant="outline"
        className="bg-transparent"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? "Hide" : "Show"}
      </Button>
    </div>
  )
}
