import type { Access, FieldAccess } from 'payload'

type WithRoles = { roles?: string[] | null } | null | undefined

const hasRole = (user: WithRoles, role: string) => Boolean(user?.roles?.includes(role))

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

export const isStaff: Access = ({ req: { user } }) => hasRole(user, 'admin') || hasRole(user, 'editor')

/** Public sees published content only; staff see everything including drafts. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin') || hasRole(user, 'editor')) return true
  return { _status: { equals: 'published' } }
}

/** Admins manage all users; anyone else can only read/update themselves. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

/** Any signed-in account (reader/author or staff). */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Staff see everything; everyone else only the records whose `field` points at them. */
export const staffOrOwner =
  (field: string): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (hasRole(user, 'admin') || hasRole(user, 'editor')) return true
    return { [field]: { equals: user.id } }
  }

/** Whether the user may open the /admin panel. Reader/author accounts must never get in. */
export const canAccessAdmin = ({ req: { user } }: { req: { user: WithRoles } }): boolean =>
  hasRole(user, 'admin') || hasRole(user, 'editor')

export const userIsStaff = (user: WithRoles): boolean => hasRole(user, 'admin') || hasRole(user, 'editor')
