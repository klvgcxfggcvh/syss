"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus } from "lucide-react"
import { ReportsList } from "./reports-list"
import { CreateReportDialog } from "./create-report-dialog"
import { ReportDetails } from "./report-details"
import { useReportsStore } from "@/store/reports-store"

export function ReportsPanel() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { selectedReport } = useReportsStore()

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Reports & SITREP
          </h2>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="sitrep">SITREP</TabsTrigger>
            <TabsTrigger value="conrep">CONREP</TabsTrigger>
            <TabsTrigger value="intsum">INTSUM</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ReportsList type="all" />
          </TabsContent>
          <TabsContent value="sitrep" className="mt-4">
            <ReportsList type="sitrep" />
          </TabsContent>
          <TabsContent value="conrep" className="mt-4">
            <ReportsList type="conrep" />
          </TabsContent>
          <TabsContent value="intsum" className="mt-4">
            <ReportsList type="intsum" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedReport ? (
          <ReportDetails report={selectedReport} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a report to view details
          </div>
        )}
      </div>

      <CreateReportDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
