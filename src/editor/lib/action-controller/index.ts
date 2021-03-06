import { ActionBaseParams, ActionCallbackResult, ListenerConfig } from './types'

export function createActionController<
  TAction extends string = string,
  TParams extends ActionBaseParams = ActionBaseParams
>() {
  type LocalListenerConfig = ListenerConfig<TParams>
  const listeners: LocalListenerConfig[] = []

  const register = (
    action: TAction,
    callback: LocalListenerConfig['callback']
  ) => {
    listeners.push({
      action,
      priority: 1,
      callback,
      match: () => true,
    })
  }

  const override = (
    action: TAction,
    callback: LocalListenerConfig['callback'],
    {
      match = () => true,
      priority = 2,
    }: {
      match?: LocalListenerConfig['match']
      priority?: LocalListenerConfig['priority']
    } = {}
  ) => {
    listeners.push({
      action,
      priority,
      callback,
      match,
    })
  }

  const execute = (action: TAction, params: TParams) => {
    const configs = listeners.filter((config) => config.action === action)
    const sortedByPriority = configs.sort((a, b) => b.priority - a.priority)

    for (const config of sortedByPriority) {
      const match = config.match(params)
      if (!match) continue

      const result: ActionCallbackResult = config.callback(params) || {}
      const { skipped = false } = result

      if (skipped) continue
      else break
    }
  }

  const curryExecute = (action: TAction) => (params: TParams) => {
    execute(action, params)
  }

  return {
    register,
    override,
    execute,
    curryExecute,
  }
}
