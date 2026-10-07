export function hasPublishedDiagnostic(diagnostics: readonly { orgId: string; status: string }[], orgId: string): boolean {
  return Boolean(orgId) && diagnostics.some((diagnostic) => diagnostic.orgId === orgId && diagnostic.status === 'publie')
}
