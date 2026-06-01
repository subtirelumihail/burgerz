export interface BurgerSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
}
