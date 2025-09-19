"use client"

import { useContext } from "react"
import {
  SidebarContext,
  type SidebarContextProps,
} from "@/components/ui/sidebar"

export function useSidebar(): SidebarContextProps | null {
  const context = useContext(SidebarContext)
  return context
}
