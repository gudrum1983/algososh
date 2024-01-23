import {CircleProps} from "../components/ui/circle/circle";
import {ColumnProps} from "../components/ui/column/column";

export type CircleBaseElement = Required<CircleProps> & {id: string}

export type ColumnBaseElement = Required<ColumnProps> & {id: string}

export type TSnapshot<T> = Array<T>

export type TSnapshotsList<T> = Array<Array<T>>

