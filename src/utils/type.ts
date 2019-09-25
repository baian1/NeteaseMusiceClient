interface ActionFunction {
  [index: string]: (...args: any) => any
}

type getAllAction<T extends ActionFunction> = {
  [P in keyof T]: T[P]
}[keyof T]

export type getActionReturnType<T extends ActionFunction> = ReturnType<
  getAllAction<T>
>

interface ReducersInterface {
  [index: string]: (...args: any) => any
}

export type getStoreTypeFromReducers<T extends ReducersInterface> = {
  [P in keyof T]: NonNullable<ReturnType<T[P]>>
}
