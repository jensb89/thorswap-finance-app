import { Midgard } from 'midgard-sdk'

import { config } from 'settings/config'

export const midgardApi = new Midgard(config.network)
