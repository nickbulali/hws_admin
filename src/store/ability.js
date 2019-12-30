import { Ability } from '@casl/ability'

export const ability = new Ability()

export const abilityPlugin = (store) => {
  //ability.update(store.state.roles);
  return store.subscribe((mutation) => {

    switch (mutation.type) {
    case 'USER_SUCCESS':

      let permissions = [];

      for (var i = mutation.payload.roles.length - 1; i >= 0; i--) {
        for (var j = mutation.payload.roles[i].permissions.length - 1; j >= 0; j--) {
          permissions[mutation.payload.roles[i].permissions[j].id] = mutation.payload.roles[i].permissions[j].name;
        }
      }
      ability.update([{ actions: permissions, subject: 'all' }])
      //store.commit('setRules', [{ actions: permissions, subject: 'all' }])
      //console.log("permissions are", permissions)
      break
    case 'USER_ERROR':
      ability.update([{ actions: {} }])
      break
    }
  })
}
