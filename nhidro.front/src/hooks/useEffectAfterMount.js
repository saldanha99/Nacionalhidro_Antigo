import { useEffect, useRef } from "react"

/**
 * Use effect after component mount
 *
 * @param effect
 * @param deps
 *
 * @return {*}
 */
export default function useEffectAfterMount(effect, deps) {
    const isFirstRun = useRef(true)
  
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }

      if (effect) return effect()

    }, deps)

  }