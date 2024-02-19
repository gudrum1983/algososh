import {IColumnComponent} from '../../utils/column';
import {ElementStates} from '../../types/element-states';
import {createBubbleSortingSnapshots, createSelectionSortingSnapshots} from './utils';
import {Direction} from '../../types/direction';

jest.mock('nanoid', () => {
  return {nanoid: () => 'mocId'};
});

const testArray: Array<IColumnComponent> = [
  {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
  {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
  {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
  {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
  {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
];

describe('Selection sort of an empty array', () => {
  const testEmptyArray: Array<IColumnComponent> = [];
  it('Ascending sort throws an error', () => {
    expect(() => createSelectionSortingSnapshots(testEmptyArray, Direction.Ascending)).toThrow('Array cannot be empty');
  });
  it('Descending sort throws an error', () => {
    expect(() => createSelectionSortingSnapshots(testEmptyArray, Direction.Descending)).toThrow('Array cannot be empty');
  });
});

describe('Bubble sort of an empty array', () => {
  const testEmptyArray: Array<IColumnComponent> = [];
  it('Ascending sort throws an error', () => {
    expect(() => createBubbleSortingSnapshots(testEmptyArray, Direction.Ascending)).toThrow('Array cannot be empty');
  });
  it('Descending sort throws an error', () => {
    expect(() => createBubbleSortingSnapshots(testEmptyArray, Direction.Descending)).toThrow('Array cannot be empty');
  });
});

describe('Selection sort of an array with one element', () => {
  const testArrayWithOneElement: Array<IColumnComponent> = testArray.slice(0, 1);
  const step1 = [{'index': 57, 'state': ElementStates.Default, 'id': 'mocId57'}];
  const step2 = [{'index': 57, 'state': ElementStates.Modified, 'id': 'mocId57'}];

  it('Selection ascending sort creates the state and snapshot storage', () => {
    const result = createSelectionSortingSnapshots(testArrayWithOneElement, Direction.Ascending);
    const {state, snapshotStorage} = result;
    const ToBeState = step2;
    const ToBeStorage = [{'state': step1}, {'state': step2}];
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

  it('Selection descending sort creates the state and snapshot storage', () => {
    const result = createSelectionSortingSnapshots(testArrayWithOneElement, Direction.Descending);
    const {state, snapshotStorage} = result;
    const ToBeState = step2;
    const ToBeStorage = [{'state': step1}, {'state': step2}];
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

});

describe('Bubble sort of an array with one element', () => {
  const testArrayWithOneElement: Array<IColumnComponent> = testArray.slice(0, 1);
  const step1 = [{'index': 57, 'state': ElementStates.Default, 'id': 'mocId57'}];
  const step2 = [{'index': 57, 'state': ElementStates.Modified, 'id': 'mocId57'}];

  it('Bubble ascending sort creates the state and snapshot storage', () => {
    const result = createBubbleSortingSnapshots(testArrayWithOneElement, Direction.Ascending);
    const {state, snapshotStorage} = result;
    const ToBeState = step2;
    const ToBeStorage = [{'state': step1}, {'state': step2}];
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

  it('Bubble descending sort creates the state and snapshot storage', () => {
    const result = createBubbleSortingSnapshots(testArrayWithOneElement, Direction.Descending);
    const {state, snapshotStorage} = result;
    const ToBeState = step2;
    const ToBeStorage = [{'state': step1}, {'state': step2}];
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

});

describe('Selection sort of an array with multiple elements', () => {


  it('Selection ascending sort creates the state and snapshot storage', () => {
    const SnapshotStorage = [
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}]
      }
    ];


    const stepFinish = [
      {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
      {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
      {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
      {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
      {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}];
    const result = createSelectionSortingSnapshots(testArray, Direction.Ascending);
    const {state, snapshotStorage} = result;
    const ToBeState = stepFinish;
    const ToBeStorage = SnapshotStorage;
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

  it('Selection descending sort creates the state and snapshot storage', () => {


    const SnapshotStorage = [{
      'state': [
        {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
        {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
        {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
        {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
        {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
    },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'}]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}]
      }];

    const stepFinish = [
      {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
      {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
      {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
      {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
      {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}];


    const result = createSelectionSortingSnapshots(testArray, Direction.Descending);
    const {state, snapshotStorage} = result;
    const ToBeState = stepFinish;
    const ToBeStorage = SnapshotStorage;
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

});


describe('Bubble sort of an array with multiple elements', () => {
  it('Bubble ascending sort creates the state and snapshot storage with swapped', () => {
    const SnapshotStorage = [
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}
        ]
      }
    ];
    const stepFinish = [
      {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'},
      {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
      {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
      {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
      {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'}];
    const result = createBubbleSortingSnapshots(testArray, Direction.Ascending);
    const {state, snapshotStorage} = result;
    const ToBeState = stepFinish;
    const ToBeStorage = SnapshotStorage;
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });

  it('Bubble descending sort creates the state and snapshot storage with swapped', () => {
    const SnapshotStorage = [
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Changing, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Changing, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Default, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ]
      },
      {
        'state': [
          {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
          {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
          {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
          {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
          {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}
        ] 
      }
    ];
    const stepFinish = [
      {'state': ElementStates.Modified, 'index': 95, 'id': 'mocId95'},
      {'state': ElementStates.Modified, 'index': 73, 'id': 'mocId73'},
      {'state': ElementStates.Modified, 'index': 57, 'id': 'mocId57'},
      {'state': ElementStates.Modified, 'index': 45, 'id': 'mocId45'},
      {'state': ElementStates.Modified, 'index': 25, 'id': 'mocId25'}];
    const result = createBubbleSortingSnapshots(testArray, Direction.Descending);
    const {state, snapshotStorage} = result;
    const ToBeState = stepFinish;
    const ToBeStorage = SnapshotStorage;
    const initialData = state.getState();
    const testSnapshotStorage = snapshotStorage.showAllMementos();
    expect(initialData).toEqual(ToBeState);
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
