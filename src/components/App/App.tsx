import {
  Header,
  EmptyBox,
  CreateBox,
  TasksList,
  ColumnList,
  DeleteSection,
  SearchBox,
  BulkActionSidebar,
} from '@components';
import { useApp } from '@components/App/useApp.ts';

import styles from './App.module.scss';

export const App = () => {
  const {
    appState,
    setAppState,
    isDragging,
    searchValue,
    setSearchValue,
    handleAddBtnClick,
    handleUpdateTask,
    handleDeleteColumn,
    handleDeleteTask,
    toggleColumnCheckmark,
    handleBulkDelete,
    handleBulkComplete,
    handleBulkIncomplete,
    handleBulkMove,
    handleCreateOptionChange,
    sortedUnassignedTasks,
    sortedColumns,
    sortedTasksWithColumn,
    selectedTasks,
    isStateEmpty,
  } = useApp();

  return (
    <div className={styles.container}>
      <Header />

      <BulkActionSidebar
        selectedCount={selectedTasks.length}
        onDelete={handleBulkDelete}
        onMarkComplete={handleBulkComplete}
        onMarkIncomplete={handleBulkIncomplete}
        onMove={handleBulkMove}
        columns={appState.columns}
      />

      <div className={styles.container__mainContent}>
        <div className={styles.actionBoxes}>
          <CreateBox
            creationType={appState.createOption}
            onAddBtnClick={handleAddBtnClick}
            onSelect={handleCreateOptionChange}
          />

          <SearchBox
            setAppState={setAppState}
            filterValue={appState.filter}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        {isStateEmpty && <EmptyBox />}

        {!isStateEmpty && (
          <>
            <TasksList
              tasks={sortedUnassignedTasks}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              searchValue={searchValue}
            />
          </>
        )}

        {!!appState.columns && (
          <ColumnList
            columns={sortedColumns}
            tasks={sortedTasksWithColumn}
            onTaskUpdate={handleUpdateTask}
            onColumnDelete={handleDeleteColumn}
            onTaskDelete={handleDeleteTask}
            onCheckMarkToggle={toggleColumnCheckmark}
            searchValue={searchValue}
          />
        )}

        <DeleteSection isVisible={isDragging} />
      </div>
    </div>
  );
};
