import { type Dispatch, type SetStateAction } from 'react';
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

export const SearchBox = ({
  setAppState,
  filterValue,
  searchValue,
  setSearchValue,
}: SearchBoxProps) => {
  return (
    <RoundedContainer className={styles.searchBox}>
      <Input
        placeholder="Search tasks"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <OptionSelector
        options={FILTER_OPTIONS}
        onSelect={(value) => setAppState((prev) => ({ ...prev, filter: value }))}
        value={filterValue}
      />
    </RoundedContainer>
  );
};
