import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  const checkIsMobile = React.useCallback(() => {
    return window.innerWidth < MOBILE_BREAKPOINT
  }, [])

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkIsMobile())
    }
    mql.addEventListener("change", onChange)
    setIsMobile(checkIsMobile())
    return () => mql.removeEventListener("change", onChange)
  }, [checkIsMobile])

  return !!isMobile
}
