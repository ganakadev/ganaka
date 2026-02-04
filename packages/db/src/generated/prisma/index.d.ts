
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Developer
 * 
 */
export type Developer = $Result.DefaultSelection<Prisma.$DeveloperPayload>
/**
 * Model Run
 * 
 */
export type Run = $Result.DefaultSelection<Prisma.$RunPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model NseIntrument
 * 
 */
export type NseIntrument = $Result.DefaultSelection<Prisma.$NseIntrumentPayload>
/**
 * Model NseCandle
 * 
 */
export type NseCandle = $Result.DefaultSelection<Prisma.$NseCandlePayload>
/**
 * Model NseHoliday
 * 
 */
export type NseHoliday = $Result.DefaultSelection<Prisma.$NseHolidayPayload>
/**
 * Model ShortlistSnapshot
 * 
 */
export type ShortlistSnapshot = $Result.DefaultSelection<Prisma.$ShortlistSnapshotPayload>
/**
 * Model CollectorError
 * 
 */
export type CollectorError = $Result.DefaultSelection<Prisma.$CollectorErrorPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ShortlistType: {
  TOP_GAINERS: 'TOP_GAINERS',
  VOLUME_SHOCKERS: 'VOLUME_SHOCKERS'
};

export type ShortlistType = (typeof ShortlistType)[keyof typeof ShortlistType]


export const ShortlistScope: {
  FULL: 'FULL',
  TOP_5: 'TOP_5'
};

export type ShortlistScope = (typeof ShortlistScope)[keyof typeof ShortlistScope]

}

export type ShortlistType = $Enums.ShortlistType

export const ShortlistType: typeof $Enums.ShortlistType

export type ShortlistScope = $Enums.ShortlistScope

