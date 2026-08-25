'use client'

import { useStore } from '@/lib/store'
import { auditCurriculum } from '@/lib/curriculum-audit'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import type { AuditFinding } from '@/lib/curriculum-audit'

export default function CurriculumAuditPage() {
  const store = useStore()
  const result = auditCurriculum(store.lessons, store.assignments, store.children)

  const severityColor = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  }

  const severityIcon = {
    critical: '🔴',
    warning: '🟠',
    info: '🔵',
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Curriculum Audit"
        description="Systematic check for curriculum integrity issues across all weeks and children"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-900">Critical Issues</p>
          <p className="text-3xl font-bold text-red-600">{result.summary.critical}</p>
        </Card>
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <p className="text-sm font-semibold text-yellow-900">Warnings</p>
          <p className="text-3xl font-bold text-yellow-600">{result.summary.warnings}</p>
        </Card>
        <Card className="p-4 border-blue-200 bg-blue-50">
          <p className="text-sm font-semibold text-blue-900">Info</p>
          <p className="text-3xl font-bold text-blue-600">{result.summary.info}</p>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{result.totalLessons}</strong> lessons • <strong>{result.totalAssignments}</strong> assignments • Audit:{' '}
          {new Date(result.timestamp).toLocaleString()}
        </p>
      </Card>

      {/* Findings by Category */}
      {result.findings.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-green-600 font-semibold">✓ All checks passed!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {result.findings.map((finding, idx) => (
            <FindingCard key={idx} finding={finding} color={severityColor[finding.severity]} icon={severityIcon[finding.severity]} />
          ))}
        </div>
      )}
    </div>
  )
}

function FindingCard({
  finding,
  color,
  icon,
}: {
  finding: AuditFinding
  color: string
  icon: string
}) {
  return (
    <Card className={`border p-4 ${color}`}>
      <div className="flex gap-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold">{finding.message}</p>
          {finding.details && <p className="text-sm mt-1 opacity-90">{finding.details}</p>}
          {finding.affectedItems && (
            <div className="text-xs mt-2 opacity-75 space-y-1">
              {finding.affectedItems.lessonIds && (
                <p>
                  <strong>Lessons:</strong> {finding.affectedItems.lessonIds.join(', ')}
                </p>
              )}
              {finding.affectedItems.weeks && (
                <p>
                  <strong>Weeks:</strong> {finding.affectedItems.weeks.join(', ')}
                </p>
              )}
              {finding.affectedItems.children && (
                <p>
                  <strong>Children:</strong> {finding.affectedItems.children.join(', ')}
                </p>
              )}
              {finding.affectedItems.days && (
                <p>
                  <strong>Days:</strong> {finding.affectedItems.days.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
