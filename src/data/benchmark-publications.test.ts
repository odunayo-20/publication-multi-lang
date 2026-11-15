import { describe, expect, it } from 'vitest'
import {
  benchmarkPublications,
  getBenchmarkPublication,
  getBenchmarkRelatedPublications,
} from './benchmark-publications'

describe('benchmarkPublications', () => {
  it('resolves review-renewable-energy-rural-communities accurately', () => {
    const pub = getBenchmarkPublication('review-renewable-energy-rural-communities')
    expect(pub).toBeDefined()
    expect(pub?.title).toBe('A Review of Renewable Energy Solutions for Rural Communities')
    expect(pub?.doi).toBe('10.1234/acp.2025.003')
    expect(pub?.venue).toBe('International Journal of Engineering Research')
    expect(pub?.authors.length).toBeGreaterThan(0)
    expect(pub?.abstract).toContain('Access to reliable, affordable, and clean energy')
    expect(pub?.coverGradient).toBe('gradient-energy')
  })

  it('resolves machine-learning-approaches-smart-cities accurately', () => {
    const pub = getBenchmarkPublication('machine-learning-approaches-smart-cities')
    expect(pub).toBeDefined()
    expect(pub?.title).toBe('Machine Learning Approaches for Sustainable Smart Cities')
    expect(pub?.coverGradient).toBe('gradient-cs')
    expect(pub?.views).toBe('1.2k')
  })

  it('returns non-empty related publications excluding the current publication', () => {
    const related = getBenchmarkRelatedPublications('review-renewable-energy-rural-communities', 3)
    expect(related).toHaveLength(3)
    expect(related.every((r) => r.slug !== 'review-renewable-energy-rural-communities')).toBe(true)
  })

  it('contains all showcase articles referenced across the design', () => {
    const slugs = [
      'review-renewable-energy-rural-communities',
      'machine-learning-approaches-smart-cities',
      'impact-digital-learning-student-performance',
      'youth-participation-community-development',
      'real-time-flash-flood-forecasting-early-warning',
      'deep-learning-urban-traffic-management',
      'data-driven-energy-optimization',
      'ai-smart-city-infrastructure',
    ]

    for (const slug of slugs) {
      expect(benchmarkPublications[slug]).toBeDefined()
      expect(benchmarkPublications[slug].title).toBeTruthy()
      expect(benchmarkPublications[slug].authors.length).toBeGreaterThan(0)
    }
  })
})

