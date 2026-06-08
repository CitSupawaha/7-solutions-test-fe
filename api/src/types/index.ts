// ---- Raw API Response Types ----

export interface DummyJsonResponse {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
}

// ---- Transformed Output Types ----

export interface DepartmentSummary {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export type DepartmentGroupResult = Record<string, DepartmentSummary>;