export const ShortlistScope: typeof $Enums.ShortlistScope

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Developers
 * const developers = await prisma.developer.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Developers
   * const developers = await prisma.developer.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.developer`: Exposes CRUD operations for the **Developer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Developers
    * const developers = await prisma.developer.findMany()
    * ```
    */
  get developer(): Prisma.DeveloperDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.run`: Exposes CRUD operations for the **Run** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Runs
    * const runs = await prisma.run.findMany()
    * ```
    */
  get run(): Prisma.RunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nseIntrument`: Exposes CRUD operations for the **NseIntrument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NseIntruments
    * const nseIntruments = await prisma.nseIntrument.findMany()
    * ```
    */
  get nseIntrument(): Prisma.NseIntrumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nseCandle`: Exposes CRUD operations for the **NseCandle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NseCandles
    * const nseCandles = await prisma.nseCandle.findMany()
    * ```
    */
  get nseCandle(): Prisma.NseCandleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nseHoliday`: Exposes CRUD operations for the **NseHoliday** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NseHolidays
    * const nseHolidays = await prisma.nseHoliday.findMany()
    * ```
    */
  get nseHoliday(): Prisma.NseHolidayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shortlistSnapshot`: Exposes CRUD operations for the **ShortlistSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShortlistSnapshots
    * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany()
    * ```
    */
  get shortlistSnapshot(): Prisma.ShortlistSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collectorError`: Exposes CRUD operations for the **CollectorError** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CollectorErrors
    * const collectorErrors = await prisma.collectorError.findMany()
    * ```
    */
  get collectorError(): Prisma.CollectorErrorDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Developer: 'Developer',
    Run: 'Run',
    Order: 'Order',
    NseIntrument: 'NseIntrument',
    NseCandle: 'NseCandle',
    NseHoliday: 'NseHoliday',
    ShortlistSnapshot: 'ShortlistSnapshot',
    CollectorError: 'CollectorError'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "developer" | "run" | "order" | "nseIntrument" | "nseCandle" | "nseHoliday" | "shortlistSnapshot" | "collectorError"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Developer: {
        payload: Prisma.$DeveloperPayload<ExtArgs>
        fields: Prisma.DeveloperFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeveloperFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeveloperFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          findFirst: {
            args: Prisma.DeveloperFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeveloperFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          findMany: {
            args: Prisma.DeveloperFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>[]
          }
          create: {
            args: Prisma.DeveloperCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          createMany: {
            args: Prisma.DeveloperCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeveloperCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>[]
          }
          delete: {
            args: Prisma.DeveloperDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          update: {
            args: Prisma.DeveloperUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          deleteMany: {
            args: Prisma.DeveloperDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeveloperUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeveloperUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>[]
          }
          upsert: {
            args: Prisma.DeveloperUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperPayload>
          }
          aggregate: {
            args: Prisma.DeveloperAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeveloper>
          }
          groupBy: {
            args: Prisma.DeveloperGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeveloperGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeveloperCountArgs<ExtArgs>
            result: $Utils.Optional<DeveloperCountAggregateOutputType> | number
          }
        }
      }
      Run: {
        payload: Prisma.$RunPayload<ExtArgs>
        fields: Prisma.RunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          findFirst: {
            args: Prisma.RunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          findMany: {
            args: Prisma.RunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>[]
          }
          create: {
            args: Prisma.RunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          createMany: {
            args: Prisma.RunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>[]
          }
          delete: {
            args: Prisma.RunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          update: {
            args: Prisma.RunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          deleteMany: {
            args: Prisma.RunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>[]
          }
          upsert: {
            args: Prisma.RunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunPayload>
          }
          aggregate: {
            args: Prisma.RunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRun>
          }
          groupBy: {
            args: Prisma.RunGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunCountArgs<ExtArgs>
            result: $Utils.Optional<RunCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      NseIntrument: {
        payload: Prisma.$NseIntrumentPayload<ExtArgs>
        fields: Prisma.NseIntrumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NseIntrumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NseIntrumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          findFirst: {
            args: Prisma.NseIntrumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NseIntrumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          findMany: {
            args: Prisma.NseIntrumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>[]
          }
          create: {
            args: Prisma.NseIntrumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          createMany: {
            args: Prisma.NseIntrumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NseIntrumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>[]
          }
          delete: {
            args: Prisma.NseIntrumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          update: {
            args: Prisma.NseIntrumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          deleteMany: {
            args: Prisma.NseIntrumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NseIntrumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NseIntrumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>[]
          }
          upsert: {
            args: Prisma.NseIntrumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseIntrumentPayload>
          }
          aggregate: {
            args: Prisma.NseIntrumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNseIntrument>
          }
          groupBy: {
            args: Prisma.NseIntrumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<NseIntrumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.NseIntrumentCountArgs<ExtArgs>
            result: $Utils.Optional<NseIntrumentCountAggregateOutputType> | number
          }
        }
      }
      NseCandle: {
        payload: Prisma.$NseCandlePayload<ExtArgs>
        fields: Prisma.NseCandleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NseCandleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NseCandleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          findFirst: {
            args: Prisma.NseCandleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NseCandleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          findMany: {
            args: Prisma.NseCandleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>[]
          }
          create: {
            args: Prisma.NseCandleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          createMany: {
            args: Prisma.NseCandleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NseCandleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>[]
          }
          delete: {
            args: Prisma.NseCandleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          update: {
            args: Prisma.NseCandleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          deleteMany: {
            args: Prisma.NseCandleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NseCandleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NseCandleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>[]
          }
          upsert: {
            args: Prisma.NseCandleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseCandlePayload>
          }
          aggregate: {
            args: Prisma.NseCandleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNseCandle>
          }
          groupBy: {
            args: Prisma.NseCandleGroupByArgs<ExtArgs>
            result: $Utils.Optional<NseCandleGroupByOutputType>[]
          }
          count: {
            args: Prisma.NseCandleCountArgs<ExtArgs>
            result: $Utils.Optional<NseCandleCountAggregateOutputType> | number
          }
        }
      }
      NseHoliday: {
        payload: Prisma.$NseHolidayPayload<ExtArgs>
        fields: Prisma.NseHolidayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NseHolidayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NseHolidayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          findFirst: {
            args: Prisma.NseHolidayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NseHolidayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          findMany: {
            args: Prisma.NseHolidayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>[]
          }
          create: {
            args: Prisma.NseHolidayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          createMany: {
            args: Prisma.NseHolidayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NseHolidayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>[]
          }
          delete: {
            args: Prisma.NseHolidayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          update: {
            args: Prisma.NseHolidayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          deleteMany: {
            args: Prisma.NseHolidayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NseHolidayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NseHolidayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>[]
          }
          upsert: {
            args: Prisma.NseHolidayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NseHolidayPayload>
          }
          aggregate: {
            args: Prisma.NseHolidayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNseHoliday>
          }
          groupBy: {
            args: Prisma.NseHolidayGroupByArgs<ExtArgs>
            result: $Utils.Optional<NseHolidayGroupByOutputType>[]
          }
          count: {
            args: Prisma.NseHolidayCountArgs<ExtArgs>
            result: $Utils.Optional<NseHolidayCountAggregateOutputType> | number
          }
        }
      }
      ShortlistSnapshot: {
        payload: Prisma.$ShortlistSnapshotPayload<ExtArgs>
        fields: Prisma.ShortlistSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShortlistSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShortlistSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          findFirst: {
            args: Prisma.ShortlistSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShortlistSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          findMany: {
            args: Prisma.ShortlistSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>[]
          }
          create: {
            args: Prisma.ShortlistSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          createMany: {
            args: Prisma.ShortlistSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShortlistSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>[]
          }
          delete: {
            args: Prisma.ShortlistSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          update: {
            args: Prisma.ShortlistSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.ShortlistSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShortlistSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShortlistSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.ShortlistSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShortlistSnapshotPayload>
          }
          aggregate: {
            args: Prisma.ShortlistSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShortlistSnapshot>
          }
          groupBy: {
            args: Prisma.ShortlistSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShortlistSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShortlistSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<ShortlistSnapshotCountAggregateOutputType> | number
          }
        }
      }
      CollectorError: {
        payload: Prisma.$CollectorErrorPayload<ExtArgs>
        fields: Prisma.CollectorErrorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectorErrorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectorErrorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          findFirst: {
            args: Prisma.CollectorErrorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectorErrorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          findMany: {
            args: Prisma.CollectorErrorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>[]
          }
          create: {
            args: Prisma.CollectorErrorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          createMany: {
            args: Prisma.CollectorErrorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectorErrorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>[]
          }
          delete: {
            args: Prisma.CollectorErrorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          update: {
            args: Prisma.CollectorErrorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          deleteMany: {
            args: Prisma.CollectorErrorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectorErrorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollectorErrorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>[]
          }
          upsert: {
            args: Prisma.CollectorErrorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectorErrorPayload>
          }
          aggregate: {
            args: Prisma.CollectorErrorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollectorError>
          }
          groupBy: {
            args: Prisma.CollectorErrorGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectorErrorGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectorErrorCountArgs<ExtArgs>
            result: $Utils.Optional<CollectorErrorCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    developer?: DeveloperOmit
    run?: RunOmit
    order?: OrderOmit
    nseIntrument?: NseIntrumentOmit
    nseCandle?: NseCandleOmit
    nseHoliday?: NseHolidayOmit
    shortlistSnapshot?: ShortlistSnapshotOmit
    collectorError?: CollectorErrorOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DeveloperCountOutputType
   */

  export type DeveloperCountOutputType = {
    runs: number
  }

  export type DeveloperCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    runs?: boolean | DeveloperCountOutputTypeCountRunsArgs
  }

  // Custom InputTypes
  /**
   * DeveloperCountOutputType without action
   */
  export type DeveloperCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperCountOutputType
     */
    select?: DeveloperCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeveloperCountOutputType without action
   */
  export type DeveloperCountOutputTypeCountRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunWhereInput
  }


  /**
   * Count Type RunCountOutputType
   */

  export type RunCountOutputType = {
    orders: number
  }

  export type RunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | RunCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * RunCountOutputType without action
   */
  export type RunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunCountOutputType
     */
    select?: RunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RunCountOutputType without action
   */
  export type RunCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }


  /**
   * Count Type NseIntrumentCountOutputType
   */

  export type NseIntrumentCountOutputType = {
    candles: number
  }

  export type NseIntrumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    candles?: boolean | NseIntrumentCountOutputTypeCountCandlesArgs
  }

  // Custom InputTypes
  /**
   * NseIntrumentCountOutputType without action
   */
  export type NseIntrumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrumentCountOutputType
     */
    select?: NseIntrumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NseIntrumentCountOutputType without action
   */
  export type NseIntrumentCountOutputTypeCountCandlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NseCandleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Developer
   */

  export type AggregateDeveloper = {
    _count: DeveloperCountAggregateOutputType | null
    _min: DeveloperMinAggregateOutputType | null
    _max: DeveloperMaxAggregateOutputType | null
  }

  export type DeveloperMinAggregateOutputType = {
    id: string | null
    username: string | null
    token: string | null
    growwApiKey: string | null
    growwApiSecret: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeveloperMaxAggregateOutputType = {
    id: string | null
    username: string | null
    token: string | null
    growwApiKey: string | null
    growwApiSecret: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeveloperCountAggregateOutputType = {
    id: number
    username: number
    token: number
    growwApiKey: number
    growwApiSecret: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeveloperMinAggregateInputType = {
    id?: true
    username?: true
    token?: true
    growwApiKey?: true
    growwApiSecret?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeveloperMaxAggregateInputType = {
    id?: true
    username?: true
    token?: true
    growwApiKey?: true
    growwApiSecret?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeveloperCountAggregateInputType = {
    id?: true
    username?: true
    token?: true
    growwApiKey?: true
    growwApiSecret?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeveloperAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Developer to aggregate.
     */
    where?: DeveloperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Developers to fetch.
     */
    orderBy?: DeveloperOrderByWithRelationInput | DeveloperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeveloperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Developers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Developers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Developers
    **/
    _count?: true | DeveloperCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeveloperMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeveloperMaxAggregateInputType
  }

  export type GetDeveloperAggregateType<T extends DeveloperAggregateArgs> = {
        [P in keyof T & keyof AggregateDeveloper]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeveloper[P]>
      : GetScalarType<T[P], AggregateDeveloper[P]>
  }




  export type DeveloperGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeveloperWhereInput
    orderBy?: DeveloperOrderByWithAggregationInput | DeveloperOrderByWithAggregationInput[]
    by: DeveloperScalarFieldEnum[] | DeveloperScalarFieldEnum
    having?: DeveloperScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeveloperCountAggregateInputType | true
    _min?: DeveloperMinAggregateInputType
    _max?: DeveloperMaxAggregateInputType
  }

  export type DeveloperGroupByOutputType = {
    id: string
    username: string
    token: string
    growwApiKey: string | null
    growwApiSecret: string | null
    createdAt: Date
    updatedAt: Date
    _count: DeveloperCountAggregateOutputType | null
    _min: DeveloperMinAggregateOutputType | null
    _max: DeveloperMaxAggregateOutputType | null
  }

  type GetDeveloperGroupByPayload<T extends DeveloperGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeveloperGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeveloperGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeveloperGroupByOutputType[P]>
            : GetScalarType<T[P], DeveloperGroupByOutputType[P]>
        }
      >
    >


  export type DeveloperSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    token?: boolean
    growwApiKey?: boolean
    growwApiSecret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    runs?: boolean | Developer$runsArgs<ExtArgs>
    _count?: boolean | DeveloperCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["developer"]>

  export type DeveloperSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    token?: boolean
    growwApiKey?: boolean
    growwApiSecret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["developer"]>

  export type DeveloperSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    token?: boolean
    growwApiKey?: boolean
    growwApiSecret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["developer"]>

  export type DeveloperSelectScalar = {
    id?: boolean
    username?: boolean
    token?: boolean
    growwApiKey?: boolean
    growwApiSecret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeveloperOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "token" | "growwApiKey" | "growwApiSecret" | "createdAt" | "updatedAt", ExtArgs["result"]["developer"]>
  export type DeveloperInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    runs?: boolean | Developer$runsArgs<ExtArgs>
    _count?: boolean | DeveloperCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeveloperIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DeveloperIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DeveloperPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Developer"
    objects: {
      runs: Prisma.$RunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      token: string
      /**
       * @encrypted
       */
      growwApiKey: string | null
      /**
       * @encrypted 
       */
      growwApiSecret: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["developer"]>
    composites: {}
  }

  type DeveloperGetPayload<S extends boolean | null | undefined | DeveloperDefaultArgs> = $Result.GetResult<Prisma.$DeveloperPayload, S>

  type DeveloperCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeveloperFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeveloperCountAggregateInputType | true
    }

  export interface DeveloperDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Developer'], meta: { name: 'Developer' } }
    /**
     * Find zero or one Developer that matches the filter.
     * @param {DeveloperFindUniqueArgs} args - Arguments to find a Developer
     * @example
     * // Get one Developer
     * const developer = await prisma.developer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeveloperFindUniqueArgs>(args: SelectSubset<T, DeveloperFindUniqueArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Developer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeveloperFindUniqueOrThrowArgs} args - Arguments to find a Developer
     * @example
     * // Get one Developer
     * const developer = await prisma.developer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeveloperFindUniqueOrThrowArgs>(args: SelectSubset<T, DeveloperFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Developer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperFindFirstArgs} args - Arguments to find a Developer
     * @example
     * // Get one Developer
     * const developer = await prisma.developer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeveloperFindFirstArgs>(args?: SelectSubset<T, DeveloperFindFirstArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Developer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperFindFirstOrThrowArgs} args - Arguments to find a Developer
     * @example
     * // Get one Developer
     * const developer = await prisma.developer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeveloperFindFirstOrThrowArgs>(args?: SelectSubset<T, DeveloperFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Developers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Developers
     * const developers = await prisma.developer.findMany()
     * 
     * // Get first 10 Developers
     * const developers = await prisma.developer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const developerWithIdOnly = await prisma.developer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeveloperFindManyArgs>(args?: SelectSubset<T, DeveloperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Developer.
     * @param {DeveloperCreateArgs} args - Arguments to create a Developer.
     * @example
     * // Create one Developer
     * const Developer = await prisma.developer.create({
     *   data: {
     *     // ... data to create a Developer
     *   }
     * })
     * 
     */
    create<T extends DeveloperCreateArgs>(args: SelectSubset<T, DeveloperCreateArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Developers.
     * @param {DeveloperCreateManyArgs} args - Arguments to create many Developers.
     * @example
     * // Create many Developers
     * const developer = await prisma.developer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeveloperCreateManyArgs>(args?: SelectSubset<T, DeveloperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Developers and returns the data saved in the database.
     * @param {DeveloperCreateManyAndReturnArgs} args - Arguments to create many Developers.
     * @example
     * // Create many Developers
     * const developer = await prisma.developer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Developers and only return the `id`
     * const developerWithIdOnly = await prisma.developer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeveloperCreateManyAndReturnArgs>(args?: SelectSubset<T, DeveloperCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Developer.
     * @param {DeveloperDeleteArgs} args - Arguments to delete one Developer.
     * @example
     * // Delete one Developer
     * const Developer = await prisma.developer.delete({
     *   where: {
     *     // ... filter to delete one Developer
     *   }
     * })
     * 
     */
    delete<T extends DeveloperDeleteArgs>(args: SelectSubset<T, DeveloperDeleteArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Developer.
     * @param {DeveloperUpdateArgs} args - Arguments to update one Developer.
     * @example
     * // Update one Developer
     * const developer = await prisma.developer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeveloperUpdateArgs>(args: SelectSubset<T, DeveloperUpdateArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Developers.
     * @param {DeveloperDeleteManyArgs} args - Arguments to filter Developers to delete.
     * @example
     * // Delete a few Developers
     * const { count } = await prisma.developer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeveloperDeleteManyArgs>(args?: SelectSubset<T, DeveloperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Developers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Developers
     * const developer = await prisma.developer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeveloperUpdateManyArgs>(args: SelectSubset<T, DeveloperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Developers and returns the data updated in the database.
     * @param {DeveloperUpdateManyAndReturnArgs} args - Arguments to update many Developers.
     * @example
     * // Update many Developers
     * const developer = await prisma.developer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Developers and only return the `id`
     * const developerWithIdOnly = await prisma.developer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeveloperUpdateManyAndReturnArgs>(args: SelectSubset<T, DeveloperUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Developer.
     * @param {DeveloperUpsertArgs} args - Arguments to update or create a Developer.
     * @example
     * // Update or create a Developer
     * const developer = await prisma.developer.upsert({
     *   create: {
     *     // ... data to create a Developer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Developer we want to update
     *   }
     * })
     */
    upsert<T extends DeveloperUpsertArgs>(args: SelectSubset<T, DeveloperUpsertArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Developers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperCountArgs} args - Arguments to filter Developers to count.
     * @example
     * // Count the number of Developers
     * const count = await prisma.developer.count({
     *   where: {
     *     // ... the filter for the Developers we want to count
     *   }
     * })
    **/
    count<T extends DeveloperCountArgs>(
      args?: Subset<T, DeveloperCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeveloperCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Developer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeveloperAggregateArgs>(args: Subset<T, DeveloperAggregateArgs>): Prisma.PrismaPromise<GetDeveloperAggregateType<T>>

    /**
     * Group by Developer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeveloperGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeveloperGroupByArgs['orderBy'] }
        : { orderBy?: DeveloperGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeveloperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeveloperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Developer model
   */
  readonly fields: DeveloperFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Developer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeveloperClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    runs<T extends Developer$runsArgs<ExtArgs> = {}>(args?: Subset<T, Developer$runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Developer model
   */
  interface DeveloperFieldRefs {
    readonly id: FieldRef<"Developer", 'String'>
    readonly username: FieldRef<"Developer", 'String'>
    readonly token: FieldRef<"Developer", 'String'>
    readonly growwApiKey: FieldRef<"Developer", 'String'>
    readonly growwApiSecret: FieldRef<"Developer", 'String'>
    readonly createdAt: FieldRef<"Developer", 'DateTime'>
    readonly updatedAt: FieldRef<"Developer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Developer findUnique
   */
  export type DeveloperFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter, which Developer to fetch.
     */
    where: DeveloperWhereUniqueInput
  }

  /**
   * Developer findUniqueOrThrow
   */
  export type DeveloperFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter, which Developer to fetch.
     */
    where: DeveloperWhereUniqueInput
  }

  /**
   * Developer findFirst
   */
  export type DeveloperFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter, which Developer to fetch.
     */
    where?: DeveloperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Developers to fetch.
     */
    orderBy?: DeveloperOrderByWithRelationInput | DeveloperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Developers.
     */
    cursor?: DeveloperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Developers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Developers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Developers.
     */
    distinct?: DeveloperScalarFieldEnum | DeveloperScalarFieldEnum[]
  }

  /**
   * Developer findFirstOrThrow
   */
  export type DeveloperFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter, which Developer to fetch.
     */
    where?: DeveloperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Developers to fetch.
     */
    orderBy?: DeveloperOrderByWithRelationInput | DeveloperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Developers.
     */
    cursor?: DeveloperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Developers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Developers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Developers.
     */
    distinct?: DeveloperScalarFieldEnum | DeveloperScalarFieldEnum[]
  }

  /**
   * Developer findMany
   */
  export type DeveloperFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter, which Developers to fetch.
     */
    where?: DeveloperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Developers to fetch.
     */
    orderBy?: DeveloperOrderByWithRelationInput | DeveloperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Developers.
     */
    cursor?: DeveloperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Developers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Developers.
     */
    skip?: number
    distinct?: DeveloperScalarFieldEnum | DeveloperScalarFieldEnum[]
  }

  /**
   * Developer create
   */
  export type DeveloperCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * The data needed to create a Developer.
     */
    data: XOR<DeveloperCreateInput, DeveloperUncheckedCreateInput>
  }

  /**
   * Developer createMany
   */
  export type DeveloperCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Developers.
     */
    data: DeveloperCreateManyInput | DeveloperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Developer createManyAndReturn
   */
  export type DeveloperCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * The data used to create many Developers.
     */
    data: DeveloperCreateManyInput | DeveloperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Developer update
   */
  export type DeveloperUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * The data needed to update a Developer.
     */
    data: XOR<DeveloperUpdateInput, DeveloperUncheckedUpdateInput>
    /**
     * Choose, which Developer to update.
     */
    where: DeveloperWhereUniqueInput
  }

  /**
   * Developer updateMany
   */
  export type DeveloperUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Developers.
     */
    data: XOR<DeveloperUpdateManyMutationInput, DeveloperUncheckedUpdateManyInput>
    /**
     * Filter which Developers to update
     */
    where?: DeveloperWhereInput
    /**
     * Limit how many Developers to update.
     */
    limit?: number
  }

  /**
   * Developer updateManyAndReturn
   */
  export type DeveloperUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * The data used to update Developers.
     */
    data: XOR<DeveloperUpdateManyMutationInput, DeveloperUncheckedUpdateManyInput>
    /**
     * Filter which Developers to update
     */
    where?: DeveloperWhereInput
    /**
     * Limit how many Developers to update.
     */
    limit?: number
  }

  /**
   * Developer upsert
   */
  export type DeveloperUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * The filter to search for the Developer to update in case it exists.
     */
    where: DeveloperWhereUniqueInput
    /**
     * In case the Developer found by the `where` argument doesn't exist, create a new Developer with this data.
     */
    create: XOR<DeveloperCreateInput, DeveloperUncheckedCreateInput>
    /**
     * In case the Developer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeveloperUpdateInput, DeveloperUncheckedUpdateInput>
  }

  /**
   * Developer delete
   */
  export type DeveloperDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    /**
     * Filter which Developer to delete.
     */
    where: DeveloperWhereUniqueInput
  }

  /**
   * Developer deleteMany
   */
  export type DeveloperDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Developers to delete
     */
    where?: DeveloperWhereInput
    /**
     * Limit how many Developers to delete.
     */
    limit?: number
  }

  /**
   * Developer.runs
   */
  export type Developer$runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    where?: RunWhereInput
    orderBy?: RunOrderByWithRelationInput | RunOrderByWithRelationInput[]
    cursor?: RunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunScalarFieldEnum | RunScalarFieldEnum[]
  }

  /**
   * Developer without action
   */
  export type DeveloperDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
  }


  /**
   * Model Run
   */

  export type AggregateRun = {
    _count: RunCountAggregateOutputType | null
    _min: RunMinAggregateOutputType | null
    _max: RunMaxAggregateOutputType | null
  }

  export type RunMinAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    completed: boolean | null
    name: string | null
    developerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RunMaxAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    completed: boolean | null
    name: string | null
    developerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RunCountAggregateOutputType = {
    id: number
    startTime: number
    endTime: number
    completed: number
    name: number
    tags: number
    developerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RunMinAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    completed?: true
    name?: true
    developerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RunMaxAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    completed?: true
    name?: true
    developerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RunCountAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    completed?: true
    name?: true
    tags?: true
    developerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Run to aggregate.
     */
    where?: RunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Runs to fetch.
     */
    orderBy?: RunOrderByWithRelationInput | RunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Runs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Runs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Runs
    **/
    _count?: true | RunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RunMaxAggregateInputType
  }

  export type GetRunAggregateType<T extends RunAggregateArgs> = {
        [P in keyof T & keyof AggregateRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRun[P]>
      : GetScalarType<T[P], AggregateRun[P]>
  }




  export type RunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunWhereInput
    orderBy?: RunOrderByWithAggregationInput | RunOrderByWithAggregationInput[]
    by: RunScalarFieldEnum[] | RunScalarFieldEnum
    having?: RunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunCountAggregateInputType | true
    _min?: RunMinAggregateInputType
    _max?: RunMaxAggregateInputType
  }

  export type RunGroupByOutputType = {
    id: string
    startTime: Date
    endTime: Date
    completed: boolean
    name: string | null
    tags: string[]
    developerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: RunCountAggregateOutputType | null
    _min: RunMinAggregateOutputType | null
    _max: RunMaxAggregateOutputType | null
  }

  type GetRunGroupByPayload<T extends RunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RunGroupByOutputType[P]>
            : GetScalarType<T[P], RunGroupByOutputType[P]>
        }
      >
    >


  export type RunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    completed?: boolean
    name?: boolean
    tags?: boolean
    developerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orders?: boolean | Run$ordersArgs<ExtArgs>
    developer?: boolean | Run$developerArgs<ExtArgs>
    _count?: boolean | RunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["run"]>

  export type RunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    completed?: boolean
    name?: boolean
    tags?: boolean
    developerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    developer?: boolean | Run$developerArgs<ExtArgs>
  }, ExtArgs["result"]["run"]>

  export type RunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    completed?: boolean
    name?: boolean
    tags?: boolean
    developerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    developer?: boolean | Run$developerArgs<ExtArgs>
  }, ExtArgs["result"]["run"]>

  export type RunSelectScalar = {
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    completed?: boolean
    name?: boolean
    tags?: boolean
    developerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "startTime" | "endTime" | "completed" | "name" | "tags" | "developerId" | "createdAt" | "updatedAt", ExtArgs["result"]["run"]>
  export type RunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | Run$ordersArgs<ExtArgs>
    developer?: boolean | Run$developerArgs<ExtArgs>
    _count?: boolean | RunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    developer?: boolean | Run$developerArgs<ExtArgs>
  }
  export type RunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    developer?: boolean | Run$developerArgs<ExtArgs>
  }

  export type $RunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Run"
    objects: {
      orders: Prisma.$OrderPayload<ExtArgs>[]
      developer: Prisma.$DeveloperPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      startTime: Date
      endTime: Date
      completed: boolean
      name: string | null
      tags: string[]
      developerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["run"]>
    composites: {}
  }

  type RunGetPayload<S extends boolean | null | undefined | RunDefaultArgs> = $Result.GetResult<Prisma.$RunPayload, S>

  type RunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunCountAggregateInputType | true
    }

  export interface RunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Run'], meta: { name: 'Run' } }
    /**
     * Find zero or one Run that matches the filter.
     * @param {RunFindUniqueArgs} args - Arguments to find a Run
     * @example
     * // Get one Run
     * const run = await prisma.run.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunFindUniqueArgs>(args: SelectSubset<T, RunFindUniqueArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Run that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunFindUniqueOrThrowArgs} args - Arguments to find a Run
     * @example
     * // Get one Run
     * const run = await prisma.run.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunFindUniqueOrThrowArgs>(args: SelectSubset<T, RunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Run that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunFindFirstArgs} args - Arguments to find a Run
     * @example
     * // Get one Run
     * const run = await prisma.run.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunFindFirstArgs>(args?: SelectSubset<T, RunFindFirstArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Run that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunFindFirstOrThrowArgs} args - Arguments to find a Run
     * @example
     * // Get one Run
     * const run = await prisma.run.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunFindFirstOrThrowArgs>(args?: SelectSubset<T, RunFindFirstOrThrowArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Runs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Runs
     * const runs = await prisma.run.findMany()
     * 
     * // Get first 10 Runs
     * const runs = await prisma.run.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runWithIdOnly = await prisma.run.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RunFindManyArgs>(args?: SelectSubset<T, RunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Run.
     * @param {RunCreateArgs} args - Arguments to create a Run.
     * @example
     * // Create one Run
     * const Run = await prisma.run.create({
     *   data: {
     *     // ... data to create a Run
     *   }
     * })
     * 
     */
    create<T extends RunCreateArgs>(args: SelectSubset<T, RunCreateArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Runs.
     * @param {RunCreateManyArgs} args - Arguments to create many Runs.
     * @example
     * // Create many Runs
     * const run = await prisma.run.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RunCreateManyArgs>(args?: SelectSubset<T, RunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Runs and returns the data saved in the database.
     * @param {RunCreateManyAndReturnArgs} args - Arguments to create many Runs.
     * @example
     * // Create many Runs
     * const run = await prisma.run.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Runs and only return the `id`
     * const runWithIdOnly = await prisma.run.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RunCreateManyAndReturnArgs>(args?: SelectSubset<T, RunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Run.
     * @param {RunDeleteArgs} args - Arguments to delete one Run.
     * @example
     * // Delete one Run
     * const Run = await prisma.run.delete({
     *   where: {
     *     // ... filter to delete one Run
     *   }
     * })
     * 
     */
    delete<T extends RunDeleteArgs>(args: SelectSubset<T, RunDeleteArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Run.
     * @param {RunUpdateArgs} args - Arguments to update one Run.
     * @example
     * // Update one Run
     * const run = await prisma.run.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RunUpdateArgs>(args: SelectSubset<T, RunUpdateArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Runs.
     * @param {RunDeleteManyArgs} args - Arguments to filter Runs to delete.
     * @example
     * // Delete a few Runs
     * const { count } = await prisma.run.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RunDeleteManyArgs>(args?: SelectSubset<T, RunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Runs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Runs
     * const run = await prisma.run.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RunUpdateManyArgs>(args: SelectSubset<T, RunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Runs and returns the data updated in the database.
     * @param {RunUpdateManyAndReturnArgs} args - Arguments to update many Runs.
     * @example
     * // Update many Runs
     * const run = await prisma.run.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Runs and only return the `id`
     * const runWithIdOnly = await prisma.run.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RunUpdateManyAndReturnArgs>(args: SelectSubset<T, RunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Run.
     * @param {RunUpsertArgs} args - Arguments to update or create a Run.
     * @example
     * // Update or create a Run
     * const run = await prisma.run.upsert({
     *   create: {
     *     // ... data to create a Run
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Run we want to update
     *   }
     * })
     */
    upsert<T extends RunUpsertArgs>(args: SelectSubset<T, RunUpsertArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Runs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunCountArgs} args - Arguments to filter Runs to count.
     * @example
     * // Count the number of Runs
     * const count = await prisma.run.count({
     *   where: {
     *     // ... the filter for the Runs we want to count
     *   }
     * })
    **/
    count<T extends RunCountArgs>(
      args?: Subset<T, RunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Run.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RunAggregateArgs>(args: Subset<T, RunAggregateArgs>): Prisma.PrismaPromise<GetRunAggregateType<T>>

    /**
     * Group by Run.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunGroupByArgs['orderBy'] }
        : { orderBy?: RunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Run model
   */
  readonly fields: RunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Run.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends Run$ordersArgs<ExtArgs> = {}>(args?: Subset<T, Run$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    developer<T extends Run$developerArgs<ExtArgs> = {}>(args?: Subset<T, Run$developerArgs<ExtArgs>>): Prisma__DeveloperClient<$Result.GetResult<Prisma.$DeveloperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Run model
   */
  interface RunFieldRefs {
    readonly id: FieldRef<"Run", 'String'>
    readonly startTime: FieldRef<"Run", 'DateTime'>
    readonly endTime: FieldRef<"Run", 'DateTime'>
    readonly completed: FieldRef<"Run", 'Boolean'>
    readonly name: FieldRef<"Run", 'String'>
    readonly tags: FieldRef<"Run", 'String[]'>
    readonly developerId: FieldRef<"Run", 'String'>
    readonly createdAt: FieldRef<"Run", 'DateTime'>
    readonly updatedAt: FieldRef<"Run", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Run findUnique
   */
  export type RunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter, which Run to fetch.
     */
    where: RunWhereUniqueInput
  }

  /**
   * Run findUniqueOrThrow
   */
  export type RunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter, which Run to fetch.
     */
    where: RunWhereUniqueInput
  }

  /**
   * Run findFirst
   */
  export type RunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter, which Run to fetch.
     */
    where?: RunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Runs to fetch.
     */
    orderBy?: RunOrderByWithRelationInput | RunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Runs.
     */
    cursor?: RunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Runs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Runs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Runs.
     */
    distinct?: RunScalarFieldEnum | RunScalarFieldEnum[]
  }

  /**
   * Run findFirstOrThrow
   */
  export type RunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter, which Run to fetch.
     */
    where?: RunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Runs to fetch.
     */
    orderBy?: RunOrderByWithRelationInput | RunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Runs.
     */
    cursor?: RunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Runs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Runs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Runs.
     */
    distinct?: RunScalarFieldEnum | RunScalarFieldEnum[]
  }

  /**
   * Run findMany
   */
  export type RunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter, which Runs to fetch.
     */
    where?: RunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Runs to fetch.
     */
    orderBy?: RunOrderByWithRelationInput | RunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Runs.
     */
    cursor?: RunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Runs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Runs.
     */
    skip?: number
    distinct?: RunScalarFieldEnum | RunScalarFieldEnum[]
  }

  /**
   * Run create
   */
  export type RunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * The data needed to create a Run.
     */
    data: XOR<RunCreateInput, RunUncheckedCreateInput>
  }

  /**
   * Run createMany
   */
  export type RunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Runs.
     */
    data: RunCreateManyInput | RunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Run createManyAndReturn
   */
  export type RunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * The data used to create many Runs.
     */
    data: RunCreateManyInput | RunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Run update
   */
  export type RunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * The data needed to update a Run.
     */
    data: XOR<RunUpdateInput, RunUncheckedUpdateInput>
    /**
     * Choose, which Run to update.
     */
    where: RunWhereUniqueInput
  }

  /**
   * Run updateMany
   */
  export type RunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Runs.
     */
    data: XOR<RunUpdateManyMutationInput, RunUncheckedUpdateManyInput>
    /**
     * Filter which Runs to update
     */
    where?: RunWhereInput
    /**
     * Limit how many Runs to update.
     */
    limit?: number
  }

  /**
   * Run updateManyAndReturn
   */
  export type RunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * The data used to update Runs.
     */
    data: XOR<RunUpdateManyMutationInput, RunUncheckedUpdateManyInput>
    /**
     * Filter which Runs to update
     */
    where?: RunWhereInput
    /**
     * Limit how many Runs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Run upsert
   */
  export type RunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * The filter to search for the Run to update in case it exists.
     */
    where: RunWhereUniqueInput
    /**
     * In case the Run found by the `where` argument doesn't exist, create a new Run with this data.
     */
    create: XOR<RunCreateInput, RunUncheckedCreateInput>
    /**
     * In case the Run was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunUpdateInput, RunUncheckedUpdateInput>
  }

  /**
   * Run delete
   */
  export type RunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
    /**
     * Filter which Run to delete.
     */
    where: RunWhereUniqueInput
  }

  /**
   * Run deleteMany
   */
  export type RunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Runs to delete
     */
    where?: RunWhereInput
    /**
     * Limit how many Runs to delete.
     */
    limit?: number
  }

  /**
   * Run.orders
   */
  export type Run$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Run.developer
   */
  export type Run$developerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Developer
     */
    select?: DeveloperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Developer
     */
    omit?: DeveloperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeveloperInclude<ExtArgs> | null
    where?: DeveloperWhereInput
  }

  /**
   * Run without action
   */
  export type RunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Run
     */
    select?: RunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Run
     */
    omit?: RunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    entryPrice: Decimal | null
  }

  export type OrderSumAggregateOutputType = {
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    entryPrice: Decimal | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    nseSymbol: string | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    entryPrice: Decimal | null
    timestamp: Date | null
    runId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    nseSymbol: string | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    entryPrice: Decimal | null
    timestamp: Date | null
    runId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    nseSymbol: number
    stopLossPrice: number
    takeProfitPrice: number
    entryPrice: number
    timestamp: number
    runId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    stopLossPrice?: true
    takeProfitPrice?: true
    entryPrice?: true
  }

  export type OrderSumAggregateInputType = {
    stopLossPrice?: true
    takeProfitPrice?: true
    entryPrice?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    nseSymbol?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    entryPrice?: true
    timestamp?: true
    runId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    nseSymbol?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    entryPrice?: true
    timestamp?: true
    runId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    nseSymbol?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    entryPrice?: true
    timestamp?: true
    runId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    nseSymbol: string
    stopLossPrice: Decimal
    takeProfitPrice: Decimal
    entryPrice: Decimal
    timestamp: Date
    runId: string
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nseSymbol?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    entryPrice?: boolean
    timestamp?: boolean
    runId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    run?: boolean | RunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nseSymbol?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    entryPrice?: boolean
    timestamp?: boolean
    runId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    run?: boolean | RunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nseSymbol?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    entryPrice?: boolean
    timestamp?: boolean
    runId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    run?: boolean | RunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    nseSymbol?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    entryPrice?: boolean
    timestamp?: boolean
    runId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nseSymbol" | "stopLossPrice" | "takeProfitPrice" | "entryPrice" | "timestamp" | "runId" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | RunDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | RunDefaultArgs<ExtArgs>
  }
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | RunDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      run: Prisma.$RunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nseSymbol: string
      stopLossPrice: Prisma.Decimal
      takeProfitPrice: Prisma.Decimal
      entryPrice: Prisma.Decimal
      timestamp: Date
      runId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    run<T extends RunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RunDefaultArgs<ExtArgs>>): Prisma__RunClient<$Result.GetResult<Prisma.$RunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly nseSymbol: FieldRef<"Order", 'String'>
    readonly stopLossPrice: FieldRef<"Order", 'Decimal'>
    readonly takeProfitPrice: FieldRef<"Order", 'Decimal'>
    readonly entryPrice: FieldRef<"Order", 'Decimal'>
    readonly timestamp: FieldRef<"Order", 'DateTime'>
    readonly runId: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model NseIntrument
   */

  export type AggregateNseIntrument = {
    _count: NseIntrumentCountAggregateOutputType | null
    _min: NseIntrumentMinAggregateOutputType | null
    _max: NseIntrumentMaxAggregateOutputType | null
  }

  export type NseIntrumentMinAggregateOutputType = {
    id: string | null
    symbol: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseIntrumentMaxAggregateOutputType = {
    id: string | null
    symbol: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseIntrumentCountAggregateOutputType = {
    id: number
    symbol: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NseIntrumentMinAggregateInputType = {
    id?: true
    symbol?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseIntrumentMaxAggregateInputType = {
    id?: true
    symbol?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseIntrumentCountAggregateInputType = {
    id?: true
    symbol?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NseIntrumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseIntrument to aggregate.
     */
    where?: NseIntrumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseIntruments to fetch.
     */
    orderBy?: NseIntrumentOrderByWithRelationInput | NseIntrumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NseIntrumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseIntruments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseIntruments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NseIntruments
    **/
    _count?: true | NseIntrumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NseIntrumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NseIntrumentMaxAggregateInputType
  }

  export type GetNseIntrumentAggregateType<T extends NseIntrumentAggregateArgs> = {
        [P in keyof T & keyof AggregateNseIntrument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNseIntrument[P]>
      : GetScalarType<T[P], AggregateNseIntrument[P]>
  }




  export type NseIntrumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NseIntrumentWhereInput
    orderBy?: NseIntrumentOrderByWithAggregationInput | NseIntrumentOrderByWithAggregationInput[]
    by: NseIntrumentScalarFieldEnum[] | NseIntrumentScalarFieldEnum
    having?: NseIntrumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NseIntrumentCountAggregateInputType | true
    _min?: NseIntrumentMinAggregateInputType
    _max?: NseIntrumentMaxAggregateInputType
  }

  export type NseIntrumentGroupByOutputType = {
    id: string
    symbol: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: NseIntrumentCountAggregateOutputType | null
    _min: NseIntrumentMinAggregateOutputType | null
    _max: NseIntrumentMaxAggregateOutputType | null
  }

  type GetNseIntrumentGroupByPayload<T extends NseIntrumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NseIntrumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NseIntrumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NseIntrumentGroupByOutputType[P]>
            : GetScalarType<T[P], NseIntrumentGroupByOutputType[P]>
        }
      >
    >


  export type NseIntrumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    candles?: boolean | NseIntrument$candlesArgs<ExtArgs>
    _count?: boolean | NseIntrumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nseIntrument"]>

  export type NseIntrumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["nseIntrument"]>

  export type NseIntrumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["nseIntrument"]>

  export type NseIntrumentSelectScalar = {
    id?: boolean
    symbol?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NseIntrumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "symbol" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["nseIntrument"]>
  export type NseIntrumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    candles?: boolean | NseIntrument$candlesArgs<ExtArgs>
    _count?: boolean | NseIntrumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NseIntrumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NseIntrumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NseIntrumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NseIntrument"
    objects: {
      candles: Prisma.$NseCandlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      symbol: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["nseIntrument"]>
    composites: {}
  }

  type NseIntrumentGetPayload<S extends boolean | null | undefined | NseIntrumentDefaultArgs> = $Result.GetResult<Prisma.$NseIntrumentPayload, S>

  type NseIntrumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NseIntrumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NseIntrumentCountAggregateInputType | true
    }

  export interface NseIntrumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NseIntrument'], meta: { name: 'NseIntrument' } }
    /**
     * Find zero or one NseIntrument that matches the filter.
     * @param {NseIntrumentFindUniqueArgs} args - Arguments to find a NseIntrument
     * @example
     * // Get one NseIntrument
     * const nseIntrument = await prisma.nseIntrument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NseIntrumentFindUniqueArgs>(args: SelectSubset<T, NseIntrumentFindUniqueArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NseIntrument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NseIntrumentFindUniqueOrThrowArgs} args - Arguments to find a NseIntrument
     * @example
     * // Get one NseIntrument
     * const nseIntrument = await prisma.nseIntrument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NseIntrumentFindUniqueOrThrowArgs>(args: SelectSubset<T, NseIntrumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseIntrument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentFindFirstArgs} args - Arguments to find a NseIntrument
     * @example
     * // Get one NseIntrument
     * const nseIntrument = await prisma.nseIntrument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NseIntrumentFindFirstArgs>(args?: SelectSubset<T, NseIntrumentFindFirstArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseIntrument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentFindFirstOrThrowArgs} args - Arguments to find a NseIntrument
     * @example
     * // Get one NseIntrument
     * const nseIntrument = await prisma.nseIntrument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NseIntrumentFindFirstOrThrowArgs>(args?: SelectSubset<T, NseIntrumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NseIntruments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NseIntruments
     * const nseIntruments = await prisma.nseIntrument.findMany()
     * 
     * // Get first 10 NseIntruments
     * const nseIntruments = await prisma.nseIntrument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nseIntrumentWithIdOnly = await prisma.nseIntrument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NseIntrumentFindManyArgs>(args?: SelectSubset<T, NseIntrumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NseIntrument.
     * @param {NseIntrumentCreateArgs} args - Arguments to create a NseIntrument.
     * @example
     * // Create one NseIntrument
     * const NseIntrument = await prisma.nseIntrument.create({
     *   data: {
     *     // ... data to create a NseIntrument
     *   }
     * })
     * 
     */
    create<T extends NseIntrumentCreateArgs>(args: SelectSubset<T, NseIntrumentCreateArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NseIntruments.
     * @param {NseIntrumentCreateManyArgs} args - Arguments to create many NseIntruments.
     * @example
     * // Create many NseIntruments
     * const nseIntrument = await prisma.nseIntrument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NseIntrumentCreateManyArgs>(args?: SelectSubset<T, NseIntrumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NseIntruments and returns the data saved in the database.
     * @param {NseIntrumentCreateManyAndReturnArgs} args - Arguments to create many NseIntruments.
     * @example
     * // Create many NseIntruments
     * const nseIntrument = await prisma.nseIntrument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NseIntruments and only return the `id`
     * const nseIntrumentWithIdOnly = await prisma.nseIntrument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NseIntrumentCreateManyAndReturnArgs>(args?: SelectSubset<T, NseIntrumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NseIntrument.
     * @param {NseIntrumentDeleteArgs} args - Arguments to delete one NseIntrument.
     * @example
     * // Delete one NseIntrument
     * const NseIntrument = await prisma.nseIntrument.delete({
     *   where: {
     *     // ... filter to delete one NseIntrument
     *   }
     * })
     * 
     */
    delete<T extends NseIntrumentDeleteArgs>(args: SelectSubset<T, NseIntrumentDeleteArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NseIntrument.
     * @param {NseIntrumentUpdateArgs} args - Arguments to update one NseIntrument.
     * @example
     * // Update one NseIntrument
     * const nseIntrument = await prisma.nseIntrument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NseIntrumentUpdateArgs>(args: SelectSubset<T, NseIntrumentUpdateArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NseIntruments.
     * @param {NseIntrumentDeleteManyArgs} args - Arguments to filter NseIntruments to delete.
     * @example
     * // Delete a few NseIntruments
     * const { count } = await prisma.nseIntrument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NseIntrumentDeleteManyArgs>(args?: SelectSubset<T, NseIntrumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseIntruments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NseIntruments
     * const nseIntrument = await prisma.nseIntrument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NseIntrumentUpdateManyArgs>(args: SelectSubset<T, NseIntrumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseIntruments and returns the data updated in the database.
     * @param {NseIntrumentUpdateManyAndReturnArgs} args - Arguments to update many NseIntruments.
     * @example
     * // Update many NseIntruments
     * const nseIntrument = await prisma.nseIntrument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NseIntruments and only return the `id`
     * const nseIntrumentWithIdOnly = await prisma.nseIntrument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NseIntrumentUpdateManyAndReturnArgs>(args: SelectSubset<T, NseIntrumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NseIntrument.
     * @param {NseIntrumentUpsertArgs} args - Arguments to update or create a NseIntrument.
     * @example
     * // Update or create a NseIntrument
     * const nseIntrument = await prisma.nseIntrument.upsert({
     *   create: {
     *     // ... data to create a NseIntrument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NseIntrument we want to update
     *   }
     * })
     */
    upsert<T extends NseIntrumentUpsertArgs>(args: SelectSubset<T, NseIntrumentUpsertArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NseIntruments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentCountArgs} args - Arguments to filter NseIntruments to count.
     * @example
     * // Count the number of NseIntruments
     * const count = await prisma.nseIntrument.count({
     *   where: {
     *     // ... the filter for the NseIntruments we want to count
     *   }
     * })
    **/
    count<T extends NseIntrumentCountArgs>(
      args?: Subset<T, NseIntrumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NseIntrumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NseIntrument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NseIntrumentAggregateArgs>(args: Subset<T, NseIntrumentAggregateArgs>): Prisma.PrismaPromise<GetNseIntrumentAggregateType<T>>

    /**
     * Group by NseIntrument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseIntrumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NseIntrumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NseIntrumentGroupByArgs['orderBy'] }
        : { orderBy?: NseIntrumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NseIntrumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNseIntrumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NseIntrument model
   */
  readonly fields: NseIntrumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NseIntrument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NseIntrumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    candles<T extends NseIntrument$candlesArgs<ExtArgs> = {}>(args?: Subset<T, NseIntrument$candlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NseIntrument model
   */
  interface NseIntrumentFieldRefs {
    readonly id: FieldRef<"NseIntrument", 'String'>
    readonly symbol: FieldRef<"NseIntrument", 'String'>
    readonly name: FieldRef<"NseIntrument", 'String'>
    readonly createdAt: FieldRef<"NseIntrument", 'DateTime'>
    readonly updatedAt: FieldRef<"NseIntrument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NseIntrument findUnique
   */
  export type NseIntrumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter, which NseIntrument to fetch.
     */
    where: NseIntrumentWhereUniqueInput
  }

  /**
   * NseIntrument findUniqueOrThrow
   */
  export type NseIntrumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter, which NseIntrument to fetch.
     */
    where: NseIntrumentWhereUniqueInput
  }

  /**
   * NseIntrument findFirst
   */
  export type NseIntrumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter, which NseIntrument to fetch.
     */
    where?: NseIntrumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseIntruments to fetch.
     */
    orderBy?: NseIntrumentOrderByWithRelationInput | NseIntrumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseIntruments.
     */
    cursor?: NseIntrumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseIntruments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseIntruments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseIntruments.
     */
    distinct?: NseIntrumentScalarFieldEnum | NseIntrumentScalarFieldEnum[]
  }

  /**
   * NseIntrument findFirstOrThrow
   */
  export type NseIntrumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter, which NseIntrument to fetch.
     */
    where?: NseIntrumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseIntruments to fetch.
     */
    orderBy?: NseIntrumentOrderByWithRelationInput | NseIntrumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseIntruments.
     */
    cursor?: NseIntrumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseIntruments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseIntruments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseIntruments.
     */
    distinct?: NseIntrumentScalarFieldEnum | NseIntrumentScalarFieldEnum[]
  }

  /**
   * NseIntrument findMany
   */
  export type NseIntrumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter, which NseIntruments to fetch.
     */
    where?: NseIntrumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseIntruments to fetch.
     */
    orderBy?: NseIntrumentOrderByWithRelationInput | NseIntrumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NseIntruments.
     */
    cursor?: NseIntrumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseIntruments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseIntruments.
     */
    skip?: number
    distinct?: NseIntrumentScalarFieldEnum | NseIntrumentScalarFieldEnum[]
  }

  /**
   * NseIntrument create
   */
  export type NseIntrumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * The data needed to create a NseIntrument.
     */
    data: XOR<NseIntrumentCreateInput, NseIntrumentUncheckedCreateInput>
  }

  /**
   * NseIntrument createMany
   */
  export type NseIntrumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NseIntruments.
     */
    data: NseIntrumentCreateManyInput | NseIntrumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NseIntrument createManyAndReturn
   */
  export type NseIntrumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * The data used to create many NseIntruments.
     */
    data: NseIntrumentCreateManyInput | NseIntrumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NseIntrument update
   */
  export type NseIntrumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * The data needed to update a NseIntrument.
     */
    data: XOR<NseIntrumentUpdateInput, NseIntrumentUncheckedUpdateInput>
    /**
     * Choose, which NseIntrument to update.
     */
    where: NseIntrumentWhereUniqueInput
  }

  /**
   * NseIntrument updateMany
   */
  export type NseIntrumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NseIntruments.
     */
    data: XOR<NseIntrumentUpdateManyMutationInput, NseIntrumentUncheckedUpdateManyInput>
    /**
     * Filter which NseIntruments to update
     */
    where?: NseIntrumentWhereInput
    /**
     * Limit how many NseIntruments to update.
     */
    limit?: number
  }

  /**
   * NseIntrument updateManyAndReturn
   */
  export type NseIntrumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * The data used to update NseIntruments.
     */
    data: XOR<NseIntrumentUpdateManyMutationInput, NseIntrumentUncheckedUpdateManyInput>
    /**
     * Filter which NseIntruments to update
     */
    where?: NseIntrumentWhereInput
    /**
     * Limit how many NseIntruments to update.
     */
    limit?: number
  }

  /**
   * NseIntrument upsert
   */
  export type NseIntrumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * The filter to search for the NseIntrument to update in case it exists.
     */
    where: NseIntrumentWhereUniqueInput
    /**
     * In case the NseIntrument found by the `where` argument doesn't exist, create a new NseIntrument with this data.
     */
    create: XOR<NseIntrumentCreateInput, NseIntrumentUncheckedCreateInput>
    /**
     * In case the NseIntrument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NseIntrumentUpdateInput, NseIntrumentUncheckedUpdateInput>
  }

  /**
   * NseIntrument delete
   */
  export type NseIntrumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
    /**
     * Filter which NseIntrument to delete.
     */
    where: NseIntrumentWhereUniqueInput
  }

  /**
   * NseIntrument deleteMany
   */
  export type NseIntrumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseIntruments to delete
     */
    where?: NseIntrumentWhereInput
    /**
     * Limit how many NseIntruments to delete.
     */
    limit?: number
  }

  /**
   * NseIntrument.candles
   */
  export type NseIntrument$candlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    where?: NseCandleWhereInput
    orderBy?: NseCandleOrderByWithRelationInput | NseCandleOrderByWithRelationInput[]
    cursor?: NseCandleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NseCandleScalarFieldEnum | NseCandleScalarFieldEnum[]
  }

  /**
   * NseIntrument without action
   */
  export type NseIntrumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseIntrument
     */
    select?: NseIntrumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseIntrument
     */
    omit?: NseIntrumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseIntrumentInclude<ExtArgs> | null
  }


  /**
   * Model NseCandle
   */

  export type AggregateNseCandle = {
    _count: NseCandleCountAggregateOutputType | null
    _avg: NseCandleAvgAggregateOutputType | null
    _sum: NseCandleSumAggregateOutputType | null
    _min: NseCandleMinAggregateOutputType | null
    _max: NseCandleMaxAggregateOutputType | null
  }

  export type NseCandleAvgAggregateOutputType = {
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: number | null
  }

  export type NseCandleSumAggregateOutputType = {
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: bigint | null
  }

  export type NseCandleMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: bigint | null
    instrumentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseCandleMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: bigint | null
    instrumentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseCandleCountAggregateOutputType = {
    id: number
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    instrumentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NseCandleAvgAggregateInputType = {
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type NseCandleSumAggregateInputType = {
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type NseCandleMinAggregateInputType = {
    id?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    instrumentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseCandleMaxAggregateInputType = {
    id?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    instrumentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseCandleCountAggregateInputType = {
    id?: true
    timestamp?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    instrumentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NseCandleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseCandle to aggregate.
     */
    where?: NseCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseCandles to fetch.
     */
    orderBy?: NseCandleOrderByWithRelationInput | NseCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NseCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NseCandles
    **/
    _count?: true | NseCandleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NseCandleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NseCandleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NseCandleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NseCandleMaxAggregateInputType
  }

  export type GetNseCandleAggregateType<T extends NseCandleAggregateArgs> = {
        [P in keyof T & keyof AggregateNseCandle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNseCandle[P]>
      : GetScalarType<T[P], AggregateNseCandle[P]>
  }




  export type NseCandleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NseCandleWhereInput
    orderBy?: NseCandleOrderByWithAggregationInput | NseCandleOrderByWithAggregationInput[]
    by: NseCandleScalarFieldEnum[] | NseCandleScalarFieldEnum
    having?: NseCandleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NseCandleCountAggregateInputType | true
    _avg?: NseCandleAvgAggregateInputType
    _sum?: NseCandleSumAggregateInputType
    _min?: NseCandleMinAggregateInputType
    _max?: NseCandleMaxAggregateInputType
  }

  export type NseCandleGroupByOutputType = {
    id: string
    timestamp: Date
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: bigint
    instrumentId: string
    createdAt: Date
    updatedAt: Date
    _count: NseCandleCountAggregateOutputType | null
    _avg: NseCandleAvgAggregateOutputType | null
    _sum: NseCandleSumAggregateOutputType | null
    _min: NseCandleMinAggregateOutputType | null
    _max: NseCandleMaxAggregateOutputType | null
  }

  type GetNseCandleGroupByPayload<T extends NseCandleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NseCandleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NseCandleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NseCandleGroupByOutputType[P]>
            : GetScalarType<T[P], NseCandleGroupByOutputType[P]>
        }
      >
    >


  export type NseCandleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    instrumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nseCandle"]>

  export type NseCandleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    instrumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nseCandle"]>

  export type NseCandleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    instrumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nseCandle"]>

  export type NseCandleSelectScalar = {
    id?: boolean
    timestamp?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    instrumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NseCandleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "open" | "high" | "low" | "close" | "volume" | "instrumentId" | "createdAt" | "updatedAt", ExtArgs["result"]["nseCandle"]>
  export type NseCandleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }
  export type NseCandleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }
  export type NseCandleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    instrument?: boolean | NseIntrumentDefaultArgs<ExtArgs>
  }

  export type $NseCandlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NseCandle"
    objects: {
      instrument: Prisma.$NseIntrumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      open: Prisma.Decimal
      high: Prisma.Decimal
      low: Prisma.Decimal
      close: Prisma.Decimal
      volume: bigint
      instrumentId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["nseCandle"]>
    composites: {}
  }

  type NseCandleGetPayload<S extends boolean | null | undefined | NseCandleDefaultArgs> = $Result.GetResult<Prisma.$NseCandlePayload, S>

  type NseCandleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NseCandleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NseCandleCountAggregateInputType | true
    }

  export interface NseCandleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NseCandle'], meta: { name: 'NseCandle' } }
    /**
     * Find zero or one NseCandle that matches the filter.
     * @param {NseCandleFindUniqueArgs} args - Arguments to find a NseCandle
     * @example
     * // Get one NseCandle
     * const nseCandle = await prisma.nseCandle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NseCandleFindUniqueArgs>(args: SelectSubset<T, NseCandleFindUniqueArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NseCandle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NseCandleFindUniqueOrThrowArgs} args - Arguments to find a NseCandle
     * @example
     * // Get one NseCandle
     * const nseCandle = await prisma.nseCandle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NseCandleFindUniqueOrThrowArgs>(args: SelectSubset<T, NseCandleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseCandle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleFindFirstArgs} args - Arguments to find a NseCandle
     * @example
     * // Get one NseCandle
     * const nseCandle = await prisma.nseCandle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NseCandleFindFirstArgs>(args?: SelectSubset<T, NseCandleFindFirstArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseCandle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleFindFirstOrThrowArgs} args - Arguments to find a NseCandle
     * @example
     * // Get one NseCandle
     * const nseCandle = await prisma.nseCandle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NseCandleFindFirstOrThrowArgs>(args?: SelectSubset<T, NseCandleFindFirstOrThrowArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NseCandles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NseCandles
     * const nseCandles = await prisma.nseCandle.findMany()
     * 
     * // Get first 10 NseCandles
     * const nseCandles = await prisma.nseCandle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nseCandleWithIdOnly = await prisma.nseCandle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NseCandleFindManyArgs>(args?: SelectSubset<T, NseCandleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NseCandle.
     * @param {NseCandleCreateArgs} args - Arguments to create a NseCandle.
     * @example
     * // Create one NseCandle
     * const NseCandle = await prisma.nseCandle.create({
     *   data: {
     *     // ... data to create a NseCandle
     *   }
     * })
     * 
     */
    create<T extends NseCandleCreateArgs>(args: SelectSubset<T, NseCandleCreateArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NseCandles.
     * @param {NseCandleCreateManyArgs} args - Arguments to create many NseCandles.
     * @example
     * // Create many NseCandles
     * const nseCandle = await prisma.nseCandle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NseCandleCreateManyArgs>(args?: SelectSubset<T, NseCandleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NseCandles and returns the data saved in the database.
     * @param {NseCandleCreateManyAndReturnArgs} args - Arguments to create many NseCandles.
     * @example
     * // Create many NseCandles
     * const nseCandle = await prisma.nseCandle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NseCandles and only return the `id`
     * const nseCandleWithIdOnly = await prisma.nseCandle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NseCandleCreateManyAndReturnArgs>(args?: SelectSubset<T, NseCandleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NseCandle.
     * @param {NseCandleDeleteArgs} args - Arguments to delete one NseCandle.
     * @example
     * // Delete one NseCandle
     * const NseCandle = await prisma.nseCandle.delete({
     *   where: {
     *     // ... filter to delete one NseCandle
     *   }
     * })
     * 
     */
    delete<T extends NseCandleDeleteArgs>(args: SelectSubset<T, NseCandleDeleteArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NseCandle.
     * @param {NseCandleUpdateArgs} args - Arguments to update one NseCandle.
     * @example
     * // Update one NseCandle
     * const nseCandle = await prisma.nseCandle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NseCandleUpdateArgs>(args: SelectSubset<T, NseCandleUpdateArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NseCandles.
     * @param {NseCandleDeleteManyArgs} args - Arguments to filter NseCandles to delete.
     * @example
     * // Delete a few NseCandles
     * const { count } = await prisma.nseCandle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NseCandleDeleteManyArgs>(args?: SelectSubset<T, NseCandleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseCandles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NseCandles
     * const nseCandle = await prisma.nseCandle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NseCandleUpdateManyArgs>(args: SelectSubset<T, NseCandleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseCandles and returns the data updated in the database.
     * @param {NseCandleUpdateManyAndReturnArgs} args - Arguments to update many NseCandles.
     * @example
     * // Update many NseCandles
     * const nseCandle = await prisma.nseCandle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NseCandles and only return the `id`
     * const nseCandleWithIdOnly = await prisma.nseCandle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NseCandleUpdateManyAndReturnArgs>(args: SelectSubset<T, NseCandleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NseCandle.
     * @param {NseCandleUpsertArgs} args - Arguments to update or create a NseCandle.
     * @example
     * // Update or create a NseCandle
     * const nseCandle = await prisma.nseCandle.upsert({
     *   create: {
     *     // ... data to create a NseCandle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NseCandle we want to update
     *   }
     * })
     */
    upsert<T extends NseCandleUpsertArgs>(args: SelectSubset<T, NseCandleUpsertArgs<ExtArgs>>): Prisma__NseCandleClient<$Result.GetResult<Prisma.$NseCandlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NseCandles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleCountArgs} args - Arguments to filter NseCandles to count.
     * @example
     * // Count the number of NseCandles
     * const count = await prisma.nseCandle.count({
     *   where: {
     *     // ... the filter for the NseCandles we want to count
     *   }
     * })
    **/
    count<T extends NseCandleCountArgs>(
      args?: Subset<T, NseCandleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NseCandleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NseCandle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NseCandleAggregateArgs>(args: Subset<T, NseCandleAggregateArgs>): Prisma.PrismaPromise<GetNseCandleAggregateType<T>>

    /**
     * Group by NseCandle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseCandleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NseCandleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NseCandleGroupByArgs['orderBy'] }
        : { orderBy?: NseCandleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NseCandleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNseCandleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NseCandle model
   */
  readonly fields: NseCandleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NseCandle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NseCandleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    instrument<T extends NseIntrumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NseIntrumentDefaultArgs<ExtArgs>>): Prisma__NseIntrumentClient<$Result.GetResult<Prisma.$NseIntrumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NseCandle model
   */
  interface NseCandleFieldRefs {
    readonly id: FieldRef<"NseCandle", 'String'>
    readonly timestamp: FieldRef<"NseCandle", 'DateTime'>
    readonly open: FieldRef<"NseCandle", 'Decimal'>
    readonly high: FieldRef<"NseCandle", 'Decimal'>
    readonly low: FieldRef<"NseCandle", 'Decimal'>
    readonly close: FieldRef<"NseCandle", 'Decimal'>
    readonly volume: FieldRef<"NseCandle", 'BigInt'>
    readonly instrumentId: FieldRef<"NseCandle", 'String'>
    readonly createdAt: FieldRef<"NseCandle", 'DateTime'>
    readonly updatedAt: FieldRef<"NseCandle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NseCandle findUnique
   */
  export type NseCandleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter, which NseCandle to fetch.
     */
    where: NseCandleWhereUniqueInput
  }

  /**
   * NseCandle findUniqueOrThrow
   */
  export type NseCandleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter, which NseCandle to fetch.
     */
    where: NseCandleWhereUniqueInput
  }

  /**
   * NseCandle findFirst
   */
  export type NseCandleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter, which NseCandle to fetch.
     */
    where?: NseCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseCandles to fetch.
     */
    orderBy?: NseCandleOrderByWithRelationInput | NseCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseCandles.
     */
    cursor?: NseCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseCandles.
     */
    distinct?: NseCandleScalarFieldEnum | NseCandleScalarFieldEnum[]
  }

  /**
   * NseCandle findFirstOrThrow
   */
  export type NseCandleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter, which NseCandle to fetch.
     */
    where?: NseCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseCandles to fetch.
     */
    orderBy?: NseCandleOrderByWithRelationInput | NseCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseCandles.
     */
    cursor?: NseCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseCandles.
     */
    distinct?: NseCandleScalarFieldEnum | NseCandleScalarFieldEnum[]
  }

  /**
   * NseCandle findMany
   */
  export type NseCandleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter, which NseCandles to fetch.
     */
    where?: NseCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseCandles to fetch.
     */
    orderBy?: NseCandleOrderByWithRelationInput | NseCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NseCandles.
     */
    cursor?: NseCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseCandles.
     */
    skip?: number
    distinct?: NseCandleScalarFieldEnum | NseCandleScalarFieldEnum[]
  }

  /**
   * NseCandle create
   */
  export type NseCandleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * The data needed to create a NseCandle.
     */
    data: XOR<NseCandleCreateInput, NseCandleUncheckedCreateInput>
  }

  /**
   * NseCandle createMany
   */
  export type NseCandleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NseCandles.
     */
    data: NseCandleCreateManyInput | NseCandleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NseCandle createManyAndReturn
   */
  export type NseCandleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * The data used to create many NseCandles.
     */
    data: NseCandleCreateManyInput | NseCandleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NseCandle update
   */
  export type NseCandleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * The data needed to update a NseCandle.
     */
    data: XOR<NseCandleUpdateInput, NseCandleUncheckedUpdateInput>
    /**
     * Choose, which NseCandle to update.
     */
    where: NseCandleWhereUniqueInput
  }

  /**
   * NseCandle updateMany
   */
  export type NseCandleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NseCandles.
     */
    data: XOR<NseCandleUpdateManyMutationInput, NseCandleUncheckedUpdateManyInput>
    /**
     * Filter which NseCandles to update
     */
    where?: NseCandleWhereInput
    /**
     * Limit how many NseCandles to update.
     */
    limit?: number
  }

  /**
   * NseCandle updateManyAndReturn
   */
  export type NseCandleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * The data used to update NseCandles.
     */
    data: XOR<NseCandleUpdateManyMutationInput, NseCandleUncheckedUpdateManyInput>
    /**
     * Filter which NseCandles to update
     */
    where?: NseCandleWhereInput
    /**
     * Limit how many NseCandles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NseCandle upsert
   */
  export type NseCandleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * The filter to search for the NseCandle to update in case it exists.
     */
    where: NseCandleWhereUniqueInput
    /**
     * In case the NseCandle found by the `where` argument doesn't exist, create a new NseCandle with this data.
     */
    create: XOR<NseCandleCreateInput, NseCandleUncheckedCreateInput>
    /**
     * In case the NseCandle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NseCandleUpdateInput, NseCandleUncheckedUpdateInput>
  }

  /**
   * NseCandle delete
   */
  export type NseCandleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
    /**
     * Filter which NseCandle to delete.
     */
    where: NseCandleWhereUniqueInput
  }

  /**
   * NseCandle deleteMany
   */
  export type NseCandleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseCandles to delete
     */
    where?: NseCandleWhereInput
    /**
     * Limit how many NseCandles to delete.
     */
    limit?: number
  }

  /**
   * NseCandle without action
   */
  export type NseCandleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseCandle
     */
    select?: NseCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseCandle
     */
    omit?: NseCandleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NseCandleInclude<ExtArgs> | null
  }


  /**
   * Model NseHoliday
   */

  export type AggregateNseHoliday = {
    _count: NseHolidayCountAggregateOutputType | null
    _min: NseHolidayMinAggregateOutputType | null
    _max: NseHolidayMaxAggregateOutputType | null
  }

  export type NseHolidayMinAggregateOutputType = {
    id: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseHolidayMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NseHolidayCountAggregateOutputType = {
    id: number
    date: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NseHolidayMinAggregateInputType = {
    id?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseHolidayMaxAggregateInputType = {
    id?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NseHolidayCountAggregateInputType = {
    id?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NseHolidayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseHoliday to aggregate.
     */
    where?: NseHolidayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseHolidays to fetch.
     */
    orderBy?: NseHolidayOrderByWithRelationInput | NseHolidayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NseHolidayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseHolidays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseHolidays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NseHolidays
    **/
    _count?: true | NseHolidayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NseHolidayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NseHolidayMaxAggregateInputType
  }

  export type GetNseHolidayAggregateType<T extends NseHolidayAggregateArgs> = {
        [P in keyof T & keyof AggregateNseHoliday]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNseHoliday[P]>
      : GetScalarType<T[P], AggregateNseHoliday[P]>
  }




  export type NseHolidayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NseHolidayWhereInput
    orderBy?: NseHolidayOrderByWithAggregationInput | NseHolidayOrderByWithAggregationInput[]
    by: NseHolidayScalarFieldEnum[] | NseHolidayScalarFieldEnum
    having?: NseHolidayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NseHolidayCountAggregateInputType | true
    _min?: NseHolidayMinAggregateInputType
    _max?: NseHolidayMaxAggregateInputType
  }

  export type NseHolidayGroupByOutputType = {
    id: string
    date: Date
    createdAt: Date
    updatedAt: Date
    _count: NseHolidayCountAggregateOutputType | null
    _min: NseHolidayMinAggregateOutputType | null
    _max: NseHolidayMaxAggregateOutputType | null
  }

  type GetNseHolidayGroupByPayload<T extends NseHolidayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NseHolidayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NseHolidayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NseHolidayGroupByOutputType[P]>
            : GetScalarType<T[P], NseHolidayGroupByOutputType[P]>
        }
      >
    >


  export type NseHolidaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["nseHoliday"]>

  export type NseHolidaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["nseHoliday"]>

  export type NseHolidaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["nseHoliday"]>

  export type NseHolidaySelectScalar = {
    id?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NseHolidayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "createdAt" | "updatedAt", ExtArgs["result"]["nseHoliday"]>

  export type $NseHolidayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NseHoliday"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["nseHoliday"]>
    composites: {}
  }

  type NseHolidayGetPayload<S extends boolean | null | undefined | NseHolidayDefaultArgs> = $Result.GetResult<Prisma.$NseHolidayPayload, S>

  type NseHolidayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NseHolidayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NseHolidayCountAggregateInputType | true
    }

  export interface NseHolidayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NseHoliday'], meta: { name: 'NseHoliday' } }
    /**
     * Find zero or one NseHoliday that matches the filter.
     * @param {NseHolidayFindUniqueArgs} args - Arguments to find a NseHoliday
     * @example
     * // Get one NseHoliday
     * const nseHoliday = await prisma.nseHoliday.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NseHolidayFindUniqueArgs>(args: SelectSubset<T, NseHolidayFindUniqueArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NseHoliday that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NseHolidayFindUniqueOrThrowArgs} args - Arguments to find a NseHoliday
     * @example
     * // Get one NseHoliday
     * const nseHoliday = await prisma.nseHoliday.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NseHolidayFindUniqueOrThrowArgs>(args: SelectSubset<T, NseHolidayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseHoliday that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayFindFirstArgs} args - Arguments to find a NseHoliday
     * @example
     * // Get one NseHoliday
     * const nseHoliday = await prisma.nseHoliday.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NseHolidayFindFirstArgs>(args?: SelectSubset<T, NseHolidayFindFirstArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NseHoliday that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayFindFirstOrThrowArgs} args - Arguments to find a NseHoliday
     * @example
     * // Get one NseHoliday
     * const nseHoliday = await prisma.nseHoliday.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NseHolidayFindFirstOrThrowArgs>(args?: SelectSubset<T, NseHolidayFindFirstOrThrowArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NseHolidays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NseHolidays
     * const nseHolidays = await prisma.nseHoliday.findMany()
     * 
     * // Get first 10 NseHolidays
     * const nseHolidays = await prisma.nseHoliday.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nseHolidayWithIdOnly = await prisma.nseHoliday.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NseHolidayFindManyArgs>(args?: SelectSubset<T, NseHolidayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NseHoliday.
     * @param {NseHolidayCreateArgs} args - Arguments to create a NseHoliday.
     * @example
     * // Create one NseHoliday
     * const NseHoliday = await prisma.nseHoliday.create({
     *   data: {
     *     // ... data to create a NseHoliday
     *   }
     * })
     * 
     */
    create<T extends NseHolidayCreateArgs>(args: SelectSubset<T, NseHolidayCreateArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NseHolidays.
     * @param {NseHolidayCreateManyArgs} args - Arguments to create many NseHolidays.
     * @example
     * // Create many NseHolidays
     * const nseHoliday = await prisma.nseHoliday.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NseHolidayCreateManyArgs>(args?: SelectSubset<T, NseHolidayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NseHolidays and returns the data saved in the database.
     * @param {NseHolidayCreateManyAndReturnArgs} args - Arguments to create many NseHolidays.
     * @example
     * // Create many NseHolidays
     * const nseHoliday = await prisma.nseHoliday.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NseHolidays and only return the `id`
     * const nseHolidayWithIdOnly = await prisma.nseHoliday.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NseHolidayCreateManyAndReturnArgs>(args?: SelectSubset<T, NseHolidayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NseHoliday.
     * @param {NseHolidayDeleteArgs} args - Arguments to delete one NseHoliday.
     * @example
     * // Delete one NseHoliday
     * const NseHoliday = await prisma.nseHoliday.delete({
     *   where: {
     *     // ... filter to delete one NseHoliday
     *   }
     * })
     * 
     */
    delete<T extends NseHolidayDeleteArgs>(args: SelectSubset<T, NseHolidayDeleteArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NseHoliday.
     * @param {NseHolidayUpdateArgs} args - Arguments to update one NseHoliday.
     * @example
     * // Update one NseHoliday
     * const nseHoliday = await prisma.nseHoliday.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NseHolidayUpdateArgs>(args: SelectSubset<T, NseHolidayUpdateArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NseHolidays.
     * @param {NseHolidayDeleteManyArgs} args - Arguments to filter NseHolidays to delete.
     * @example
     * // Delete a few NseHolidays
     * const { count } = await prisma.nseHoliday.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NseHolidayDeleteManyArgs>(args?: SelectSubset<T, NseHolidayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseHolidays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NseHolidays
     * const nseHoliday = await prisma.nseHoliday.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NseHolidayUpdateManyArgs>(args: SelectSubset<T, NseHolidayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NseHolidays and returns the data updated in the database.
     * @param {NseHolidayUpdateManyAndReturnArgs} args - Arguments to update many NseHolidays.
     * @example
     * // Update many NseHolidays
     * const nseHoliday = await prisma.nseHoliday.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NseHolidays and only return the `id`
     * const nseHolidayWithIdOnly = await prisma.nseHoliday.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NseHolidayUpdateManyAndReturnArgs>(args: SelectSubset<T, NseHolidayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NseHoliday.
     * @param {NseHolidayUpsertArgs} args - Arguments to update or create a NseHoliday.
     * @example
     * // Update or create a NseHoliday
     * const nseHoliday = await prisma.nseHoliday.upsert({
     *   create: {
     *     // ... data to create a NseHoliday
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NseHoliday we want to update
     *   }
     * })
     */
    upsert<T extends NseHolidayUpsertArgs>(args: SelectSubset<T, NseHolidayUpsertArgs<ExtArgs>>): Prisma__NseHolidayClient<$Result.GetResult<Prisma.$NseHolidayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NseHolidays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayCountArgs} args - Arguments to filter NseHolidays to count.
     * @example
     * // Count the number of NseHolidays
     * const count = await prisma.nseHoliday.count({
     *   where: {
     *     // ... the filter for the NseHolidays we want to count
     *   }
     * })
    **/
    count<T extends NseHolidayCountArgs>(
      args?: Subset<T, NseHolidayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NseHolidayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NseHoliday.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NseHolidayAggregateArgs>(args: Subset<T, NseHolidayAggregateArgs>): Prisma.PrismaPromise<GetNseHolidayAggregateType<T>>

    /**
     * Group by NseHoliday.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NseHolidayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NseHolidayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NseHolidayGroupByArgs['orderBy'] }
        : { orderBy?: NseHolidayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NseHolidayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNseHolidayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NseHoliday model
   */
  readonly fields: NseHolidayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NseHoliday.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NseHolidayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NseHoliday model
   */
  interface NseHolidayFieldRefs {
    readonly id: FieldRef<"NseHoliday", 'String'>
    readonly date: FieldRef<"NseHoliday", 'DateTime'>
    readonly createdAt: FieldRef<"NseHoliday", 'DateTime'>
    readonly updatedAt: FieldRef<"NseHoliday", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NseHoliday findUnique
   */
  export type NseHolidayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter, which NseHoliday to fetch.
     */
    where: NseHolidayWhereUniqueInput
  }

  /**
   * NseHoliday findUniqueOrThrow
   */
  export type NseHolidayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter, which NseHoliday to fetch.
     */
    where: NseHolidayWhereUniqueInput
  }

  /**
   * NseHoliday findFirst
   */
  export type NseHolidayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter, which NseHoliday to fetch.
     */
    where?: NseHolidayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseHolidays to fetch.
     */
    orderBy?: NseHolidayOrderByWithRelationInput | NseHolidayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseHolidays.
     */
    cursor?: NseHolidayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseHolidays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseHolidays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseHolidays.
     */
    distinct?: NseHolidayScalarFieldEnum | NseHolidayScalarFieldEnum[]
  }

  /**
   * NseHoliday findFirstOrThrow
   */
  export type NseHolidayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter, which NseHoliday to fetch.
     */
    where?: NseHolidayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseHolidays to fetch.
     */
    orderBy?: NseHolidayOrderByWithRelationInput | NseHolidayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NseHolidays.
     */
    cursor?: NseHolidayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseHolidays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseHolidays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NseHolidays.
     */
    distinct?: NseHolidayScalarFieldEnum | NseHolidayScalarFieldEnum[]
  }

  /**
   * NseHoliday findMany
   */
  export type NseHolidayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter, which NseHolidays to fetch.
     */
    where?: NseHolidayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NseHolidays to fetch.
     */
    orderBy?: NseHolidayOrderByWithRelationInput | NseHolidayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NseHolidays.
     */
    cursor?: NseHolidayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NseHolidays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NseHolidays.
     */
    skip?: number
    distinct?: NseHolidayScalarFieldEnum | NseHolidayScalarFieldEnum[]
  }

  /**
   * NseHoliday create
   */
  export type NseHolidayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * The data needed to create a NseHoliday.
     */
    data: XOR<NseHolidayCreateInput, NseHolidayUncheckedCreateInput>
  }

  /**
   * NseHoliday createMany
   */
  export type NseHolidayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NseHolidays.
     */
    data: NseHolidayCreateManyInput | NseHolidayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NseHoliday createManyAndReturn
   */
  export type NseHolidayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * The data used to create many NseHolidays.
     */
    data: NseHolidayCreateManyInput | NseHolidayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NseHoliday update
   */
  export type NseHolidayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * The data needed to update a NseHoliday.
     */
    data: XOR<NseHolidayUpdateInput, NseHolidayUncheckedUpdateInput>
    /**
     * Choose, which NseHoliday to update.
     */
    where: NseHolidayWhereUniqueInput
  }

  /**
   * NseHoliday updateMany
   */
  export type NseHolidayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NseHolidays.
     */
    data: XOR<NseHolidayUpdateManyMutationInput, NseHolidayUncheckedUpdateManyInput>
    /**
     * Filter which NseHolidays to update
     */
    where?: NseHolidayWhereInput
    /**
     * Limit how many NseHolidays to update.
     */
    limit?: number
  }

  /**
   * NseHoliday updateManyAndReturn
   */
  export type NseHolidayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * The data used to update NseHolidays.
     */
    data: XOR<NseHolidayUpdateManyMutationInput, NseHolidayUncheckedUpdateManyInput>
    /**
     * Filter which NseHolidays to update
     */
    where?: NseHolidayWhereInput
    /**
     * Limit how many NseHolidays to update.
     */
    limit?: number
  }

  /**
   * NseHoliday upsert
   */
  export type NseHolidayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * The filter to search for the NseHoliday to update in case it exists.
     */
    where: NseHolidayWhereUniqueInput
    /**
     * In case the NseHoliday found by the `where` argument doesn't exist, create a new NseHoliday with this data.
     */
    create: XOR<NseHolidayCreateInput, NseHolidayUncheckedCreateInput>
    /**
     * In case the NseHoliday was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NseHolidayUpdateInput, NseHolidayUncheckedUpdateInput>
  }

  /**
   * NseHoliday delete
   */
  export type NseHolidayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
    /**
     * Filter which NseHoliday to delete.
     */
    where: NseHolidayWhereUniqueInput
  }

  /**
   * NseHoliday deleteMany
   */
  export type NseHolidayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NseHolidays to delete
     */
    where?: NseHolidayWhereInput
    /**
     * Limit how many NseHolidays to delete.
     */
    limit?: number
  }

  /**
   * NseHoliday without action
   */
  export type NseHolidayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NseHoliday
     */
    select?: NseHolidaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the NseHoliday
     */
    omit?: NseHolidayOmit<ExtArgs> | null
  }


  /**
   * Model ShortlistSnapshot
   */

  export type AggregateShortlistSnapshot = {
    _count: ShortlistSnapshotCountAggregateOutputType | null
    _min: ShortlistSnapshotMinAggregateOutputType | null
    _max: ShortlistSnapshotMaxAggregateOutputType | null
  }

  export type ShortlistSnapshotMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    shortlistType: $Enums.ShortlistType | null
    scope: $Enums.ShortlistScope | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShortlistSnapshotMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    shortlistType: $Enums.ShortlistType | null
    scope: $Enums.ShortlistScope | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShortlistSnapshotCountAggregateOutputType = {
    id: number
    timestamp: number
    shortlistType: number
    entries: number
    scope: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShortlistSnapshotMinAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    scope?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShortlistSnapshotMaxAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    scope?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShortlistSnapshotCountAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    entries?: true
    scope?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShortlistSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShortlistSnapshot to aggregate.
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShortlistSnapshots to fetch.
     */
    orderBy?: ShortlistSnapshotOrderByWithRelationInput | ShortlistSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShortlistSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShortlistSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShortlistSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShortlistSnapshots
    **/
    _count?: true | ShortlistSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShortlistSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShortlistSnapshotMaxAggregateInputType
  }

  export type GetShortlistSnapshotAggregateType<T extends ShortlistSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateShortlistSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShortlistSnapshot[P]>
      : GetScalarType<T[P], AggregateShortlistSnapshot[P]>
  }




  export type ShortlistSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShortlistSnapshotWhereInput
    orderBy?: ShortlistSnapshotOrderByWithAggregationInput | ShortlistSnapshotOrderByWithAggregationInput[]
    by: ShortlistSnapshotScalarFieldEnum[] | ShortlistSnapshotScalarFieldEnum
    having?: ShortlistSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShortlistSnapshotCountAggregateInputType | true
    _min?: ShortlistSnapshotMinAggregateInputType
    _max?: ShortlistSnapshotMaxAggregateInputType
  }

  export type ShortlistSnapshotGroupByOutputType = {
    id: string
    timestamp: Date
    shortlistType: $Enums.ShortlistType
    entries: JsonValue
    scope: $Enums.ShortlistScope
    createdAt: Date
    updatedAt: Date
    _count: ShortlistSnapshotCountAggregateOutputType | null
    _min: ShortlistSnapshotMinAggregateOutputType | null
    _max: ShortlistSnapshotMaxAggregateOutputType | null
  }

  type GetShortlistSnapshotGroupByPayload<T extends ShortlistSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShortlistSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShortlistSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShortlistSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], ShortlistSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type ShortlistSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    scope?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    scope?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    scope?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectScalar = {
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    scope?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShortlistSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "shortlistType" | "entries" | "scope" | "createdAt" | "updatedAt", ExtArgs["result"]["shortlistSnapshot"]>

  export type $ShortlistSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShortlistSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      shortlistType: $Enums.ShortlistType
      entries: Prisma.JsonValue
      scope: $Enums.ShortlistScope
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shortlistSnapshot"]>
    composites: {}
  }

  type ShortlistSnapshotGetPayload<S extends boolean | null | undefined | ShortlistSnapshotDefaultArgs> = $Result.GetResult<Prisma.$ShortlistSnapshotPayload, S>

  type ShortlistSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShortlistSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShortlistSnapshotCountAggregateInputType | true
    }

  export interface ShortlistSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShortlistSnapshot'], meta: { name: 'ShortlistSnapshot' } }
    /**
     * Find zero or one ShortlistSnapshot that matches the filter.
     * @param {ShortlistSnapshotFindUniqueArgs} args - Arguments to find a ShortlistSnapshot
     * @example
     * // Get one ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShortlistSnapshotFindUniqueArgs>(args: SelectSubset<T, ShortlistSnapshotFindUniqueArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShortlistSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShortlistSnapshotFindUniqueOrThrowArgs} args - Arguments to find a ShortlistSnapshot
     * @example
     * // Get one ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShortlistSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, ShortlistSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShortlistSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotFindFirstArgs} args - Arguments to find a ShortlistSnapshot
     * @example
     * // Get one ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShortlistSnapshotFindFirstArgs>(args?: SelectSubset<T, ShortlistSnapshotFindFirstArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShortlistSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotFindFirstOrThrowArgs} args - Arguments to find a ShortlistSnapshot
     * @example
     * // Get one ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShortlistSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, ShortlistSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShortlistSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShortlistSnapshots
     * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany()
     * 
     * // Get first 10 ShortlistSnapshots
     * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shortlistSnapshotWithIdOnly = await prisma.shortlistSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShortlistSnapshotFindManyArgs>(args?: SelectSubset<T, ShortlistSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShortlistSnapshot.
     * @param {ShortlistSnapshotCreateArgs} args - Arguments to create a ShortlistSnapshot.
     * @example
     * // Create one ShortlistSnapshot
     * const ShortlistSnapshot = await prisma.shortlistSnapshot.create({
     *   data: {
     *     // ... data to create a ShortlistSnapshot
     *   }
     * })
     * 
     */
    create<T extends ShortlistSnapshotCreateArgs>(args: SelectSubset<T, ShortlistSnapshotCreateArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShortlistSnapshots.
     * @param {ShortlistSnapshotCreateManyArgs} args - Arguments to create many ShortlistSnapshots.
     * @example
     * // Create many ShortlistSnapshots
     * const shortlistSnapshot = await prisma.shortlistSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShortlistSnapshotCreateManyArgs>(args?: SelectSubset<T, ShortlistSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShortlistSnapshots and returns the data saved in the database.
     * @param {ShortlistSnapshotCreateManyAndReturnArgs} args - Arguments to create many ShortlistSnapshots.
     * @example
     * // Create many ShortlistSnapshots
     * const shortlistSnapshot = await prisma.shortlistSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShortlistSnapshots and only return the `id`
     * const shortlistSnapshotWithIdOnly = await prisma.shortlistSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShortlistSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, ShortlistSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShortlistSnapshot.
     * @param {ShortlistSnapshotDeleteArgs} args - Arguments to delete one ShortlistSnapshot.
     * @example
     * // Delete one ShortlistSnapshot
     * const ShortlistSnapshot = await prisma.shortlistSnapshot.delete({
     *   where: {
     *     // ... filter to delete one ShortlistSnapshot
     *   }
     * })
     * 
     */
    delete<T extends ShortlistSnapshotDeleteArgs>(args: SelectSubset<T, ShortlistSnapshotDeleteArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShortlistSnapshot.
     * @param {ShortlistSnapshotUpdateArgs} args - Arguments to update one ShortlistSnapshot.
     * @example
     * // Update one ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShortlistSnapshotUpdateArgs>(args: SelectSubset<T, ShortlistSnapshotUpdateArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShortlistSnapshots.
     * @param {ShortlistSnapshotDeleteManyArgs} args - Arguments to filter ShortlistSnapshots to delete.
     * @example
     * // Delete a few ShortlistSnapshots
     * const { count } = await prisma.shortlistSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShortlistSnapshotDeleteManyArgs>(args?: SelectSubset<T, ShortlistSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShortlistSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShortlistSnapshots
     * const shortlistSnapshot = await prisma.shortlistSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShortlistSnapshotUpdateManyArgs>(args: SelectSubset<T, ShortlistSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShortlistSnapshots and returns the data updated in the database.
     * @param {ShortlistSnapshotUpdateManyAndReturnArgs} args - Arguments to update many ShortlistSnapshots.
     * @example
     * // Update many ShortlistSnapshots
     * const shortlistSnapshot = await prisma.shortlistSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShortlistSnapshots and only return the `id`
     * const shortlistSnapshotWithIdOnly = await prisma.shortlistSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShortlistSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, ShortlistSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShortlistSnapshot.
     * @param {ShortlistSnapshotUpsertArgs} args - Arguments to update or create a ShortlistSnapshot.
     * @example
     * // Update or create a ShortlistSnapshot
     * const shortlistSnapshot = await prisma.shortlistSnapshot.upsert({
     *   create: {
     *     // ... data to create a ShortlistSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShortlistSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends ShortlistSnapshotUpsertArgs>(args: SelectSubset<T, ShortlistSnapshotUpsertArgs<ExtArgs>>): Prisma__ShortlistSnapshotClient<$Result.GetResult<Prisma.$ShortlistSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShortlistSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotCountArgs} args - Arguments to filter ShortlistSnapshots to count.
     * @example
     * // Count the number of ShortlistSnapshots
     * const count = await prisma.shortlistSnapshot.count({
     *   where: {
     *     // ... the filter for the ShortlistSnapshots we want to count
     *   }
     * })
    **/
    count<T extends ShortlistSnapshotCountArgs>(
      args?: Subset<T, ShortlistSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShortlistSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShortlistSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShortlistSnapshotAggregateArgs>(args: Subset<T, ShortlistSnapshotAggregateArgs>): Prisma.PrismaPromise<GetShortlistSnapshotAggregateType<T>>

    /**
     * Group by ShortlistSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShortlistSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShortlistSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShortlistSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: ShortlistSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShortlistSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShortlistSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShortlistSnapshot model
   */
  readonly fields: ShortlistSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShortlistSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShortlistSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShortlistSnapshot model
   */
  interface ShortlistSnapshotFieldRefs {
    readonly id: FieldRef<"ShortlistSnapshot", 'String'>
    readonly timestamp: FieldRef<"ShortlistSnapshot", 'DateTime'>
    readonly shortlistType: FieldRef<"ShortlistSnapshot", 'ShortlistType'>
    readonly entries: FieldRef<"ShortlistSnapshot", 'Json'>
    readonly scope: FieldRef<"ShortlistSnapshot", 'ShortlistScope'>
    readonly createdAt: FieldRef<"ShortlistSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"ShortlistSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShortlistSnapshot findUnique
   */
  export type ShortlistSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which ShortlistSnapshot to fetch.
     */
    where: ShortlistSnapshotWhereUniqueInput
  }

  /**
   * ShortlistSnapshot findUniqueOrThrow
   */
  export type ShortlistSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which ShortlistSnapshot to fetch.
     */
    where: ShortlistSnapshotWhereUniqueInput
  }

  /**
   * ShortlistSnapshot findFirst
   */
  export type ShortlistSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which ShortlistSnapshot to fetch.
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShortlistSnapshots to fetch.
     */
    orderBy?: ShortlistSnapshotOrderByWithRelationInput | ShortlistSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShortlistSnapshots.
     */
    cursor?: ShortlistSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShortlistSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShortlistSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShortlistSnapshots.
     */
    distinct?: ShortlistSnapshotScalarFieldEnum | ShortlistSnapshotScalarFieldEnum[]
  }

  /**
   * ShortlistSnapshot findFirstOrThrow
   */
  export type ShortlistSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which ShortlistSnapshot to fetch.
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShortlistSnapshots to fetch.
     */
    orderBy?: ShortlistSnapshotOrderByWithRelationInput | ShortlistSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShortlistSnapshots.
     */
    cursor?: ShortlistSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShortlistSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShortlistSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShortlistSnapshots.
     */
    distinct?: ShortlistSnapshotScalarFieldEnum | ShortlistSnapshotScalarFieldEnum[]
  }

  /**
   * ShortlistSnapshot findMany
   */
  export type ShortlistSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which ShortlistSnapshots to fetch.
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShortlistSnapshots to fetch.
     */
    orderBy?: ShortlistSnapshotOrderByWithRelationInput | ShortlistSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShortlistSnapshots.
     */
    cursor?: ShortlistSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShortlistSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShortlistSnapshots.
     */
    skip?: number
    distinct?: ShortlistSnapshotScalarFieldEnum | ShortlistSnapshotScalarFieldEnum[]
  }

  /**
   * ShortlistSnapshot create
   */
  export type ShortlistSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a ShortlistSnapshot.
     */
    data: XOR<ShortlistSnapshotCreateInput, ShortlistSnapshotUncheckedCreateInput>
  }

  /**
   * ShortlistSnapshot createMany
   */
  export type ShortlistSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShortlistSnapshots.
     */
    data: ShortlistSnapshotCreateManyInput | ShortlistSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShortlistSnapshot createManyAndReturn
   */
  export type ShortlistSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many ShortlistSnapshots.
     */
    data: ShortlistSnapshotCreateManyInput | ShortlistSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShortlistSnapshot update
   */
  export type ShortlistSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a ShortlistSnapshot.
     */
    data: XOR<ShortlistSnapshotUpdateInput, ShortlistSnapshotUncheckedUpdateInput>
    /**
     * Choose, which ShortlistSnapshot to update.
     */
    where: ShortlistSnapshotWhereUniqueInput
  }

  /**
   * ShortlistSnapshot updateMany
   */
  export type ShortlistSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShortlistSnapshots.
     */
    data: XOR<ShortlistSnapshotUpdateManyMutationInput, ShortlistSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which ShortlistSnapshots to update
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * Limit how many ShortlistSnapshots to update.
     */
    limit?: number
  }

  /**
   * ShortlistSnapshot updateManyAndReturn
   */
  export type ShortlistSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update ShortlistSnapshots.
     */
    data: XOR<ShortlistSnapshotUpdateManyMutationInput, ShortlistSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which ShortlistSnapshots to update
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * Limit how many ShortlistSnapshots to update.
     */
    limit?: number
  }

  /**
   * ShortlistSnapshot upsert
   */
  export type ShortlistSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the ShortlistSnapshot to update in case it exists.
     */
    where: ShortlistSnapshotWhereUniqueInput
    /**
     * In case the ShortlistSnapshot found by the `where` argument doesn't exist, create a new ShortlistSnapshot with this data.
     */
    create: XOR<ShortlistSnapshotCreateInput, ShortlistSnapshotUncheckedCreateInput>
    /**
     * In case the ShortlistSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShortlistSnapshotUpdateInput, ShortlistSnapshotUncheckedUpdateInput>
  }

  /**
   * ShortlistSnapshot delete
   */
  export type ShortlistSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
    /**
     * Filter which ShortlistSnapshot to delete.
     */
    where: ShortlistSnapshotWhereUniqueInput
  }

  /**
   * ShortlistSnapshot deleteMany
   */
  export type ShortlistSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShortlistSnapshots to delete
     */
    where?: ShortlistSnapshotWhereInput
    /**
     * Limit how many ShortlistSnapshots to delete.
     */
    limit?: number
  }

  /**
   * ShortlistSnapshot without action
   */
  export type ShortlistSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShortlistSnapshot
     */
    select?: ShortlistSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShortlistSnapshot
     */
    omit?: ShortlistSnapshotOmit<ExtArgs> | null
  }


  /**
   * Model CollectorError
   */

  export type AggregateCollectorError = {
    _count: CollectorErrorCountAggregateOutputType | null
    _min: CollectorErrorMinAggregateOutputType | null
    _max: CollectorErrorMaxAggregateOutputType | null
  }

  export type CollectorErrorMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    errorMessage: string | null
    errorStack: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectorErrorMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    errorMessage: string | null
    errorStack: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectorErrorCountAggregateOutputType = {
    id: number
    timestamp: number
    errorMessage: number
    errorStack: number
    errorContext: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CollectorErrorMinAggregateInputType = {
    id?: true
    timestamp?: true
    errorMessage?: true
    errorStack?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectorErrorMaxAggregateInputType = {
    id?: true
    timestamp?: true
    errorMessage?: true
    errorStack?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectorErrorCountAggregateInputType = {
    id?: true
    timestamp?: true
    errorMessage?: true
    errorStack?: true
    errorContext?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CollectorErrorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectorError to aggregate.
     */
    where?: CollectorErrorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectorErrors to fetch.
     */
    orderBy?: CollectorErrorOrderByWithRelationInput | CollectorErrorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectorErrorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectorErrors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectorErrors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CollectorErrors
    **/
    _count?: true | CollectorErrorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectorErrorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectorErrorMaxAggregateInputType
  }

  export type GetCollectorErrorAggregateType<T extends CollectorErrorAggregateArgs> = {
        [P in keyof T & keyof AggregateCollectorError]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollectorError[P]>
      : GetScalarType<T[P], AggregateCollectorError[P]>
  }




  export type CollectorErrorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectorErrorWhereInput
    orderBy?: CollectorErrorOrderByWithAggregationInput | CollectorErrorOrderByWithAggregationInput[]
    by: CollectorErrorScalarFieldEnum[] | CollectorErrorScalarFieldEnum
    having?: CollectorErrorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectorErrorCountAggregateInputType | true
    _min?: CollectorErrorMinAggregateInputType
    _max?: CollectorErrorMaxAggregateInputType
  }

  export type CollectorErrorGroupByOutputType = {
    id: string
    timestamp: Date
    errorMessage: string
    errorStack: string | null
    errorContext: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: CollectorErrorCountAggregateOutputType | null
    _min: CollectorErrorMinAggregateOutputType | null
    _max: CollectorErrorMaxAggregateOutputType | null
  }

  type GetCollectorErrorGroupByPayload<T extends CollectorErrorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectorErrorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectorErrorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectorErrorGroupByOutputType[P]>
            : GetScalarType<T[P], CollectorErrorGroupByOutputType[P]>
        }
      >
    >


  export type CollectorErrorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    errorMessage?: boolean
    errorStack?: boolean
    errorContext?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["collectorError"]>

  export type CollectorErrorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    errorMessage?: boolean
    errorStack?: boolean
    errorContext?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["collectorError"]>

  export type CollectorErrorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    errorMessage?: boolean
    errorStack?: boolean
    errorContext?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["collectorError"]>

  export type CollectorErrorSelectScalar = {
    id?: boolean
    timestamp?: boolean
    errorMessage?: boolean
    errorStack?: boolean
    errorContext?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CollectorErrorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "errorMessage" | "errorStack" | "errorContext" | "createdAt" | "updatedAt", ExtArgs["result"]["collectorError"]>

  export type $CollectorErrorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CollectorError"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      errorMessage: string
      errorStack: string | null
      errorContext: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["collectorError"]>
    composites: {}
  }

  type CollectorErrorGetPayload<S extends boolean | null | undefined | CollectorErrorDefaultArgs> = $Result.GetResult<Prisma.$CollectorErrorPayload, S>

  type CollectorErrorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollectorErrorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollectorErrorCountAggregateInputType | true
    }

  export interface CollectorErrorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CollectorError'], meta: { name: 'CollectorError' } }
    /**
     * Find zero or one CollectorError that matches the filter.
     * @param {CollectorErrorFindUniqueArgs} args - Arguments to find a CollectorError
     * @example
     * // Get one CollectorError
     * const collectorError = await prisma.collectorError.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectorErrorFindUniqueArgs>(args: SelectSubset<T, CollectorErrorFindUniqueArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CollectorError that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollectorErrorFindUniqueOrThrowArgs} args - Arguments to find a CollectorError
     * @example
     * // Get one CollectorError
     * const collectorError = await prisma.collectorError.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectorErrorFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectorErrorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollectorError that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorFindFirstArgs} args - Arguments to find a CollectorError
     * @example
     * // Get one CollectorError
     * const collectorError = await prisma.collectorError.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectorErrorFindFirstArgs>(args?: SelectSubset<T, CollectorErrorFindFirstArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollectorError that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorFindFirstOrThrowArgs} args - Arguments to find a CollectorError
     * @example
     * // Get one CollectorError
     * const collectorError = await prisma.collectorError.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectorErrorFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectorErrorFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CollectorErrors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CollectorErrors
     * const collectorErrors = await prisma.collectorError.findMany()
     * 
     * // Get first 10 CollectorErrors
     * const collectorErrors = await prisma.collectorError.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collectorErrorWithIdOnly = await prisma.collectorError.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollectorErrorFindManyArgs>(args?: SelectSubset<T, CollectorErrorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CollectorError.
     * @param {CollectorErrorCreateArgs} args - Arguments to create a CollectorError.
     * @example
     * // Create one CollectorError
     * const CollectorError = await prisma.collectorError.create({
     *   data: {
     *     // ... data to create a CollectorError
     *   }
     * })
     * 
     */
    create<T extends CollectorErrorCreateArgs>(args: SelectSubset<T, CollectorErrorCreateArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CollectorErrors.
     * @param {CollectorErrorCreateManyArgs} args - Arguments to create many CollectorErrors.
     * @example
     * // Create many CollectorErrors
     * const collectorError = await prisma.collectorError.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectorErrorCreateManyArgs>(args?: SelectSubset<T, CollectorErrorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CollectorErrors and returns the data saved in the database.
     * @param {CollectorErrorCreateManyAndReturnArgs} args - Arguments to create many CollectorErrors.
     * @example
     * // Create many CollectorErrors
     * const collectorError = await prisma.collectorError.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CollectorErrors and only return the `id`
     * const collectorErrorWithIdOnly = await prisma.collectorError.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectorErrorCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectorErrorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CollectorError.
     * @param {CollectorErrorDeleteArgs} args - Arguments to delete one CollectorError.
     * @example
     * // Delete one CollectorError
     * const CollectorError = await prisma.collectorError.delete({
     *   where: {
     *     // ... filter to delete one CollectorError
     *   }
     * })
     * 
     */
    delete<T extends CollectorErrorDeleteArgs>(args: SelectSubset<T, CollectorErrorDeleteArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CollectorError.
     * @param {CollectorErrorUpdateArgs} args - Arguments to update one CollectorError.
     * @example
     * // Update one CollectorError
     * const collectorError = await prisma.collectorError.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectorErrorUpdateArgs>(args: SelectSubset<T, CollectorErrorUpdateArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CollectorErrors.
     * @param {CollectorErrorDeleteManyArgs} args - Arguments to filter CollectorErrors to delete.
     * @example
     * // Delete a few CollectorErrors
     * const { count } = await prisma.collectorError.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectorErrorDeleteManyArgs>(args?: SelectSubset<T, CollectorErrorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollectorErrors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CollectorErrors
     * const collectorError = await prisma.collectorError.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectorErrorUpdateManyArgs>(args: SelectSubset<T, CollectorErrorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollectorErrors and returns the data updated in the database.
     * @param {CollectorErrorUpdateManyAndReturnArgs} args - Arguments to update many CollectorErrors.
     * @example
     * // Update many CollectorErrors
     * const collectorError = await prisma.collectorError.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CollectorErrors and only return the `id`
     * const collectorErrorWithIdOnly = await prisma.collectorError.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CollectorErrorUpdateManyAndReturnArgs>(args: SelectSubset<T, CollectorErrorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CollectorError.
     * @param {CollectorErrorUpsertArgs} args - Arguments to update or create a CollectorError.
     * @example
     * // Update or create a CollectorError
     * const collectorError = await prisma.collectorError.upsert({
     *   create: {
     *     // ... data to create a CollectorError
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CollectorError we want to update
     *   }
     * })
     */
    upsert<T extends CollectorErrorUpsertArgs>(args: SelectSubset<T, CollectorErrorUpsertArgs<ExtArgs>>): Prisma__CollectorErrorClient<$Result.GetResult<Prisma.$CollectorErrorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CollectorErrors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorCountArgs} args - Arguments to filter CollectorErrors to count.
     * @example
     * // Count the number of CollectorErrors
     * const count = await prisma.collectorError.count({
     *   where: {
     *     // ... the filter for the CollectorErrors we want to count
     *   }
     * })
    **/
    count<T extends CollectorErrorCountArgs>(
      args?: Subset<T, CollectorErrorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectorErrorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CollectorError.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollectorErrorAggregateArgs>(args: Subset<T, CollectorErrorAggregateArgs>): Prisma.PrismaPromise<GetCollectorErrorAggregateType<T>>

    /**
     * Group by CollectorError.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectorErrorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollectorErrorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectorErrorGroupByArgs['orderBy'] }
        : { orderBy?: CollectorErrorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollectorErrorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectorErrorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CollectorError model
   */
  readonly fields: CollectorErrorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CollectorError.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectorErrorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CollectorError model
   */
  interface CollectorErrorFieldRefs {
    readonly id: FieldRef<"CollectorError", 'String'>
    readonly timestamp: FieldRef<"CollectorError", 'DateTime'>
    readonly errorMessage: FieldRef<"CollectorError", 'String'>
    readonly errorStack: FieldRef<"CollectorError", 'String'>
    readonly errorContext: FieldRef<"CollectorError", 'Json'>
    readonly createdAt: FieldRef<"CollectorError", 'DateTime'>
    readonly updatedAt: FieldRef<"CollectorError", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CollectorError findUnique
   */
  export type CollectorErrorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter, which CollectorError to fetch.
     */
    where: CollectorErrorWhereUniqueInput
  }

  /**
   * CollectorError findUniqueOrThrow
   */
  export type CollectorErrorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter, which CollectorError to fetch.
     */
    where: CollectorErrorWhereUniqueInput
  }

  /**
   * CollectorError findFirst
   */
  export type CollectorErrorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter, which CollectorError to fetch.
     */
    where?: CollectorErrorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectorErrors to fetch.
     */
    orderBy?: CollectorErrorOrderByWithRelationInput | CollectorErrorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectorErrors.
     */
    cursor?: CollectorErrorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectorErrors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectorErrors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectorErrors.
     */
    distinct?: CollectorErrorScalarFieldEnum | CollectorErrorScalarFieldEnum[]
  }

  /**
   * CollectorError findFirstOrThrow
   */
  export type CollectorErrorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter, which CollectorError to fetch.
     */
    where?: CollectorErrorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectorErrors to fetch.
     */
    orderBy?: CollectorErrorOrderByWithRelationInput | CollectorErrorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectorErrors.
     */
    cursor?: CollectorErrorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectorErrors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectorErrors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectorErrors.
     */
    distinct?: CollectorErrorScalarFieldEnum | CollectorErrorScalarFieldEnum[]
  }

  /**
   * CollectorError findMany
   */
  export type CollectorErrorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter, which CollectorErrors to fetch.
     */
    where?: CollectorErrorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectorErrors to fetch.
     */
    orderBy?: CollectorErrorOrderByWithRelationInput | CollectorErrorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CollectorErrors.
     */
    cursor?: CollectorErrorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectorErrors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectorErrors.
     */
    skip?: number
    distinct?: CollectorErrorScalarFieldEnum | CollectorErrorScalarFieldEnum[]
  }

  /**
   * CollectorError create
   */
  export type CollectorErrorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * The data needed to create a CollectorError.
     */
    data: XOR<CollectorErrorCreateInput, CollectorErrorUncheckedCreateInput>
  }

  /**
   * CollectorError createMany
   */
  export type CollectorErrorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CollectorErrors.
     */
    data: CollectorErrorCreateManyInput | CollectorErrorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CollectorError createManyAndReturn
   */
  export type CollectorErrorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * The data used to create many CollectorErrors.
     */
    data: CollectorErrorCreateManyInput | CollectorErrorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CollectorError update
   */
  export type CollectorErrorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * The data needed to update a CollectorError.
     */
    data: XOR<CollectorErrorUpdateInput, CollectorErrorUncheckedUpdateInput>
    /**
     * Choose, which CollectorError to update.
     */
    where: CollectorErrorWhereUniqueInput
  }

  /**
   * CollectorError updateMany
   */
  export type CollectorErrorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CollectorErrors.
     */
    data: XOR<CollectorErrorUpdateManyMutationInput, CollectorErrorUncheckedUpdateManyInput>
    /**
     * Filter which CollectorErrors to update
     */
    where?: CollectorErrorWhereInput
    /**
     * Limit how many CollectorErrors to update.
     */
    limit?: number
  }

  /**
   * CollectorError updateManyAndReturn
   */
  export type CollectorErrorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * The data used to update CollectorErrors.
     */
    data: XOR<CollectorErrorUpdateManyMutationInput, CollectorErrorUncheckedUpdateManyInput>
    /**
     * Filter which CollectorErrors to update
     */
    where?: CollectorErrorWhereInput
    /**
     * Limit how many CollectorErrors to update.
     */
    limit?: number
  }

  /**
   * CollectorError upsert
   */
  export type CollectorErrorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * The filter to search for the CollectorError to update in case it exists.
     */
    where: CollectorErrorWhereUniqueInput
    /**
     * In case the CollectorError found by the `where` argument doesn't exist, create a new CollectorError with this data.
     */
    create: XOR<CollectorErrorCreateInput, CollectorErrorUncheckedCreateInput>
    /**
     * In case the CollectorError was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectorErrorUpdateInput, CollectorErrorUncheckedUpdateInput>
  }

  /**
   * CollectorError delete
   */
  export type CollectorErrorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
    /**
     * Filter which CollectorError to delete.
     */
    where: CollectorErrorWhereUniqueInput
  }

  /**
   * CollectorError deleteMany
   */
  export type CollectorErrorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectorErrors to delete
     */
    where?: CollectorErrorWhereInput
    /**
     * Limit how many CollectorErrors to delete.
     */
    limit?: number
  }

  /**
   * CollectorError without action
   */
  export type CollectorErrorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectorError
     */
    select?: CollectorErrorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectorError
     */
    omit?: CollectorErrorOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DeveloperScalarFieldEnum: {
    id: 'id',
    username: 'username',
    token: 'token',
    growwApiKey: 'growwApiKey',
    growwApiSecret: 'growwApiSecret',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeveloperScalarFieldEnum = (typeof DeveloperScalarFieldEnum)[keyof typeof DeveloperScalarFieldEnum]


  export const RunScalarFieldEnum: {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    completed: 'completed',
    name: 'name',
    tags: 'tags',
    developerId: 'developerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RunScalarFieldEnum = (typeof RunScalarFieldEnum)[keyof typeof RunScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    nseSymbol: 'nseSymbol',
    stopLossPrice: 'stopLossPrice',
    takeProfitPrice: 'takeProfitPrice',
    entryPrice: 'entryPrice',
    timestamp: 'timestamp',
    runId: 'runId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const NseIntrumentScalarFieldEnum: {
    id: 'id',
    symbol: 'symbol',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NseIntrumentScalarFieldEnum = (typeof NseIntrumentScalarFieldEnum)[keyof typeof NseIntrumentScalarFieldEnum]


  export const NseCandleScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    volume: 'volume',
    instrumentId: 'instrumentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NseCandleScalarFieldEnum = (typeof NseCandleScalarFieldEnum)[keyof typeof NseCandleScalarFieldEnum]


  export const NseHolidayScalarFieldEnum: {
    id: 'id',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NseHolidayScalarFieldEnum = (typeof NseHolidayScalarFieldEnum)[keyof typeof NseHolidayScalarFieldEnum]


  export const ShortlistSnapshotScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    shortlistType: 'shortlistType',
    entries: 'entries',
    scope: 'scope',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShortlistSnapshotScalarFieldEnum = (typeof ShortlistSnapshotScalarFieldEnum)[keyof typeof ShortlistSnapshotScalarFieldEnum]


  export const CollectorErrorScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    errorMessage: 'errorMessage',
    errorStack: 'errorStack',
    errorContext: 'errorContext',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CollectorErrorScalarFieldEnum = (typeof CollectorErrorScalarFieldEnum)[keyof typeof CollectorErrorScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'ShortlistType'
   */
  export type EnumShortlistTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistType'>
    


  /**
   * Reference to a field of type 'ShortlistType[]'
   */
  export type ListEnumShortlistTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ShortlistScope'
   */
  export type EnumShortlistScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistScope'>
    


  /**
   * Reference to a field of type 'ShortlistScope[]'
   */
  export type ListEnumShortlistScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistScope[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type DeveloperWhereInput = {
    AND?: DeveloperWhereInput | DeveloperWhereInput[]
    OR?: DeveloperWhereInput[]
    NOT?: DeveloperWhereInput | DeveloperWhereInput[]
    id?: StringFilter<"Developer"> | string
    username?: StringFilter<"Developer"> | string
    token?: StringFilter<"Developer"> | string
    growwApiKey?: StringNullableFilter<"Developer"> | string | null
    growwApiSecret?: StringNullableFilter<"Developer"> | string | null
    createdAt?: DateTimeFilter<"Developer"> | Date | string
    updatedAt?: DateTimeFilter<"Developer"> | Date | string
    runs?: RunListRelationFilter
  }

  export type DeveloperOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    token?: SortOrder
    growwApiKey?: SortOrderInput | SortOrder
    growwApiSecret?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    runs?: RunOrderByRelationAggregateInput
  }

  export type DeveloperWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    token?: string
    AND?: DeveloperWhereInput | DeveloperWhereInput[]
    OR?: DeveloperWhereInput[]
    NOT?: DeveloperWhereInput | DeveloperWhereInput[]
    growwApiKey?: StringNullableFilter<"Developer"> | string | null
    growwApiSecret?: StringNullableFilter<"Developer"> | string | null
    createdAt?: DateTimeFilter<"Developer"> | Date | string
    updatedAt?: DateTimeFilter<"Developer"> | Date | string
    runs?: RunListRelationFilter
  }, "username" | "id" | "username" | "token">

  export type DeveloperOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    token?: SortOrder
    growwApiKey?: SortOrderInput | SortOrder
    growwApiSecret?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeveloperCountOrderByAggregateInput
    _max?: DeveloperMaxOrderByAggregateInput
    _min?: DeveloperMinOrderByAggregateInput
  }

  export type DeveloperScalarWhereWithAggregatesInput = {
    AND?: DeveloperScalarWhereWithAggregatesInput | DeveloperScalarWhereWithAggregatesInput[]
    OR?: DeveloperScalarWhereWithAggregatesInput[]
    NOT?: DeveloperScalarWhereWithAggregatesInput | DeveloperScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Developer"> | string
    username?: StringWithAggregatesFilter<"Developer"> | string
    token?: StringWithAggregatesFilter<"Developer"> | string
    growwApiKey?: StringNullableWithAggregatesFilter<"Developer"> | string | null
    growwApiSecret?: StringNullableWithAggregatesFilter<"Developer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Developer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Developer"> | Date | string
  }

  export type RunWhereInput = {
    AND?: RunWhereInput | RunWhereInput[]
    OR?: RunWhereInput[]
    NOT?: RunWhereInput | RunWhereInput[]
    id?: StringFilter<"Run"> | string
    startTime?: DateTimeFilter<"Run"> | Date | string
    endTime?: DateTimeFilter<"Run"> | Date | string
    completed?: BoolFilter<"Run"> | boolean
    name?: StringNullableFilter<"Run"> | string | null
    tags?: StringNullableListFilter<"Run">
    developerId?: StringNullableFilter<"Run"> | string | null
    createdAt?: DateTimeFilter<"Run"> | Date | string
    updatedAt?: DateTimeFilter<"Run"> | Date | string
    orders?: OrderListRelationFilter
    developer?: XOR<DeveloperNullableScalarRelationFilter, DeveloperWhereInput> | null
  }

  export type RunOrderByWithRelationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    completed?: SortOrder
    name?: SortOrderInput | SortOrder
    tags?: SortOrder
    developerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orders?: OrderOrderByRelationAggregateInput
    developer?: DeveloperOrderByWithRelationInput
  }

  export type RunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RunWhereInput | RunWhereInput[]
    OR?: RunWhereInput[]
    NOT?: RunWhereInput | RunWhereInput[]
    startTime?: DateTimeFilter<"Run"> | Date | string
    endTime?: DateTimeFilter<"Run"> | Date | string
    completed?: BoolFilter<"Run"> | boolean
    name?: StringNullableFilter<"Run"> | string | null
    tags?: StringNullableListFilter<"Run">
    developerId?: StringNullableFilter<"Run"> | string | null
    createdAt?: DateTimeFilter<"Run"> | Date | string
    updatedAt?: DateTimeFilter<"Run"> | Date | string
    orders?: OrderListRelationFilter
    developer?: XOR<DeveloperNullableScalarRelationFilter, DeveloperWhereInput> | null
  }, "id">

  export type RunOrderByWithAggregationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    completed?: SortOrder
    name?: SortOrderInput | SortOrder
    tags?: SortOrder
    developerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RunCountOrderByAggregateInput
    _max?: RunMaxOrderByAggregateInput
    _min?: RunMinOrderByAggregateInput
  }

  export type RunScalarWhereWithAggregatesInput = {
    AND?: RunScalarWhereWithAggregatesInput | RunScalarWhereWithAggregatesInput[]
    OR?: RunScalarWhereWithAggregatesInput[]
    NOT?: RunScalarWhereWithAggregatesInput | RunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Run"> | string
    startTime?: DateTimeWithAggregatesFilter<"Run"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Run"> | Date | string
    completed?: BoolWithAggregatesFilter<"Run"> | boolean
    name?: StringNullableWithAggregatesFilter<"Run"> | string | null
    tags?: StringNullableListFilter<"Run">
    developerId?: StringNullableWithAggregatesFilter<"Run"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Run"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Run"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    nseSymbol?: StringFilter<"Order"> | string
    stopLossPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"Order"> | Date | string
    runId?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    run?: XOR<RunScalarRelationFilter, RunWhereInput>
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    nseSymbol?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
    timestamp?: SortOrder
    runId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    run?: RunOrderByWithRelationInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    nseSymbol?: StringFilter<"Order"> | string
    stopLossPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"Order"> | Date | string
    runId?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    run?: XOR<RunScalarRelationFilter, RunWhereInput>
  }, "id">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    nseSymbol?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
    timestamp?: SortOrder
    runId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    nseSymbol?: StringWithAggregatesFilter<"Order"> | string
    stopLossPrice?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    runId?: StringWithAggregatesFilter<"Order"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type NseIntrumentWhereInput = {
    AND?: NseIntrumentWhereInput | NseIntrumentWhereInput[]
    OR?: NseIntrumentWhereInput[]
    NOT?: NseIntrumentWhereInput | NseIntrumentWhereInput[]
    id?: StringFilter<"NseIntrument"> | string
    symbol?: StringFilter<"NseIntrument"> | string
    name?: StringFilter<"NseIntrument"> | string
    createdAt?: DateTimeFilter<"NseIntrument"> | Date | string
    updatedAt?: DateTimeFilter<"NseIntrument"> | Date | string
    candles?: NseCandleListRelationFilter
  }

  export type NseIntrumentOrderByWithRelationInput = {
    id?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candles?: NseCandleOrderByRelationAggregateInput
  }

  export type NseIntrumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    symbol?: string
    AND?: NseIntrumentWhereInput | NseIntrumentWhereInput[]
    OR?: NseIntrumentWhereInput[]
    NOT?: NseIntrumentWhereInput | NseIntrumentWhereInput[]
    name?: StringFilter<"NseIntrument"> | string
    createdAt?: DateTimeFilter<"NseIntrument"> | Date | string
    updatedAt?: DateTimeFilter<"NseIntrument"> | Date | string
    candles?: NseCandleListRelationFilter
  }, "id" | "symbol">

  export type NseIntrumentOrderByWithAggregationInput = {
    id?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NseIntrumentCountOrderByAggregateInput
    _max?: NseIntrumentMaxOrderByAggregateInput
    _min?: NseIntrumentMinOrderByAggregateInput
  }

  export type NseIntrumentScalarWhereWithAggregatesInput = {
    AND?: NseIntrumentScalarWhereWithAggregatesInput | NseIntrumentScalarWhereWithAggregatesInput[]
    OR?: NseIntrumentScalarWhereWithAggregatesInput[]
    NOT?: NseIntrumentScalarWhereWithAggregatesInput | NseIntrumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NseIntrument"> | string
    symbol?: StringWithAggregatesFilter<"NseIntrument"> | string
    name?: StringWithAggregatesFilter<"NseIntrument"> | string
    createdAt?: DateTimeWithAggregatesFilter<"NseIntrument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NseIntrument"> | Date | string
  }

  export type NseCandleWhereInput = {
    AND?: NseCandleWhereInput | NseCandleWhereInput[]
    OR?: NseCandleWhereInput[]
    NOT?: NseCandleWhereInput | NseCandleWhereInput[]
    id?: StringFilter<"NseCandle"> | string
    timestamp?: DateTimeFilter<"NseCandle"> | Date | string
    open?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    volume?: BigIntFilter<"NseCandle"> | bigint | number
    instrumentId?: StringFilter<"NseCandle"> | string
    createdAt?: DateTimeFilter<"NseCandle"> | Date | string
    updatedAt?: DateTimeFilter<"NseCandle"> | Date | string
    instrument?: XOR<NseIntrumentScalarRelationFilter, NseIntrumentWhereInput>
  }

  export type NseCandleOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    instrumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    instrument?: NseIntrumentOrderByWithRelationInput
  }

  export type NseCandleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NseCandleWhereInput | NseCandleWhereInput[]
    OR?: NseCandleWhereInput[]
    NOT?: NseCandleWhereInput | NseCandleWhereInput[]
    timestamp?: DateTimeFilter<"NseCandle"> | Date | string
    open?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    volume?: BigIntFilter<"NseCandle"> | bigint | number
    instrumentId?: StringFilter<"NseCandle"> | string
    createdAt?: DateTimeFilter<"NseCandle"> | Date | string
    updatedAt?: DateTimeFilter<"NseCandle"> | Date | string
    instrument?: XOR<NseIntrumentScalarRelationFilter, NseIntrumentWhereInput>
  }, "id">

  export type NseCandleOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    instrumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NseCandleCountOrderByAggregateInput
    _avg?: NseCandleAvgOrderByAggregateInput
    _max?: NseCandleMaxOrderByAggregateInput
    _min?: NseCandleMinOrderByAggregateInput
    _sum?: NseCandleSumOrderByAggregateInput
  }

  export type NseCandleScalarWhereWithAggregatesInput = {
    AND?: NseCandleScalarWhereWithAggregatesInput | NseCandleScalarWhereWithAggregatesInput[]
    OR?: NseCandleScalarWhereWithAggregatesInput[]
    NOT?: NseCandleScalarWhereWithAggregatesInput | NseCandleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NseCandle"> | string
    timestamp?: DateTimeWithAggregatesFilter<"NseCandle"> | Date | string
    open?: DecimalWithAggregatesFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalWithAggregatesFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalWithAggregatesFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalWithAggregatesFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    volume?: BigIntWithAggregatesFilter<"NseCandle"> | bigint | number
    instrumentId?: StringWithAggregatesFilter<"NseCandle"> | string
    createdAt?: DateTimeWithAggregatesFilter<"NseCandle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NseCandle"> | Date | string
  }

  export type NseHolidayWhereInput = {
    AND?: NseHolidayWhereInput | NseHolidayWhereInput[]
    OR?: NseHolidayWhereInput[]
    NOT?: NseHolidayWhereInput | NseHolidayWhereInput[]
    id?: StringFilter<"NseHoliday"> | string
    date?: DateTimeFilter<"NseHoliday"> | Date | string
    createdAt?: DateTimeFilter<"NseHoliday"> | Date | string
    updatedAt?: DateTimeFilter<"NseHoliday"> | Date | string
  }

  export type NseHolidayOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseHolidayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: NseHolidayWhereInput | NseHolidayWhereInput[]
    OR?: NseHolidayWhereInput[]
    NOT?: NseHolidayWhereInput | NseHolidayWhereInput[]
    createdAt?: DateTimeFilter<"NseHoliday"> | Date | string
    updatedAt?: DateTimeFilter<"NseHoliday"> | Date | string
  }, "id" | "date">

  export type NseHolidayOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NseHolidayCountOrderByAggregateInput
    _max?: NseHolidayMaxOrderByAggregateInput
    _min?: NseHolidayMinOrderByAggregateInput
  }

  export type NseHolidayScalarWhereWithAggregatesInput = {
    AND?: NseHolidayScalarWhereWithAggregatesInput | NseHolidayScalarWhereWithAggregatesInput[]
    OR?: NseHolidayScalarWhereWithAggregatesInput[]
    NOT?: NseHolidayScalarWhereWithAggregatesInput | NseHolidayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NseHoliday"> | string
    date?: DateTimeWithAggregatesFilter<"NseHoliday"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"NseHoliday"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NseHoliday"> | Date | string
  }

  export type ShortlistSnapshotWhereInput = {
    AND?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    OR?: ShortlistSnapshotWhereInput[]
    NOT?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    id?: StringFilter<"ShortlistSnapshot"> | string
    timestamp?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    shortlistType?: EnumShortlistTypeFilter<"ShortlistSnapshot"> | $Enums.ShortlistType
    entries?: JsonFilter<"ShortlistSnapshot">
    scope?: EnumShortlistScopeFilter<"ShortlistSnapshot"> | $Enums.ShortlistScope
    createdAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
  }

  export type ShortlistSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
    scope?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShortlistSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    OR?: ShortlistSnapshotWhereInput[]
    NOT?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    timestamp?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    shortlistType?: EnumShortlistTypeFilter<"ShortlistSnapshot"> | $Enums.ShortlistType
    entries?: JsonFilter<"ShortlistSnapshot">
    scope?: EnumShortlistScopeFilter<"ShortlistSnapshot"> | $Enums.ShortlistScope
    createdAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
  }, "id">

  export type ShortlistSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
    scope?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShortlistSnapshotCountOrderByAggregateInput
    _max?: ShortlistSnapshotMaxOrderByAggregateInput
    _min?: ShortlistSnapshotMinOrderByAggregateInput
  }

  export type ShortlistSnapshotScalarWhereWithAggregatesInput = {
    AND?: ShortlistSnapshotScalarWhereWithAggregatesInput | ShortlistSnapshotScalarWhereWithAggregatesInput[]
    OR?: ShortlistSnapshotScalarWhereWithAggregatesInput[]
    NOT?: ShortlistSnapshotScalarWhereWithAggregatesInput | ShortlistSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShortlistSnapshot"> | string
    timestamp?: DateTimeWithAggregatesFilter<"ShortlistSnapshot"> | Date | string
    shortlistType?: EnumShortlistTypeWithAggregatesFilter<"ShortlistSnapshot"> | $Enums.ShortlistType
    entries?: JsonWithAggregatesFilter<"ShortlistSnapshot">
    scope?: EnumShortlistScopeWithAggregatesFilter<"ShortlistSnapshot"> | $Enums.ShortlistScope
    createdAt?: DateTimeWithAggregatesFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ShortlistSnapshot"> | Date | string
  }

  export type CollectorErrorWhereInput = {
    AND?: CollectorErrorWhereInput | CollectorErrorWhereInput[]
    OR?: CollectorErrorWhereInput[]
    NOT?: CollectorErrorWhereInput | CollectorErrorWhereInput[]
    id?: StringFilter<"CollectorError"> | string
    timestamp?: DateTimeFilter<"CollectorError"> | Date | string
    errorMessage?: StringFilter<"CollectorError"> | string
    errorStack?: StringNullableFilter<"CollectorError"> | string | null
    errorContext?: JsonNullableFilter<"CollectorError">
    createdAt?: DateTimeFilter<"CollectorError"> | Date | string
    updatedAt?: DateTimeFilter<"CollectorError"> | Date | string
  }

  export type CollectorErrorOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    errorMessage?: SortOrder
    errorStack?: SortOrderInput | SortOrder
    errorContext?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectorErrorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CollectorErrorWhereInput | CollectorErrorWhereInput[]
    OR?: CollectorErrorWhereInput[]
    NOT?: CollectorErrorWhereInput | CollectorErrorWhereInput[]
    timestamp?: DateTimeFilter<"CollectorError"> | Date | string
    errorMessage?: StringFilter<"CollectorError"> | string
    errorStack?: StringNullableFilter<"CollectorError"> | string | null
    errorContext?: JsonNullableFilter<"CollectorError">
    createdAt?: DateTimeFilter<"CollectorError"> | Date | string
    updatedAt?: DateTimeFilter<"CollectorError"> | Date | string
  }, "id">

  export type CollectorErrorOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    errorMessage?: SortOrder
    errorStack?: SortOrderInput | SortOrder
    errorContext?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CollectorErrorCountOrderByAggregateInput
    _max?: CollectorErrorMaxOrderByAggregateInput
    _min?: CollectorErrorMinOrderByAggregateInput
  }

  export type CollectorErrorScalarWhereWithAggregatesInput = {
    AND?: CollectorErrorScalarWhereWithAggregatesInput | CollectorErrorScalarWhereWithAggregatesInput[]
    OR?: CollectorErrorScalarWhereWithAggregatesInput[]
    NOT?: CollectorErrorScalarWhereWithAggregatesInput | CollectorErrorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CollectorError"> | string
    timestamp?: DateTimeWithAggregatesFilter<"CollectorError"> | Date | string
    errorMessage?: StringWithAggregatesFilter<"CollectorError"> | string
    errorStack?: StringNullableWithAggregatesFilter<"CollectorError"> | string | null
    errorContext?: JsonNullableWithAggregatesFilter<"CollectorError">
    createdAt?: DateTimeWithAggregatesFilter<"CollectorError"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CollectorError"> | Date | string
  }

  export type DeveloperCreateInput = {
    id?: string
    username: string
    token: string
    growwApiKey?: string | null
    growwApiSecret?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: RunCreateNestedManyWithoutDeveloperInput
  }

  export type DeveloperUncheckedCreateInput = {
    id?: string
    username: string
    token: string
    growwApiKey?: string | null
    growwApiSecret?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: RunUncheckedCreateNestedManyWithoutDeveloperInput
  }

  export type DeveloperUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: RunUpdateManyWithoutDeveloperNestedInput
  }

  export type DeveloperUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: RunUncheckedUpdateManyWithoutDeveloperNestedInput
  }

  export type DeveloperCreateManyInput = {
    id?: string
    username: string
    token: string
    growwApiKey?: string | null
    growwApiSecret?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeveloperUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderCreateNestedManyWithoutRunInput
    developer?: DeveloperCreateNestedOneWithoutRunsInput
  }

  export type RunUncheckedCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    developerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutRunInput
  }

  export type RunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutRunNestedInput
    developer?: DeveloperUpdateOneWithoutRunsNestedInput
  }

  export type RunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    developerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutRunNestedInput
  }

  export type RunCreateManyInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    developerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    developerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    run: RunCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    runId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: RunUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    runId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    runId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    runId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseIntrumentCreateInput = {
    id?: string
    symbol: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    candles?: NseCandleCreateNestedManyWithoutInstrumentInput
  }

  export type NseIntrumentUncheckedCreateInput = {
    id?: string
    symbol: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    candles?: NseCandleUncheckedCreateNestedManyWithoutInstrumentInput
  }

  export type NseIntrumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candles?: NseCandleUpdateManyWithoutInstrumentNestedInput
  }

  export type NseIntrumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candles?: NseCandleUncheckedUpdateManyWithoutInstrumentNestedInput
  }

  export type NseIntrumentCreateManyInput = {
    id?: string
    symbol: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseIntrumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseIntrumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleCreateInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    instrument: NseIntrumentCreateNestedOneWithoutCandlesInput
  }

  export type NseCandleUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    instrumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseCandleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    instrument?: NseIntrumentUpdateOneRequiredWithoutCandlesNestedInput
  }

  export type NseCandleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    instrumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleCreateManyInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    instrumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseCandleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    instrumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseHolidayCreateInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseHolidayUncheckedCreateInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseHolidayUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseHolidayUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseHolidayCreateManyInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseHolidayUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseHolidayUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotCreateInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    scope?: $Enums.ShortlistScope
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    scope?: $Enums.ShortlistScope
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    scope?: EnumShortlistScopeFieldUpdateOperationsInput | $Enums.ShortlistScope
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    scope?: EnumShortlistScopeFieldUpdateOperationsInput | $Enums.ShortlistScope
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotCreateManyInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    scope?: $Enums.ShortlistScope
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    scope?: EnumShortlistScopeFieldUpdateOperationsInput | $Enums.ShortlistScope
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    scope?: EnumShortlistScopeFieldUpdateOperationsInput | $Enums.ShortlistScope
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectorErrorCreateInput = {
    id?: string
    timestamp: Date | string
    errorMessage: string
    errorStack?: string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectorErrorUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    errorMessage: string
    errorStack?: string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectorErrorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    errorStack?: NullableStringFieldUpdateOperationsInput | string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectorErrorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    errorStack?: NullableStringFieldUpdateOperationsInput | string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectorErrorCreateManyInput = {
    id?: string
    timestamp: Date | string
    errorMessage: string
    errorStack?: string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectorErrorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    errorStack?: NullableStringFieldUpdateOperationsInput | string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectorErrorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    errorMessage?: StringFieldUpdateOperationsInput | string
    errorStack?: NullableStringFieldUpdateOperationsInput | string | null
    errorContext?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RunListRelationFilter = {
    every?: RunWhereInput
    some?: RunWhereInput
    none?: RunWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeveloperCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    token?: SortOrder
    growwApiKey?: SortOrder
    growwApiSecret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeveloperMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    token?: SortOrder
    growwApiKey?: SortOrder
    growwApiSecret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeveloperMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    token?: SortOrder
    growwApiKey?: SortOrder
    growwApiSecret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type DeveloperNullableScalarRelationFilter = {
    is?: DeveloperWhereInput | null
    isNot?: DeveloperWhereInput | null
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RunCountOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    completed?: SortOrder
    name?: SortOrder
    tags?: SortOrder
    developerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunMaxOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    completed?: SortOrder
    name?: SortOrder
    developerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunMinOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    completed?: SortOrder
    name?: SortOrder
    developerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type RunScalarRelationFilter = {
    is?: RunWhereInput
    isNot?: RunWhereInput
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    nseSymbol?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
    timestamp?: SortOrder
    runId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    nseSymbol?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
    timestamp?: SortOrder
    runId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    nseSymbol?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
    timestamp?: SortOrder
    runId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    entryPrice?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NseCandleListRelationFilter = {
    every?: NseCandleWhereInput
    some?: NseCandleWhereInput
    none?: NseCandleWhereInput
  }

  export type NseCandleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NseIntrumentCountOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseIntrumentMaxOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseIntrumentMinOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NseIntrumentScalarRelationFilter = {
    is?: NseIntrumentWhereInput
    isNot?: NseIntrumentWhereInput
  }

  export type NseCandleCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    instrumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseCandleAvgOrderByAggregateInput = {
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type NseCandleMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    instrumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseCandleMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    instrumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseCandleSumOrderByAggregateInput = {
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NseHolidayCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseHolidayMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NseHolidayMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumShortlistTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeFilter<$PrismaModel> | $Enums.ShortlistType
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumShortlistScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistScope | EnumShortlistScopeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistScopeFilter<$PrismaModel> | $Enums.ShortlistScope
  }

  export type ShortlistSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
    scope?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShortlistSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    scope?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShortlistSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    scope?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumShortlistTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeWithAggregatesFilter<$PrismaModel> | $Enums.ShortlistType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShortlistTypeFilter<$PrismaModel>
    _max?: NestedEnumShortlistTypeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumShortlistScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistScope | EnumShortlistScopeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistScopeWithAggregatesFilter<$PrismaModel> | $Enums.ShortlistScope
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShortlistScopeFilter<$PrismaModel>
    _max?: NestedEnumShortlistScopeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CollectorErrorCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    errorMessage?: SortOrder
    errorStack?: SortOrder
    errorContext?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectorErrorMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    errorMessage?: SortOrder
    errorStack?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectorErrorMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    errorMessage?: SortOrder
    errorStack?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type RunCreateNestedManyWithoutDeveloperInput = {
    create?: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput> | RunCreateWithoutDeveloperInput[] | RunUncheckedCreateWithoutDeveloperInput[]
    connectOrCreate?: RunCreateOrConnectWithoutDeveloperInput | RunCreateOrConnectWithoutDeveloperInput[]
    createMany?: RunCreateManyDeveloperInputEnvelope
    connect?: RunWhereUniqueInput | RunWhereUniqueInput[]
  }

  export type RunUncheckedCreateNestedManyWithoutDeveloperInput = {
    create?: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput> | RunCreateWithoutDeveloperInput[] | RunUncheckedCreateWithoutDeveloperInput[]
    connectOrCreate?: RunCreateOrConnectWithoutDeveloperInput | RunCreateOrConnectWithoutDeveloperInput[]
    createMany?: RunCreateManyDeveloperInputEnvelope
    connect?: RunWhereUniqueInput | RunWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RunUpdateManyWithoutDeveloperNestedInput = {
    create?: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput> | RunCreateWithoutDeveloperInput[] | RunUncheckedCreateWithoutDeveloperInput[]
    connectOrCreate?: RunCreateOrConnectWithoutDeveloperInput | RunCreateOrConnectWithoutDeveloperInput[]
    upsert?: RunUpsertWithWhereUniqueWithoutDeveloperInput | RunUpsertWithWhereUniqueWithoutDeveloperInput[]
    createMany?: RunCreateManyDeveloperInputEnvelope
    set?: RunWhereUniqueInput | RunWhereUniqueInput[]
    disconnect?: RunWhereUniqueInput | RunWhereUniqueInput[]
    delete?: RunWhereUniqueInput | RunWhereUniqueInput[]
    connect?: RunWhereUniqueInput | RunWhereUniqueInput[]
    update?: RunUpdateWithWhereUniqueWithoutDeveloperInput | RunUpdateWithWhereUniqueWithoutDeveloperInput[]
    updateMany?: RunUpdateManyWithWhereWithoutDeveloperInput | RunUpdateManyWithWhereWithoutDeveloperInput[]
    deleteMany?: RunScalarWhereInput | RunScalarWhereInput[]
  }

  export type RunUncheckedUpdateManyWithoutDeveloperNestedInput = {
    create?: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput> | RunCreateWithoutDeveloperInput[] | RunUncheckedCreateWithoutDeveloperInput[]
    connectOrCreate?: RunCreateOrConnectWithoutDeveloperInput | RunCreateOrConnectWithoutDeveloperInput[]
    upsert?: RunUpsertWithWhereUniqueWithoutDeveloperInput | RunUpsertWithWhereUniqueWithoutDeveloperInput[]
    createMany?: RunCreateManyDeveloperInputEnvelope
    set?: RunWhereUniqueInput | RunWhereUniqueInput[]
    disconnect?: RunWhereUniqueInput | RunWhereUniqueInput[]
    delete?: RunWhereUniqueInput | RunWhereUniqueInput[]
    connect?: RunWhereUniqueInput | RunWhereUniqueInput[]
    update?: RunUpdateWithWhereUniqueWithoutDeveloperInput | RunUpdateWithWhereUniqueWithoutDeveloperInput[]
    updateMany?: RunUpdateManyWithWhereWithoutDeveloperInput | RunUpdateManyWithWhereWithoutDeveloperInput[]
    deleteMany?: RunScalarWhereInput | RunScalarWhereInput[]
  }

  export type RunCreatetagsInput = {
    set: string[]
  }

  export type OrderCreateNestedManyWithoutRunInput = {
    create?: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput> | OrderCreateWithoutRunInput[] | OrderUncheckedCreateWithoutRunInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutRunInput | OrderCreateOrConnectWithoutRunInput[]
    createMany?: OrderCreateManyRunInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type DeveloperCreateNestedOneWithoutRunsInput = {
    create?: XOR<DeveloperCreateWithoutRunsInput, DeveloperUncheckedCreateWithoutRunsInput>
    connectOrCreate?: DeveloperCreateOrConnectWithoutRunsInput
    connect?: DeveloperWhereUniqueInput
  }

  export type OrderUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput> | OrderCreateWithoutRunInput[] | OrderUncheckedCreateWithoutRunInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutRunInput | OrderCreateOrConnectWithoutRunInput[]
    createMany?: OrderCreateManyRunInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RunUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type OrderUpdateManyWithoutRunNestedInput = {
    create?: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput> | OrderCreateWithoutRunInput[] | OrderUncheckedCreateWithoutRunInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutRunInput | OrderCreateOrConnectWithoutRunInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutRunInput | OrderUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: OrderCreateManyRunInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutRunInput | OrderUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutRunInput | OrderUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type DeveloperUpdateOneWithoutRunsNestedInput = {
    create?: XOR<DeveloperCreateWithoutRunsInput, DeveloperUncheckedCreateWithoutRunsInput>
    connectOrCreate?: DeveloperCreateOrConnectWithoutRunsInput
    upsert?: DeveloperUpsertWithoutRunsInput
    disconnect?: DeveloperWhereInput | boolean
    delete?: DeveloperWhereInput | boolean
    connect?: DeveloperWhereUniqueInput
    update?: XOR<XOR<DeveloperUpdateToOneWithWhereWithoutRunsInput, DeveloperUpdateWithoutRunsInput>, DeveloperUncheckedUpdateWithoutRunsInput>
  }

  export type OrderUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput> | OrderCreateWithoutRunInput[] | OrderUncheckedCreateWithoutRunInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutRunInput | OrderCreateOrConnectWithoutRunInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutRunInput | OrderUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: OrderCreateManyRunInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutRunInput | OrderUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutRunInput | OrderUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type RunCreateNestedOneWithoutOrdersInput = {
    create?: XOR<RunCreateWithoutOrdersInput, RunUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: RunCreateOrConnectWithoutOrdersInput
    connect?: RunWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type RunUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<RunCreateWithoutOrdersInput, RunUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: RunCreateOrConnectWithoutOrdersInput
    upsert?: RunUpsertWithoutOrdersInput
    connect?: RunWhereUniqueInput
    update?: XOR<XOR<RunUpdateToOneWithWhereWithoutOrdersInput, RunUpdateWithoutOrdersInput>, RunUncheckedUpdateWithoutOrdersInput>
  }

  export type NseCandleCreateNestedManyWithoutInstrumentInput = {
    create?: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput> | NseCandleCreateWithoutInstrumentInput[] | NseCandleUncheckedCreateWithoutInstrumentInput[]
    connectOrCreate?: NseCandleCreateOrConnectWithoutInstrumentInput | NseCandleCreateOrConnectWithoutInstrumentInput[]
    createMany?: NseCandleCreateManyInstrumentInputEnvelope
    connect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
  }

  export type NseCandleUncheckedCreateNestedManyWithoutInstrumentInput = {
    create?: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput> | NseCandleCreateWithoutInstrumentInput[] | NseCandleUncheckedCreateWithoutInstrumentInput[]
    connectOrCreate?: NseCandleCreateOrConnectWithoutInstrumentInput | NseCandleCreateOrConnectWithoutInstrumentInput[]
    createMany?: NseCandleCreateManyInstrumentInputEnvelope
    connect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
  }

  export type NseCandleUpdateManyWithoutInstrumentNestedInput = {
    create?: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput> | NseCandleCreateWithoutInstrumentInput[] | NseCandleUncheckedCreateWithoutInstrumentInput[]
    connectOrCreate?: NseCandleCreateOrConnectWithoutInstrumentInput | NseCandleCreateOrConnectWithoutInstrumentInput[]
    upsert?: NseCandleUpsertWithWhereUniqueWithoutInstrumentInput | NseCandleUpsertWithWhereUniqueWithoutInstrumentInput[]
    createMany?: NseCandleCreateManyInstrumentInputEnvelope
    set?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    disconnect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    delete?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    connect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    update?: NseCandleUpdateWithWhereUniqueWithoutInstrumentInput | NseCandleUpdateWithWhereUniqueWithoutInstrumentInput[]
    updateMany?: NseCandleUpdateManyWithWhereWithoutInstrumentInput | NseCandleUpdateManyWithWhereWithoutInstrumentInput[]
    deleteMany?: NseCandleScalarWhereInput | NseCandleScalarWhereInput[]
  }

  export type NseCandleUncheckedUpdateManyWithoutInstrumentNestedInput = {
    create?: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput> | NseCandleCreateWithoutInstrumentInput[] | NseCandleUncheckedCreateWithoutInstrumentInput[]
    connectOrCreate?: NseCandleCreateOrConnectWithoutInstrumentInput | NseCandleCreateOrConnectWithoutInstrumentInput[]
    upsert?: NseCandleUpsertWithWhereUniqueWithoutInstrumentInput | NseCandleUpsertWithWhereUniqueWithoutInstrumentInput[]
    createMany?: NseCandleCreateManyInstrumentInputEnvelope
    set?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    disconnect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    delete?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    connect?: NseCandleWhereUniqueInput | NseCandleWhereUniqueInput[]
    update?: NseCandleUpdateWithWhereUniqueWithoutInstrumentInput | NseCandleUpdateWithWhereUniqueWithoutInstrumentInput[]
    updateMany?: NseCandleUpdateManyWithWhereWithoutInstrumentInput | NseCandleUpdateManyWithWhereWithoutInstrumentInput[]
    deleteMany?: NseCandleScalarWhereInput | NseCandleScalarWhereInput[]
  }

  export type NseIntrumentCreateNestedOneWithoutCandlesInput = {
    create?: XOR<NseIntrumentCreateWithoutCandlesInput, NseIntrumentUncheckedCreateWithoutCandlesInput>
    connectOrCreate?: NseIntrumentCreateOrConnectWithoutCandlesInput
    connect?: NseIntrumentWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NseIntrumentUpdateOneRequiredWithoutCandlesNestedInput = {
    create?: XOR<NseIntrumentCreateWithoutCandlesInput, NseIntrumentUncheckedCreateWithoutCandlesInput>
    connectOrCreate?: NseIntrumentCreateOrConnectWithoutCandlesInput
    upsert?: NseIntrumentUpsertWithoutCandlesInput
    connect?: NseIntrumentWhereUniqueInput
    update?: XOR<XOR<NseIntrumentUpdateToOneWithWhereWithoutCandlesInput, NseIntrumentUpdateWithoutCandlesInput>, NseIntrumentUncheckedUpdateWithoutCandlesInput>
  }

  export type EnumShortlistTypeFieldUpdateOperationsInput = {
    set?: $Enums.ShortlistType
  }

  export type EnumShortlistScopeFieldUpdateOperationsInput = {
    set?: $Enums.ShortlistScope
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumShortlistTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeFilter<$PrismaModel> | $Enums.ShortlistType
  }

  export type NestedEnumShortlistScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistScope | EnumShortlistScopeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistScopeFilter<$PrismaModel> | $Enums.ShortlistScope
  }

  export type NestedEnumShortlistTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeWithAggregatesFilter<$PrismaModel> | $Enums.ShortlistType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShortlistTypeFilter<$PrismaModel>
    _max?: NestedEnumShortlistTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumShortlistScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistScope | EnumShortlistScopeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistScope[] | ListEnumShortlistScopeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistScopeWithAggregatesFilter<$PrismaModel> | $Enums.ShortlistScope
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShortlistScopeFilter<$PrismaModel>
    _max?: NestedEnumShortlistScopeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RunCreateWithoutDeveloperInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderCreateNestedManyWithoutRunInput
  }

  export type RunUncheckedCreateWithoutDeveloperInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutRunInput
  }

  export type RunCreateOrConnectWithoutDeveloperInput = {
    where: RunWhereUniqueInput
    create: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput>
  }

  export type RunCreateManyDeveloperInputEnvelope = {
    data: RunCreateManyDeveloperInput | RunCreateManyDeveloperInput[]
    skipDuplicates?: boolean
  }

  export type RunUpsertWithWhereUniqueWithoutDeveloperInput = {
    where: RunWhereUniqueInput
    update: XOR<RunUpdateWithoutDeveloperInput, RunUncheckedUpdateWithoutDeveloperInput>
    create: XOR<RunCreateWithoutDeveloperInput, RunUncheckedCreateWithoutDeveloperInput>
  }

  export type RunUpdateWithWhereUniqueWithoutDeveloperInput = {
    where: RunWhereUniqueInput
    data: XOR<RunUpdateWithoutDeveloperInput, RunUncheckedUpdateWithoutDeveloperInput>
  }

  export type RunUpdateManyWithWhereWithoutDeveloperInput = {
    where: RunScalarWhereInput
    data: XOR<RunUpdateManyMutationInput, RunUncheckedUpdateManyWithoutDeveloperInput>
  }

  export type RunScalarWhereInput = {
    AND?: RunScalarWhereInput | RunScalarWhereInput[]
    OR?: RunScalarWhereInput[]
    NOT?: RunScalarWhereInput | RunScalarWhereInput[]
    id?: StringFilter<"Run"> | string
    startTime?: DateTimeFilter<"Run"> | Date | string
    endTime?: DateTimeFilter<"Run"> | Date | string
    completed?: BoolFilter<"Run"> | boolean
    name?: StringNullableFilter<"Run"> | string | null
    tags?: StringNullableListFilter<"Run">
    developerId?: StringNullableFilter<"Run"> | string | null
    createdAt?: DateTimeFilter<"Run"> | Date | string
    updatedAt?: DateTimeFilter<"Run"> | Date | string
  }

  export type OrderCreateWithoutRunInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUncheckedCreateWithoutRunInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCreateOrConnectWithoutRunInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput>
  }

  export type OrderCreateManyRunInputEnvelope = {
    data: OrderCreateManyRunInput | OrderCreateManyRunInput[]
    skipDuplicates?: boolean
  }

  export type DeveloperCreateWithoutRunsInput = {
    id?: string
    username: string
    token: string
    growwApiKey?: string | null
    growwApiSecret?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperUncheckedCreateWithoutRunsInput = {
    id?: string
    username: string
    token: string
    growwApiKey?: string | null
    growwApiSecret?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperCreateOrConnectWithoutRunsInput = {
    where: DeveloperWhereUniqueInput
    create: XOR<DeveloperCreateWithoutRunsInput, DeveloperUncheckedCreateWithoutRunsInput>
  }

  export type OrderUpsertWithWhereUniqueWithoutRunInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutRunInput, OrderUncheckedUpdateWithoutRunInput>
    create: XOR<OrderCreateWithoutRunInput, OrderUncheckedCreateWithoutRunInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutRunInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutRunInput, OrderUncheckedUpdateWithoutRunInput>
  }

  export type OrderUpdateManyWithWhereWithoutRunInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutRunInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    nseSymbol?: StringFilter<"Order"> | string
    stopLossPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"Order"> | Date | string
    runId?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type DeveloperUpsertWithoutRunsInput = {
    update: XOR<DeveloperUpdateWithoutRunsInput, DeveloperUncheckedUpdateWithoutRunsInput>
    create: XOR<DeveloperCreateWithoutRunsInput, DeveloperUncheckedCreateWithoutRunsInput>
    where?: DeveloperWhereInput
  }

  export type DeveloperUpdateToOneWithWhereWithoutRunsInput = {
    where?: DeveloperWhereInput
    data: XOR<DeveloperUpdateWithoutRunsInput, DeveloperUncheckedUpdateWithoutRunsInput>
  }

  export type DeveloperUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeveloperUncheckedUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    growwApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    growwApiSecret?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunCreateWithoutOrdersInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    developer?: DeveloperCreateNestedOneWithoutRunsInput
  }

  export type RunUncheckedCreateWithoutOrdersInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    developerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RunCreateOrConnectWithoutOrdersInput = {
    where: RunWhereUniqueInput
    create: XOR<RunCreateWithoutOrdersInput, RunUncheckedCreateWithoutOrdersInput>
  }

  export type RunUpsertWithoutOrdersInput = {
    update: XOR<RunUpdateWithoutOrdersInput, RunUncheckedUpdateWithoutOrdersInput>
    create: XOR<RunCreateWithoutOrdersInput, RunUncheckedCreateWithoutOrdersInput>
    where?: RunWhereInput
  }

  export type RunUpdateToOneWithWhereWithoutOrdersInput = {
    where?: RunWhereInput
    data: XOR<RunUpdateWithoutOrdersInput, RunUncheckedUpdateWithoutOrdersInput>
  }

  export type RunUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    developer?: DeveloperUpdateOneWithoutRunsNestedInput
  }

  export type RunUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    developerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleCreateWithoutInstrumentInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseCandleUncheckedCreateWithoutInstrumentInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseCandleCreateOrConnectWithoutInstrumentInput = {
    where: NseCandleWhereUniqueInput
    create: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput>
  }

  export type NseCandleCreateManyInstrumentInputEnvelope = {
    data: NseCandleCreateManyInstrumentInput | NseCandleCreateManyInstrumentInput[]
    skipDuplicates?: boolean
  }

  export type NseCandleUpsertWithWhereUniqueWithoutInstrumentInput = {
    where: NseCandleWhereUniqueInput
    update: XOR<NseCandleUpdateWithoutInstrumentInput, NseCandleUncheckedUpdateWithoutInstrumentInput>
    create: XOR<NseCandleCreateWithoutInstrumentInput, NseCandleUncheckedCreateWithoutInstrumentInput>
  }

  export type NseCandleUpdateWithWhereUniqueWithoutInstrumentInput = {
    where: NseCandleWhereUniqueInput
    data: XOR<NseCandleUpdateWithoutInstrumentInput, NseCandleUncheckedUpdateWithoutInstrumentInput>
  }

  export type NseCandleUpdateManyWithWhereWithoutInstrumentInput = {
    where: NseCandleScalarWhereInput
    data: XOR<NseCandleUpdateManyMutationInput, NseCandleUncheckedUpdateManyWithoutInstrumentInput>
  }

  export type NseCandleScalarWhereInput = {
    AND?: NseCandleScalarWhereInput | NseCandleScalarWhereInput[]
    OR?: NseCandleScalarWhereInput[]
    NOT?: NseCandleScalarWhereInput | NseCandleScalarWhereInput[]
    id?: StringFilter<"NseCandle"> | string
    timestamp?: DateTimeFilter<"NseCandle"> | Date | string
    open?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"NseCandle"> | Decimal | DecimalJsLike | number | string
    volume?: BigIntFilter<"NseCandle"> | bigint | number
    instrumentId?: StringFilter<"NseCandle"> | string
    createdAt?: DateTimeFilter<"NseCandle"> | Date | string
    updatedAt?: DateTimeFilter<"NseCandle"> | Date | string
  }

  export type NseIntrumentCreateWithoutCandlesInput = {
    id?: string
    symbol: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseIntrumentUncheckedCreateWithoutCandlesInput = {
    id?: string
    symbol: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseIntrumentCreateOrConnectWithoutCandlesInput = {
    where: NseIntrumentWhereUniqueInput
    create: XOR<NseIntrumentCreateWithoutCandlesInput, NseIntrumentUncheckedCreateWithoutCandlesInput>
  }

  export type NseIntrumentUpsertWithoutCandlesInput = {
    update: XOR<NseIntrumentUpdateWithoutCandlesInput, NseIntrumentUncheckedUpdateWithoutCandlesInput>
    create: XOR<NseIntrumentCreateWithoutCandlesInput, NseIntrumentUncheckedCreateWithoutCandlesInput>
    where?: NseIntrumentWhereInput
  }

  export type NseIntrumentUpdateToOneWithWhereWithoutCandlesInput = {
    where?: NseIntrumentWhereInput
    data: XOR<NseIntrumentUpdateWithoutCandlesInput, NseIntrumentUncheckedUpdateWithoutCandlesInput>
  }

  export type NseIntrumentUpdateWithoutCandlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseIntrumentUncheckedUpdateWithoutCandlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunCreateManyDeveloperInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    completed?: boolean
    name?: string | null
    tags?: RunCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RunUpdateWithoutDeveloperInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutRunNestedInput
  }

  export type RunUncheckedUpdateWithoutDeveloperInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutRunNestedInput
  }

  export type RunUncheckedUpdateManyWithoutDeveloperInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: RunUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyRunInput = {
    id?: string
    nseSymbol: string
    stopLossPrice: Decimal | DecimalJsLike | number | string
    takeProfitPrice: Decimal | DecimalJsLike | number | string
    entryPrice: Decimal | DecimalJsLike | number | string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    stopLossPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleCreateManyInstrumentInput = {
    id?: string
    timestamp: Date | string
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NseCandleUpdateWithoutInstrumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleUncheckedUpdateWithoutInstrumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NseCandleUncheckedUpdateManyWithoutInstrumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}