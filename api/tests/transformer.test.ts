import { describe, it, expect } from 'vitest';
import { groupUsersByDepartment } from '../src/utils/transformer.js';
import type { DummyUser } from '../src/types/index.js';

const createMockUser = (overrides: Partial<DummyUser> = {}): DummyUser => ({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  gender: 'male',
  hair: { color: 'Black', type: 'Straight' },
  address: { postalCode: '12345' },
  company: { department: 'Engineering' },
  ...overrides,
});

describe('groupUsersByDepartment', () => {
  it('should return an empty object for empty input', () => {
    const result = groupUsersByDepartment([]);
    expect(result).toEqual({});
  });

  it('should group a single user correctly', () => {
    const users = [createMockUser()];
    const result = groupUsersByDepartment(users);

    expect(result).toEqual({
      Engineering: {
        male: 1,
        female: 0,
        ageRange: '30-30',
        hair: { Black: 1 },
        addressUser: { JohnDoe: '12345' },
      },
    });
  });

  it('should count male and female separately', () => {
    const users = [
      createMockUser({ gender: 'male', firstName: 'John' }),
      createMockUser({ id: 2, gender: 'female', firstName: 'Jane', age: 25 }),
    ];
    const result = groupUsersByDepartment(users);

    expect(result['Engineering']?.male).toBe(1);
    expect(result['Engineering']?.female).toBe(1);
  });

  it('should calculate age range correctly', () => {
    const users = [
      createMockUser({ age: 22, firstName: 'A' }),
      createMockUser({ id: 2, age: 45, firstName: 'B' }),
      createMockUser({ id: 3, age: 33, firstName: 'C' }),
    ];
    const result = groupUsersByDepartment(users);

    expect(result['Engineering']?.ageRange).toBe('22-45');
  });

  it('should aggregate hair colors', () => {
    const users = [
      createMockUser({ hair: { color: 'Black', type: '' }, firstName: 'A' }),
      createMockUser({ id: 2, hair: { color: 'Brown', type: '' }, firstName: 'B' }),
      createMockUser({ id: 3, hair: { color: 'Black', type: '' }, firstName: 'C' }),
    ];
    const result = groupUsersByDepartment(users);

    expect(result['Engineering']?.hair).toEqual({ Black: 2, Brown: 1 });
  });

  it('should map addressUser as firstNamelastName -> postalCode', () => {
    const users = [
      createMockUser({ firstName: 'Terry', lastName: 'Medhurst', address: { postalCode: '99301' } }),
    ];
    const result = groupUsersByDepartment(users);

    expect(result['Engineering']?.addressUser).toEqual({ TerryMedhurst: '99301' });
  });

  it('should group by multiple departments', () => {
    const users = [
      createMockUser({ company: { department: 'Engineering' }, firstName: 'A' }),
      createMockUser({ id: 2, company: { department: 'Marketing' }, firstName: 'B' }),
      createMockUser({ id: 3, company: { department: 'Engineering' }, firstName: 'C', gender: 'female' }),
    ];
    const result = groupUsersByDepartment(users);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result['Engineering']?.male).toBe(1);
    expect(result['Engineering']?.female).toBe(1);
    expect(result['Marketing']?.male).toBe(1);
    expect(result['Marketing']?.female).toBe(0);
  });

  it('should handle a large dataset efficiently', () => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Support'];
    const genders = ['male', 'female'];
    const hairColors = ['Black', 'Brown', 'Blond', 'White', 'Chestnut'];

    const users: DummyUser[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      age: 20 + (i % 40),
      gender: genders[i % 2]!,
      hair: { color: hairColors[i % 5]!, type: 'Straight' },
      address: { postalCode: `${10000 + i}` },
      company: { department: departments[i % 5]! },
    }));

    const start = performance.now();
    const result = groupUsersByDepartment(users);
    const elapsed = performance.now() - start;

    expect(Object.keys(result)).toHaveLength(5);
    expect(elapsed).toBeLessThan(50); // Should complete in < 50ms for 1000 users

    // Verify counts add up
    const totalUsers = Object.values(result).reduce((sum, dept) => sum + dept.male + dept.female, 0);
    expect(totalUsers).toBe(1000);
  });
});
