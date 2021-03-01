export default function withNonReactive<TData>(data: TData) {
  return <TNonReactive>() => data as TData & TNonReactive;
}
