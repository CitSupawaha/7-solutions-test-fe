import type {
  DummyUser,
  DepartmentSummary,
  DepartmentGroupResult,
} from '../types/index.js';

/**
 * Transforms an array of users into department-grouped summaries.
 *
 * Performance: Single-pass O(n) iteration using reduce.
 * Each user is visited exactly once. Age min/max are tracked
 * incrementally and formatted only at the end.
 */
export function groupUsersByDepartment(users: DummyUser[]): DepartmentGroupResult {
  // Intermediate structure to track min/max ages during iteration
  interface DepartmentAccumulator extends Omit<DepartmentSummary, 'ageRange'> {
    minAge: number;
    maxAge: number;
  }

  const accumulator = users.reduce<Record<string, DepartmentAccumulator>>((acc, user) => {
    const department = user.company.department;
    let dept = acc[department];

    // Initialize department entry if first encounter
    if (!dept) {
      dept = {
        male: 0,
        female: 0,
        minAge: Infinity,
        maxAge: -Infinity,
        hair: {},
        addressUser: {},
      };
      acc[department] = dept;
    }

    // Gender count
    if (user.gender === 'male') {
      dept.male++;
    } else {
      dept.female++;
    }

    // Age tracking (min/max for range)
    dept.minAge = Math.min(dept.minAge, user.age);
    dept.maxAge = Math.max(dept.maxAge, user.age);

    // Hair color count
    const hairColor = user.hair.color;
    dept.hair[hairColor] = (dept.hair[hairColor] ?? 0) + 1;

    // Address mapping: "firstNamelastName" -> postalCode
    const userKey = `${user.firstName}${user.lastName}`;
    dept.addressUser[userKey] = user.address.postalCode;

    return acc;
  }, {});

  // Convert accumulator to final output format (format ageRange)
  const result: DepartmentGroupResult = {};

  for (const [department, dept] of Object.entries(accumulator)) {
    result[department] = {
      male: dept.male,
      female: dept.female,
      ageRange: `${dept.minAge}-${dept.maxAge}`,
      hair: dept.hair,
      addressUser: dept.addressUser,
    };
  }

  return result;
}
