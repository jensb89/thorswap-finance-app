/* eslint-disable no-console */

export const appInit = () => {
  // disable console log for production
  const noop = () => {}
  if (process.env.NODE_ENV !== 'development') {
    console.log = noop
    console.warn = noop
    console.error = noop
  }
}
