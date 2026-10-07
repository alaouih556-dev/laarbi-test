import { Generator, getConfig } from '@tanstack/router-generator'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const config = getConfig({}, root)

await new Generator({ config, root }).run()