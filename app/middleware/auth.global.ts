export default defineNuxtRouteMiddleware((to) => {
  const protectedPaths = ['/chat', '/admin']
  const isProtected = protectedPaths.some((p) => to.path === p || to.path.startsWith(p + '/'))
  if (!isProtected) return

  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) return

  return navigateTo('/login', { replace: true })
})
