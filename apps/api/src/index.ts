import { defineAbilityFor } from '@saas/auth';

const ability = defineAbilityFor({ role: 'MEMBER' });

console.log(ability.can('invite', 'User'));
console.log(ability.can('delete', 'User'));
console.log(ability.cannot('delete', 'User'));