export type Page<T> = {
  content: T[];
  last: boolean;
  first: boolean;
  empty: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};
