/* eslint-disable no-console */

export const appInit = () => {
  // disable console log for production
  const noop = () => {}
  if (process.env.NODE_ENV === 'production') {
    console.log = noop
    console.warn = noop
    console.error = noop
  }
}
