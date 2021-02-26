export const truncateAddress = (addr: string) => {
  if (addr && addr.length > 9) {
    const first = addr.substr(0, 6)
    const last = addr.substr(addr.length - 3, 3)
    return `${first}...${last}`
  }
  return addr
}
