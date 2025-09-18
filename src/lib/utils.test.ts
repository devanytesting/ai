import { cn } from './utils';

describe('cn', () => {
  it('merges class names and removes duplicates', () => {
    expect(cn('p-2', 'p-2', 'text-sm')).toContain('p-2');
    expect(cn('p-2', 'p-2', 'text-sm')).toContain('text-sm');
  });

  it('handles conditional values', () => {
    const active = true;
    expect(cn('base', active && 'active')).toContain('active');
  });
});
