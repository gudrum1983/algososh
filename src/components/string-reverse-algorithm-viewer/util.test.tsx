import {createStringReverseSnapshots} from './utils';

jest.mock('nanoid', () => {
  return {nanoid: () => 'mocId'};
});

describe('test of reversing a string with an even number of characters', () => {

  const testString: string = 'A+b=2C';
  const result = createStringReverseSnapshots(testString);
  const {state, snapshotStorage} = result;

  const step1 = [
    {'state': 'default', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '2', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'C', 'head': null, 'index': 5, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step2 = [
    {'state': 'changing', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '2', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': 'C', 'head': null, 'index': 5, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step3 = [
    {'state': 'modified', 'letter': 'C', 'head': null, 'index': 5, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '2', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step4 = [
    {'state': 'modified', 'letter': 'C', 'head': null, 'index': 5, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '2', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step5 = [
    {'state': 'modified', 'letter': 'C', 'head': null, 'index': 5, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '2', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];

  const ToBeState = step5;
  const ToBeStorage = [{'state': step1}, {'state': step2}, {'state': step3}, {'state': step4}, {'state': step5}];
  const testSnapshotStorage = snapshotStorage.showAllMementos();
  const initialData = state.getState();

  it('should return State', () => {
    expect(initialData).toEqual(ToBeState);
  });
  it('should return Snapshots', () => {
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });
});

describe('test of reversing a string with an odd number of characters', () => {

  const testString: string = 'A+b=5';
  const result = createStringReverseSnapshots(testString);
  const {state, snapshotStorage} = result;
  const step1 = [
    {'state': 'default', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '5', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step2 = [
    {'state': 'changing', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '5', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step3 = [
    {'state': 'modified', 'letter': '5', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'default', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step4 = [
    {'state': 'modified', 'letter': '5', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'changing', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const step5 = [
    {'state': 'modified', 'letter': '5', 'head': null, 'index': 4, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '=', 'head': null, 'index': 3, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'b', 'head': null, 'index': 2, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': '+', 'head': null, 'index': 1, 'tail': null, 'isSmall': false, 'id': 'mocId'},
    {'state': 'modified', 'letter': 'A', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'},
  ];
  const ToBeState = step5;
  const initialData = state.getState();
  const ToBeStorage = [{'state': step1}, {'state': step2}, {'state': step3}, {'state': step4}, {'state': step5}];
  const testSnapshotStorage = snapshotStorage.showAllMementos();

  it('should return State', () => {
    expect(initialData).toEqual(ToBeState);
  });
  it('should return Snapshots', () => {
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });
});

describe('test of reversing a string with one character', () => {

  const testString: string = '1';
  const result = createStringReverseSnapshots(testString);
  const {state, snapshotStorage} = result;
  const step1 = [
    {'state': 'modified', 'letter': '1', 'head': null, 'index': 0, 'tail': null, 'isSmall': false, 'id': 'mocId'}
  ];

  const ToBeState = step1;
  const initialData = state.getState();
  const ToBeStorage = [{'state': step1}];
  const testSnapshotStorage = snapshotStorage.showAllMementos();

  it('should return State', () => {
    expect(initialData).toEqual(ToBeState);
  });
  it('should return Snapshots', () => {
    expect(testSnapshotStorage).toEqual(ToBeStorage);
  });
});

describe('test of reversing an empty string', () => {
  it('throws an error if the input string is empty', () => {
    expect(() => createStringReverseSnapshots('')).toThrow('String cannot be empty');
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
