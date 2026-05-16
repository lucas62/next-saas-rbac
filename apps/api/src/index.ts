import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ id: 'user-1', role: 'MEMBER' })

const project = projectSchema.parse({
  id: 'project-1',
  ownerId: 'user-1',
})

console.log(ability.can('get', 'User'))
console.log(ability.can('delete', 'User'))
console.log(ability.cannot('delete', 'User'))
console.log(ability.can('get', project))
console.log(ability.can('delete', project))
console.log(ability.cannot('delete', project))
