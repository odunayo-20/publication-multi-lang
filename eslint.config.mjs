import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  { ignores: ['.next/', 'node_modules/', 'src/payload-types.ts', 'src/app/(payload)/'] },
]

export default eslintConfig
