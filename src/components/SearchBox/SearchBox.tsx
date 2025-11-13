import { memo, useCallback, type Dispatch, type SetStateAction } from 'react';
import { RoundedContainer, OptionSelector, Input } from '@components';
import { FILTER_OPTIONS } from '@constants';
import type { AppState, FilterType } from '@types';

import styles from './SearchBox.module.scss';

interface SearchBoxProps {
  setAppState: Dispatch<SetStateAction<AppState>>;
  filterValue: FilterType;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const SearchBox = memo(({
  setAppState,
  filterValue,
  searchValue,
  setSearchValue,
}: SearchBoxProps) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue]
  );

  const handleFilterChange = useCallback(
    (value: FilterType) => {
      setAppState((prev) => ({ ...prev, filter: value }));
    },
    [setAppState]
  );

  return (
    <RoundedContainer className={styles.searchBox}>
      <Input
        placeholder="Search tasks"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <OptionSelector
        options={FILTER_OPTIONS}
        onSelect={handleFilterChange}
        value={filterValue}
      />
    </RoundedContainer>
  );
});
