
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
 * Model QuoteSnapshot
 * 
 */
export type QuoteSnapshot = $Result.DefaultSelection<Prisma.$QuoteSnapshotPayload>
/**
 * Model NiftyQuote
 * 
 */
export type NiftyQuote = $Result.DefaultSelection<Prisma.$NiftyQuotePayload>
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
 * Model NseHoliday
 * 
 */
export type NseHoliday = $Result.DefaultSelection<Prisma.$NseHolidayPayload>

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
   * `prisma.quoteSnapshot`: Exposes CRUD operations for the **QuoteSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuoteSnapshots
    * const quoteSnapshots = await prisma.quoteSnapshot.findMany()
    * ```
    */
  get quoteSnapshot(): Prisma.QuoteSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.niftyQuote`: Exposes CRUD operations for the **NiftyQuote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NiftyQuotes
    * const niftyQuotes = await prisma.niftyQuote.findMany()
    * ```
    */
  get niftyQuote(): Prisma.NiftyQuoteDelegate<ExtArgs, ClientOptions>;

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

  /**
   * `prisma.nseHoliday`: Exposes CRUD operations for the **NseHoliday** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NseHolidays
    * const nseHolidays = await prisma.nseHoliday.findMany()
    * ```
    */
  get nseHoliday(): Prisma.NseHolidayDelegate<ExtArgs, ClientOptions>;
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
    QuoteSnapshot: 'QuoteSnapshot',
    NiftyQuote: 'NiftyQuote',
    ShortlistSnapshot: 'ShortlistSnapshot',
    CollectorError: 'CollectorError',
    NseHoliday: 'NseHoliday'
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
      modelProps: "developer" | "run" | "order" | "quoteSnapshot" | "niftyQuote" | "shortlistSnapshot" | "collectorError" | "nseHoliday"
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
      QuoteSnapshot: {
        payload: Prisma.$QuoteSnapshotPayload<ExtArgs>
        fields: Prisma.QuoteSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuoteSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuoteSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          findFirst: {
            args: Prisma.QuoteSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuoteSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          findMany: {
            args: Prisma.QuoteSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>[]
          }
          create: {
            args: Prisma.QuoteSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          createMany: {
            args: Prisma.QuoteSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuoteSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>[]
          }
          delete: {
            args: Prisma.QuoteSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          update: {
            args: Prisma.QuoteSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.QuoteSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuoteSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuoteSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.QuoteSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuoteSnapshotPayload>
          }
          aggregate: {
            args: Prisma.QuoteSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuoteSnapshot>
          }
          groupBy: {
            args: Prisma.QuoteSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuoteSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuoteSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<QuoteSnapshotCountAggregateOutputType> | number
          }
        }
      }
      NiftyQuote: {
        payload: Prisma.$NiftyQuotePayload<ExtArgs>
        fields: Prisma.NiftyQuoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NiftyQuoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NiftyQuoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          findFirst: {
            args: Prisma.NiftyQuoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NiftyQuoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          findMany: {
            args: Prisma.NiftyQuoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>[]
          }
          create: {
            args: Prisma.NiftyQuoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          createMany: {
            args: Prisma.NiftyQuoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NiftyQuoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>[]
          }
          delete: {
            args: Prisma.NiftyQuoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          update: {
            args: Prisma.NiftyQuoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          deleteMany: {
            args: Prisma.NiftyQuoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NiftyQuoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NiftyQuoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>[]
          }
          upsert: {
            args: Prisma.NiftyQuoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NiftyQuotePayload>
          }
          aggregate: {
            args: Prisma.NiftyQuoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNiftyQuote>
          }
          groupBy: {
            args: Prisma.NiftyQuoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<NiftyQuoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.NiftyQuoteCountArgs<ExtArgs>
            result: $Utils.Optional<NiftyQuoteCountAggregateOutputType> | number
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
    quoteSnapshot?: QuoteSnapshotOmit
    niftyQuote?: NiftyQuoteOmit
    shortlistSnapshot?: ShortlistSnapshotOmit
    collectorError?: CollectorErrorOmit
    nseHoliday?: NseHolidayOmit
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
   * Model QuoteSnapshot
   */

  export type AggregateQuoteSnapshot = {
    _count: QuoteSnapshotCountAggregateOutputType | null
    _min: QuoteSnapshotMinAggregateOutputType | null
    _max: QuoteSnapshotMaxAggregateOutputType | null
  }

  export type QuoteSnapshotMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    nseSymbol: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuoteSnapshotMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    nseSymbol: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuoteSnapshotCountAggregateOutputType = {
    id: number
    timestamp: number
    nseSymbol: number
    quoteData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuoteSnapshotMinAggregateInputType = {
    id?: true
    timestamp?: true
    nseSymbol?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuoteSnapshotMaxAggregateInputType = {
    id?: true
    timestamp?: true
    nseSymbol?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuoteSnapshotCountAggregateInputType = {
    id?: true
    timestamp?: true
    nseSymbol?: true
    quoteData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuoteSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuoteSnapshot to aggregate.
     */
    where?: QuoteSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuoteSnapshots to fetch.
     */
    orderBy?: QuoteSnapshotOrderByWithRelationInput | QuoteSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuoteSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuoteSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuoteSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuoteSnapshots
    **/
    _count?: true | QuoteSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuoteSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuoteSnapshotMaxAggregateInputType
  }

  export type GetQuoteSnapshotAggregateType<T extends QuoteSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateQuoteSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuoteSnapshot[P]>
      : GetScalarType<T[P], AggregateQuoteSnapshot[P]>
  }




  export type QuoteSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuoteSnapshotWhereInput
    orderBy?: QuoteSnapshotOrderByWithAggregationInput | QuoteSnapshotOrderByWithAggregationInput[]
    by: QuoteSnapshotScalarFieldEnum[] | QuoteSnapshotScalarFieldEnum
    having?: QuoteSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuoteSnapshotCountAggregateInputType | true
    _min?: QuoteSnapshotMinAggregateInputType
    _max?: QuoteSnapshotMaxAggregateInputType
  }

  export type QuoteSnapshotGroupByOutputType = {
    id: string
    timestamp: Date
    nseSymbol: string
    quoteData: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: QuoteSnapshotCountAggregateOutputType | null
    _min: QuoteSnapshotMinAggregateOutputType | null
    _max: QuoteSnapshotMaxAggregateOutputType | null
  }

  type GetQuoteSnapshotGroupByPayload<T extends QuoteSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuoteSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuoteSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuoteSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], QuoteSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type QuoteSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    nseSymbol?: boolean
    quoteData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["quoteSnapshot"]>

  export type QuoteSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    nseSymbol?: boolean
    quoteData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["quoteSnapshot"]>

  export type QuoteSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    nseSymbol?: boolean
    quoteData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["quoteSnapshot"]>

  export type QuoteSnapshotSelectScalar = {
    id?: boolean
    timestamp?: boolean
    nseSymbol?: boolean
    quoteData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuoteSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "nseSymbol" | "quoteData" | "createdAt" | "updatedAt", ExtArgs["result"]["quoteSnapshot"]>

  export type $QuoteSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuoteSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      nseSymbol: string
      quoteData: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quoteSnapshot"]>
    composites: {}
  }

  type QuoteSnapshotGetPayload<S extends boolean | null | undefined | QuoteSnapshotDefaultArgs> = $Result.GetResult<Prisma.$QuoteSnapshotPayload, S>

  type QuoteSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuoteSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuoteSnapshotCountAggregateInputType | true
    }

  export interface QuoteSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuoteSnapshot'], meta: { name: 'QuoteSnapshot' } }
    /**
     * Find zero or one QuoteSnapshot that matches the filter.
     * @param {QuoteSnapshotFindUniqueArgs} args - Arguments to find a QuoteSnapshot
     * @example
     * // Get one QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuoteSnapshotFindUniqueArgs>(args: SelectSubset<T, QuoteSnapshotFindUniqueArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuoteSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuoteSnapshotFindUniqueOrThrowArgs} args - Arguments to find a QuoteSnapshot
     * @example
     * // Get one QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuoteSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, QuoteSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuoteSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotFindFirstArgs} args - Arguments to find a QuoteSnapshot
     * @example
     * // Get one QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuoteSnapshotFindFirstArgs>(args?: SelectSubset<T, QuoteSnapshotFindFirstArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuoteSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotFindFirstOrThrowArgs} args - Arguments to find a QuoteSnapshot
     * @example
     * // Get one QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuoteSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, QuoteSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuoteSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuoteSnapshots
     * const quoteSnapshots = await prisma.quoteSnapshot.findMany()
     * 
     * // Get first 10 QuoteSnapshots
     * const quoteSnapshots = await prisma.quoteSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quoteSnapshotWithIdOnly = await prisma.quoteSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuoteSnapshotFindManyArgs>(args?: SelectSubset<T, QuoteSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuoteSnapshot.
     * @param {QuoteSnapshotCreateArgs} args - Arguments to create a QuoteSnapshot.
     * @example
     * // Create one QuoteSnapshot
     * const QuoteSnapshot = await prisma.quoteSnapshot.create({
     *   data: {
     *     // ... data to create a QuoteSnapshot
     *   }
     * })
     * 
     */
    create<T extends QuoteSnapshotCreateArgs>(args: SelectSubset<T, QuoteSnapshotCreateArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuoteSnapshots.
     * @param {QuoteSnapshotCreateManyArgs} args - Arguments to create many QuoteSnapshots.
     * @example
     * // Create many QuoteSnapshots
     * const quoteSnapshot = await prisma.quoteSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuoteSnapshotCreateManyArgs>(args?: SelectSubset<T, QuoteSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuoteSnapshots and returns the data saved in the database.
     * @param {QuoteSnapshotCreateManyAndReturnArgs} args - Arguments to create many QuoteSnapshots.
     * @example
     * // Create many QuoteSnapshots
     * const quoteSnapshot = await prisma.quoteSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuoteSnapshots and only return the `id`
     * const quoteSnapshotWithIdOnly = await prisma.quoteSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuoteSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, QuoteSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuoteSnapshot.
     * @param {QuoteSnapshotDeleteArgs} args - Arguments to delete one QuoteSnapshot.
     * @example
     * // Delete one QuoteSnapshot
     * const QuoteSnapshot = await prisma.quoteSnapshot.delete({
     *   where: {
     *     // ... filter to delete one QuoteSnapshot
     *   }
     * })
     * 
     */
    delete<T extends QuoteSnapshotDeleteArgs>(args: SelectSubset<T, QuoteSnapshotDeleteArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuoteSnapshot.
     * @param {QuoteSnapshotUpdateArgs} args - Arguments to update one QuoteSnapshot.
     * @example
     * // Update one QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuoteSnapshotUpdateArgs>(args: SelectSubset<T, QuoteSnapshotUpdateArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuoteSnapshots.
     * @param {QuoteSnapshotDeleteManyArgs} args - Arguments to filter QuoteSnapshots to delete.
     * @example
     * // Delete a few QuoteSnapshots
     * const { count } = await prisma.quoteSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuoteSnapshotDeleteManyArgs>(args?: SelectSubset<T, QuoteSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuoteSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuoteSnapshots
     * const quoteSnapshot = await prisma.quoteSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuoteSnapshotUpdateManyArgs>(args: SelectSubset<T, QuoteSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuoteSnapshots and returns the data updated in the database.
     * @param {QuoteSnapshotUpdateManyAndReturnArgs} args - Arguments to update many QuoteSnapshots.
     * @example
     * // Update many QuoteSnapshots
     * const quoteSnapshot = await prisma.quoteSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuoteSnapshots and only return the `id`
     * const quoteSnapshotWithIdOnly = await prisma.quoteSnapshot.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuoteSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, QuoteSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuoteSnapshot.
     * @param {QuoteSnapshotUpsertArgs} args - Arguments to update or create a QuoteSnapshot.
     * @example
     * // Update or create a QuoteSnapshot
     * const quoteSnapshot = await prisma.quoteSnapshot.upsert({
     *   create: {
     *     // ... data to create a QuoteSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuoteSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends QuoteSnapshotUpsertArgs>(args: SelectSubset<T, QuoteSnapshotUpsertArgs<ExtArgs>>): Prisma__QuoteSnapshotClient<$Result.GetResult<Prisma.$QuoteSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuoteSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotCountArgs} args - Arguments to filter QuoteSnapshots to count.
     * @example
     * // Count the number of QuoteSnapshots
     * const count = await prisma.quoteSnapshot.count({
     *   where: {
     *     // ... the filter for the QuoteSnapshots we want to count
     *   }
     * })
    **/
    count<T extends QuoteSnapshotCountArgs>(
      args?: Subset<T, QuoteSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuoteSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuoteSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuoteSnapshotAggregateArgs>(args: Subset<T, QuoteSnapshotAggregateArgs>): Prisma.PrismaPromise<GetQuoteSnapshotAggregateType<T>>

    /**
     * Group by QuoteSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteSnapshotGroupByArgs} args - Group by arguments.
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
      T extends QuoteSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuoteSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: QuoteSnapshotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuoteSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuoteSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuoteSnapshot model
   */
  readonly fields: QuoteSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuoteSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuoteSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the QuoteSnapshot model
   */
  interface QuoteSnapshotFieldRefs {
    readonly id: FieldRef<"QuoteSnapshot", 'String'>
    readonly timestamp: FieldRef<"QuoteSnapshot", 'DateTime'>
    readonly nseSymbol: FieldRef<"QuoteSnapshot", 'String'>
    readonly quoteData: FieldRef<"QuoteSnapshot", 'Json'>
    readonly createdAt: FieldRef<"QuoteSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"QuoteSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuoteSnapshot findUnique
   */
  export type QuoteSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which QuoteSnapshot to fetch.
     */
    where: QuoteSnapshotWhereUniqueInput
  }

  /**
   * QuoteSnapshot findUniqueOrThrow
   */
  export type QuoteSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which QuoteSnapshot to fetch.
     */
    where: QuoteSnapshotWhereUniqueInput
  }

  /**
   * QuoteSnapshot findFirst
   */
  export type QuoteSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which QuoteSnapshot to fetch.
     */
    where?: QuoteSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuoteSnapshots to fetch.
     */
    orderBy?: QuoteSnapshotOrderByWithRelationInput | QuoteSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuoteSnapshots.
     */
    cursor?: QuoteSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuoteSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuoteSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuoteSnapshots.
     */
    distinct?: QuoteSnapshotScalarFieldEnum | QuoteSnapshotScalarFieldEnum[]
  }

  /**
   * QuoteSnapshot findFirstOrThrow
   */
  export type QuoteSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which QuoteSnapshot to fetch.
     */
    where?: QuoteSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuoteSnapshots to fetch.
     */
    orderBy?: QuoteSnapshotOrderByWithRelationInput | QuoteSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuoteSnapshots.
     */
    cursor?: QuoteSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuoteSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuoteSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuoteSnapshots.
     */
    distinct?: QuoteSnapshotScalarFieldEnum | QuoteSnapshotScalarFieldEnum[]
  }

  /**
   * QuoteSnapshot findMany
   */
  export type QuoteSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which QuoteSnapshots to fetch.
     */
    where?: QuoteSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuoteSnapshots to fetch.
     */
    orderBy?: QuoteSnapshotOrderByWithRelationInput | QuoteSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuoteSnapshots.
     */
    cursor?: QuoteSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuoteSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuoteSnapshots.
     */
    skip?: number
    distinct?: QuoteSnapshotScalarFieldEnum | QuoteSnapshotScalarFieldEnum[]
  }

  /**
   * QuoteSnapshot create
   */
  export type QuoteSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a QuoteSnapshot.
     */
    data: XOR<QuoteSnapshotCreateInput, QuoteSnapshotUncheckedCreateInput>
  }

  /**
   * QuoteSnapshot createMany
   */
  export type QuoteSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuoteSnapshots.
     */
    data: QuoteSnapshotCreateManyInput | QuoteSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuoteSnapshot createManyAndReturn
   */
  export type QuoteSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many QuoteSnapshots.
     */
    data: QuoteSnapshotCreateManyInput | QuoteSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuoteSnapshot update
   */
  export type QuoteSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a QuoteSnapshot.
     */
    data: XOR<QuoteSnapshotUpdateInput, QuoteSnapshotUncheckedUpdateInput>
    /**
     * Choose, which QuoteSnapshot to update.
     */
    where: QuoteSnapshotWhereUniqueInput
  }

  /**
   * QuoteSnapshot updateMany
   */
  export type QuoteSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuoteSnapshots.
     */
    data: XOR<QuoteSnapshotUpdateManyMutationInput, QuoteSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which QuoteSnapshots to update
     */
    where?: QuoteSnapshotWhereInput
    /**
     * Limit how many QuoteSnapshots to update.
     */
    limit?: number
  }

  /**
   * QuoteSnapshot updateManyAndReturn
   */
  export type QuoteSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update QuoteSnapshots.
     */
    data: XOR<QuoteSnapshotUpdateManyMutationInput, QuoteSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which QuoteSnapshots to update
     */
    where?: QuoteSnapshotWhereInput
    /**
     * Limit how many QuoteSnapshots to update.
     */
    limit?: number
  }

  /**
   * QuoteSnapshot upsert
   */
  export type QuoteSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the QuoteSnapshot to update in case it exists.
     */
    where: QuoteSnapshotWhereUniqueInput
    /**
     * In case the QuoteSnapshot found by the `where` argument doesn't exist, create a new QuoteSnapshot with this data.
     */
    create: XOR<QuoteSnapshotCreateInput, QuoteSnapshotUncheckedCreateInput>
    /**
     * In case the QuoteSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuoteSnapshotUpdateInput, QuoteSnapshotUncheckedUpdateInput>
  }

  /**
   * QuoteSnapshot delete
   */
  export type QuoteSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
    /**
     * Filter which QuoteSnapshot to delete.
     */
    where: QuoteSnapshotWhereUniqueInput
  }

  /**
   * QuoteSnapshot deleteMany
   */
  export type QuoteSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuoteSnapshots to delete
     */
    where?: QuoteSnapshotWhereInput
    /**
     * Limit how many QuoteSnapshots to delete.
     */
    limit?: number
  }

  /**
   * QuoteSnapshot without action
   */
  export type QuoteSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteSnapshot
     */
    select?: QuoteSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuoteSnapshot
     */
    omit?: QuoteSnapshotOmit<ExtArgs> | null
  }


  /**
   * Model NiftyQuote
   */

  export type AggregateNiftyQuote = {
    _count: NiftyQuoteCountAggregateOutputType | null
    _avg: NiftyQuoteAvgAggregateOutputType | null
    _sum: NiftyQuoteSumAggregateOutputType | null
    _min: NiftyQuoteMinAggregateOutputType | null
    _max: NiftyQuoteMaxAggregateOutputType | null
  }

  export type NiftyQuoteAvgAggregateOutputType = {
    dayChangePerc: Decimal | null
  }

  export type NiftyQuoteSumAggregateOutputType = {
    dayChangePerc: Decimal | null
  }

  export type NiftyQuoteMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    dayChangePerc: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NiftyQuoteMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    dayChangePerc: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NiftyQuoteCountAggregateOutputType = {
    id: number
    timestamp: number
    quoteData: number
    dayChangePerc: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NiftyQuoteAvgAggregateInputType = {
    dayChangePerc?: true
  }

  export type NiftyQuoteSumAggregateInputType = {
    dayChangePerc?: true
  }

  export type NiftyQuoteMinAggregateInputType = {
    id?: true
    timestamp?: true
    dayChangePerc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NiftyQuoteMaxAggregateInputType = {
    id?: true
    timestamp?: true
    dayChangePerc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NiftyQuoteCountAggregateInputType = {
    id?: true
    timestamp?: true
    quoteData?: true
    dayChangePerc?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NiftyQuoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NiftyQuote to aggregate.
     */
    where?: NiftyQuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NiftyQuotes to fetch.
     */
    orderBy?: NiftyQuoteOrderByWithRelationInput | NiftyQuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NiftyQuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NiftyQuotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NiftyQuotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NiftyQuotes
    **/
    _count?: true | NiftyQuoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NiftyQuoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NiftyQuoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NiftyQuoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NiftyQuoteMaxAggregateInputType
  }

  export type GetNiftyQuoteAggregateType<T extends NiftyQuoteAggregateArgs> = {
        [P in keyof T & keyof AggregateNiftyQuote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNiftyQuote[P]>
      : GetScalarType<T[P], AggregateNiftyQuote[P]>
  }




  export type NiftyQuoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NiftyQuoteWhereInput
    orderBy?: NiftyQuoteOrderByWithAggregationInput | NiftyQuoteOrderByWithAggregationInput[]
    by: NiftyQuoteScalarFieldEnum[] | NiftyQuoteScalarFieldEnum
    having?: NiftyQuoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NiftyQuoteCountAggregateInputType | true
    _avg?: NiftyQuoteAvgAggregateInputType
    _sum?: NiftyQuoteSumAggregateInputType
    _min?: NiftyQuoteMinAggregateInputType
    _max?: NiftyQuoteMaxAggregateInputType
  }

  export type NiftyQuoteGroupByOutputType = {
    id: string
    timestamp: Date
    quoteData: JsonValue
    dayChangePerc: Decimal
    createdAt: Date
    updatedAt: Date
    _count: NiftyQuoteCountAggregateOutputType | null
    _avg: NiftyQuoteAvgAggregateOutputType | null
    _sum: NiftyQuoteSumAggregateOutputType | null
    _min: NiftyQuoteMinAggregateOutputType | null
    _max: NiftyQuoteMaxAggregateOutputType | null
  }

  type GetNiftyQuoteGroupByPayload<T extends NiftyQuoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NiftyQuoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NiftyQuoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NiftyQuoteGroupByOutputType[P]>
            : GetScalarType<T[P], NiftyQuoteGroupByOutputType[P]>
        }
      >
    >


  export type NiftyQuoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    quoteData?: boolean
    dayChangePerc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["niftyQuote"]>

  export type NiftyQuoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    quoteData?: boolean
    dayChangePerc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["niftyQuote"]>

  export type NiftyQuoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    quoteData?: boolean
    dayChangePerc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["niftyQuote"]>

  export type NiftyQuoteSelectScalar = {
    id?: boolean
    timestamp?: boolean
    quoteData?: boolean
    dayChangePerc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NiftyQuoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "quoteData" | "dayChangePerc" | "createdAt" | "updatedAt", ExtArgs["result"]["niftyQuote"]>

  export type $NiftyQuotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NiftyQuote"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      quoteData: Prisma.JsonValue
      dayChangePerc: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["niftyQuote"]>
    composites: {}
  }

  type NiftyQuoteGetPayload<S extends boolean | null | undefined | NiftyQuoteDefaultArgs> = $Result.GetResult<Prisma.$NiftyQuotePayload, S>

  type NiftyQuoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NiftyQuoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NiftyQuoteCountAggregateInputType | true
    }

  export interface NiftyQuoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NiftyQuote'], meta: { name: 'NiftyQuote' } }
    /**
     * Find zero or one NiftyQuote that matches the filter.
     * @param {NiftyQuoteFindUniqueArgs} args - Arguments to find a NiftyQuote
     * @example
     * // Get one NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NiftyQuoteFindUniqueArgs>(args: SelectSubset<T, NiftyQuoteFindUniqueArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NiftyQuote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NiftyQuoteFindUniqueOrThrowArgs} args - Arguments to find a NiftyQuote
     * @example
     * // Get one NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NiftyQuoteFindUniqueOrThrowArgs>(args: SelectSubset<T, NiftyQuoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NiftyQuote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteFindFirstArgs} args - Arguments to find a NiftyQuote
     * @example
     * // Get one NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NiftyQuoteFindFirstArgs>(args?: SelectSubset<T, NiftyQuoteFindFirstArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NiftyQuote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteFindFirstOrThrowArgs} args - Arguments to find a NiftyQuote
     * @example
     * // Get one NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NiftyQuoteFindFirstOrThrowArgs>(args?: SelectSubset<T, NiftyQuoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NiftyQuotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NiftyQuotes
     * const niftyQuotes = await prisma.niftyQuote.findMany()
     * 
     * // Get first 10 NiftyQuotes
     * const niftyQuotes = await prisma.niftyQuote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const niftyQuoteWithIdOnly = await prisma.niftyQuote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NiftyQuoteFindManyArgs>(args?: SelectSubset<T, NiftyQuoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NiftyQuote.
     * @param {NiftyQuoteCreateArgs} args - Arguments to create a NiftyQuote.
     * @example
     * // Create one NiftyQuote
     * const NiftyQuote = await prisma.niftyQuote.create({
     *   data: {
     *     // ... data to create a NiftyQuote
     *   }
     * })
     * 
     */
    create<T extends NiftyQuoteCreateArgs>(args: SelectSubset<T, NiftyQuoteCreateArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NiftyQuotes.
     * @param {NiftyQuoteCreateManyArgs} args - Arguments to create many NiftyQuotes.
     * @example
     * // Create many NiftyQuotes
     * const niftyQuote = await prisma.niftyQuote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NiftyQuoteCreateManyArgs>(args?: SelectSubset<T, NiftyQuoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NiftyQuotes and returns the data saved in the database.
     * @param {NiftyQuoteCreateManyAndReturnArgs} args - Arguments to create many NiftyQuotes.
     * @example
     * // Create many NiftyQuotes
     * const niftyQuote = await prisma.niftyQuote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NiftyQuotes and only return the `id`
     * const niftyQuoteWithIdOnly = await prisma.niftyQuote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NiftyQuoteCreateManyAndReturnArgs>(args?: SelectSubset<T, NiftyQuoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NiftyQuote.
     * @param {NiftyQuoteDeleteArgs} args - Arguments to delete one NiftyQuote.
     * @example
     * // Delete one NiftyQuote
     * const NiftyQuote = await prisma.niftyQuote.delete({
     *   where: {
     *     // ... filter to delete one NiftyQuote
     *   }
     * })
     * 
     */
    delete<T extends NiftyQuoteDeleteArgs>(args: SelectSubset<T, NiftyQuoteDeleteArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NiftyQuote.
     * @param {NiftyQuoteUpdateArgs} args - Arguments to update one NiftyQuote.
     * @example
     * // Update one NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NiftyQuoteUpdateArgs>(args: SelectSubset<T, NiftyQuoteUpdateArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NiftyQuotes.
     * @param {NiftyQuoteDeleteManyArgs} args - Arguments to filter NiftyQuotes to delete.
     * @example
     * // Delete a few NiftyQuotes
     * const { count } = await prisma.niftyQuote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NiftyQuoteDeleteManyArgs>(args?: SelectSubset<T, NiftyQuoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NiftyQuotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NiftyQuotes
     * const niftyQuote = await prisma.niftyQuote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NiftyQuoteUpdateManyArgs>(args: SelectSubset<T, NiftyQuoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NiftyQuotes and returns the data updated in the database.
     * @param {NiftyQuoteUpdateManyAndReturnArgs} args - Arguments to update many NiftyQuotes.
     * @example
     * // Update many NiftyQuotes
     * const niftyQuote = await prisma.niftyQuote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NiftyQuotes and only return the `id`
     * const niftyQuoteWithIdOnly = await prisma.niftyQuote.updateManyAndReturn({
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
    updateManyAndReturn<T extends NiftyQuoteUpdateManyAndReturnArgs>(args: SelectSubset<T, NiftyQuoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NiftyQuote.
     * @param {NiftyQuoteUpsertArgs} args - Arguments to update or create a NiftyQuote.
     * @example
     * // Update or create a NiftyQuote
     * const niftyQuote = await prisma.niftyQuote.upsert({
     *   create: {
     *     // ... data to create a NiftyQuote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NiftyQuote we want to update
     *   }
     * })
     */
    upsert<T extends NiftyQuoteUpsertArgs>(args: SelectSubset<T, NiftyQuoteUpsertArgs<ExtArgs>>): Prisma__NiftyQuoteClient<$Result.GetResult<Prisma.$NiftyQuotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NiftyQuotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteCountArgs} args - Arguments to filter NiftyQuotes to count.
     * @example
     * // Count the number of NiftyQuotes
     * const count = await prisma.niftyQuote.count({
     *   where: {
     *     // ... the filter for the NiftyQuotes we want to count
     *   }
     * })
    **/
    count<T extends NiftyQuoteCountArgs>(
      args?: Subset<T, NiftyQuoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NiftyQuoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NiftyQuote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NiftyQuoteAggregateArgs>(args: Subset<T, NiftyQuoteAggregateArgs>): Prisma.PrismaPromise<GetNiftyQuoteAggregateType<T>>

    /**
     * Group by NiftyQuote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NiftyQuoteGroupByArgs} args - Group by arguments.
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
      T extends NiftyQuoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NiftyQuoteGroupByArgs['orderBy'] }
        : { orderBy?: NiftyQuoteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NiftyQuoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNiftyQuoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NiftyQuote model
   */
  readonly fields: NiftyQuoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NiftyQuote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NiftyQuoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the NiftyQuote model
   */
  interface NiftyQuoteFieldRefs {
    readonly id: FieldRef<"NiftyQuote", 'String'>
    readonly timestamp: FieldRef<"NiftyQuote", 'DateTime'>
    readonly quoteData: FieldRef<"NiftyQuote", 'Json'>
    readonly dayChangePerc: FieldRef<"NiftyQuote", 'Decimal'>
    readonly createdAt: FieldRef<"NiftyQuote", 'DateTime'>
    readonly updatedAt: FieldRef<"NiftyQuote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NiftyQuote findUnique
   */
  export type NiftyQuoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter, which NiftyQuote to fetch.
     */
    where: NiftyQuoteWhereUniqueInput
  }

  /**
   * NiftyQuote findUniqueOrThrow
   */
  export type NiftyQuoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter, which NiftyQuote to fetch.
     */
    where: NiftyQuoteWhereUniqueInput
  }

  /**
   * NiftyQuote findFirst
   */
  export type NiftyQuoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter, which NiftyQuote to fetch.
     */
    where?: NiftyQuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NiftyQuotes to fetch.
     */
    orderBy?: NiftyQuoteOrderByWithRelationInput | NiftyQuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NiftyQuotes.
     */
    cursor?: NiftyQuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NiftyQuotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NiftyQuotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NiftyQuotes.
     */
    distinct?: NiftyQuoteScalarFieldEnum | NiftyQuoteScalarFieldEnum[]
  }

  /**
   * NiftyQuote findFirstOrThrow
   */
  export type NiftyQuoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter, which NiftyQuote to fetch.
     */
    where?: NiftyQuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NiftyQuotes to fetch.
     */
    orderBy?: NiftyQuoteOrderByWithRelationInput | NiftyQuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NiftyQuotes.
     */
    cursor?: NiftyQuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NiftyQuotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NiftyQuotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NiftyQuotes.
     */
    distinct?: NiftyQuoteScalarFieldEnum | NiftyQuoteScalarFieldEnum[]
  }

  /**
   * NiftyQuote findMany
   */
  export type NiftyQuoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter, which NiftyQuotes to fetch.
     */
    where?: NiftyQuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NiftyQuotes to fetch.
     */
    orderBy?: NiftyQuoteOrderByWithRelationInput | NiftyQuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NiftyQuotes.
     */
    cursor?: NiftyQuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NiftyQuotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NiftyQuotes.
     */
    skip?: number
    distinct?: NiftyQuoteScalarFieldEnum | NiftyQuoteScalarFieldEnum[]
  }

  /**
   * NiftyQuote create
   */
  export type NiftyQuoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * The data needed to create a NiftyQuote.
     */
    data: XOR<NiftyQuoteCreateInput, NiftyQuoteUncheckedCreateInput>
  }

  /**
   * NiftyQuote createMany
   */
  export type NiftyQuoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NiftyQuotes.
     */
    data: NiftyQuoteCreateManyInput | NiftyQuoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NiftyQuote createManyAndReturn
   */
  export type NiftyQuoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * The data used to create many NiftyQuotes.
     */
    data: NiftyQuoteCreateManyInput | NiftyQuoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NiftyQuote update
   */
  export type NiftyQuoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * The data needed to update a NiftyQuote.
     */
    data: XOR<NiftyQuoteUpdateInput, NiftyQuoteUncheckedUpdateInput>
    /**
     * Choose, which NiftyQuote to update.
     */
    where: NiftyQuoteWhereUniqueInput
  }

  /**
   * NiftyQuote updateMany
   */
  export type NiftyQuoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NiftyQuotes.
     */
    data: XOR<NiftyQuoteUpdateManyMutationInput, NiftyQuoteUncheckedUpdateManyInput>
    /**
     * Filter which NiftyQuotes to update
     */
    where?: NiftyQuoteWhereInput
    /**
     * Limit how many NiftyQuotes to update.
     */
    limit?: number
  }

  /**
   * NiftyQuote updateManyAndReturn
   */
  export type NiftyQuoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * The data used to update NiftyQuotes.
     */
    data: XOR<NiftyQuoteUpdateManyMutationInput, NiftyQuoteUncheckedUpdateManyInput>
    /**
     * Filter which NiftyQuotes to update
     */
    where?: NiftyQuoteWhereInput
    /**
     * Limit how many NiftyQuotes to update.
     */
    limit?: number
  }

  /**
   * NiftyQuote upsert
   */
  export type NiftyQuoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * The filter to search for the NiftyQuote to update in case it exists.
     */
    where: NiftyQuoteWhereUniqueInput
    /**
     * In case the NiftyQuote found by the `where` argument doesn't exist, create a new NiftyQuote with this data.
     */
    create: XOR<NiftyQuoteCreateInput, NiftyQuoteUncheckedCreateInput>
    /**
     * In case the NiftyQuote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NiftyQuoteUpdateInput, NiftyQuoteUncheckedUpdateInput>
  }

  /**
   * NiftyQuote delete
   */
  export type NiftyQuoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
    /**
     * Filter which NiftyQuote to delete.
     */
    where: NiftyQuoteWhereUniqueInput
  }

  /**
   * NiftyQuote deleteMany
   */
  export type NiftyQuoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NiftyQuotes to delete
     */
    where?: NiftyQuoteWhereInput
    /**
     * Limit how many NiftyQuotes to delete.
     */
    limit?: number
  }

  /**
   * NiftyQuote without action
   */
  export type NiftyQuoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NiftyQuote
     */
    select?: NiftyQuoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NiftyQuote
     */
    omit?: NiftyQuoteOmit<ExtArgs> | null
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


  export const QuoteSnapshotScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    nseSymbol: 'nseSymbol',
    quoteData: 'quoteData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuoteSnapshotScalarFieldEnum = (typeof QuoteSnapshotScalarFieldEnum)[keyof typeof QuoteSnapshotScalarFieldEnum]


  export const NiftyQuoteScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    quoteData: 'quoteData',
    dayChangePerc: 'dayChangePerc',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NiftyQuoteScalarFieldEnum = (typeof NiftyQuoteScalarFieldEnum)[keyof typeof NiftyQuoteScalarFieldEnum]


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


  export const NseHolidayScalarFieldEnum: {
    id: 'id',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NseHolidayScalarFieldEnum = (typeof NseHolidayScalarFieldEnum)[keyof typeof NseHolidayScalarFieldEnum]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ShortlistType'
   */
  export type EnumShortlistTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistType'>
    


  /**
   * Reference to a field of type 'ShortlistType[]'
   */
  export type ListEnumShortlistTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShortlistType[]'>
    


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

  export type QuoteSnapshotWhereInput = {
    AND?: QuoteSnapshotWhereInput | QuoteSnapshotWhereInput[]
    OR?: QuoteSnapshotWhereInput[]
    NOT?: QuoteSnapshotWhereInput | QuoteSnapshotWhereInput[]
    id?: StringFilter<"QuoteSnapshot"> | string
    timestamp?: DateTimeFilter<"QuoteSnapshot"> | Date | string
    nseSymbol?: StringFilter<"QuoteSnapshot"> | string
    quoteData?: JsonFilter<"QuoteSnapshot">
    createdAt?: DateTimeFilter<"QuoteSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"QuoteSnapshot"> | Date | string
  }

  export type QuoteSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    nseSymbol?: SortOrder
    quoteData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuoteSnapshotWhereInput | QuoteSnapshotWhereInput[]
    OR?: QuoteSnapshotWhereInput[]
    NOT?: QuoteSnapshotWhereInput | QuoteSnapshotWhereInput[]
    timestamp?: DateTimeFilter<"QuoteSnapshot"> | Date | string
    nseSymbol?: StringFilter<"QuoteSnapshot"> | string
    quoteData?: JsonFilter<"QuoteSnapshot">
    createdAt?: DateTimeFilter<"QuoteSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"QuoteSnapshot"> | Date | string
  }, "id">

  export type QuoteSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    nseSymbol?: SortOrder
    quoteData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuoteSnapshotCountOrderByAggregateInput
    _max?: QuoteSnapshotMaxOrderByAggregateInput
    _min?: QuoteSnapshotMinOrderByAggregateInput
  }

  export type QuoteSnapshotScalarWhereWithAggregatesInput = {
    AND?: QuoteSnapshotScalarWhereWithAggregatesInput | QuoteSnapshotScalarWhereWithAggregatesInput[]
    OR?: QuoteSnapshotScalarWhereWithAggregatesInput[]
    NOT?: QuoteSnapshotScalarWhereWithAggregatesInput | QuoteSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuoteSnapshot"> | string
    timestamp?: DateTimeWithAggregatesFilter<"QuoteSnapshot"> | Date | string
    nseSymbol?: StringWithAggregatesFilter<"QuoteSnapshot"> | string
    quoteData?: JsonWithAggregatesFilter<"QuoteSnapshot">
    createdAt?: DateTimeWithAggregatesFilter<"QuoteSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QuoteSnapshot"> | Date | string
  }

  export type NiftyQuoteWhereInput = {
    AND?: NiftyQuoteWhereInput | NiftyQuoteWhereInput[]
    OR?: NiftyQuoteWhereInput[]
    NOT?: NiftyQuoteWhereInput | NiftyQuoteWhereInput[]
    id?: StringFilter<"NiftyQuote"> | string
    timestamp?: DateTimeFilter<"NiftyQuote"> | Date | string
    quoteData?: JsonFilter<"NiftyQuote">
    dayChangePerc?: DecimalFilter<"NiftyQuote"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"NiftyQuote"> | Date | string
    updatedAt?: DateTimeFilter<"NiftyQuote"> | Date | string
  }

  export type NiftyQuoteOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    quoteData?: SortOrder
    dayChangePerc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NiftyQuoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NiftyQuoteWhereInput | NiftyQuoteWhereInput[]
    OR?: NiftyQuoteWhereInput[]
    NOT?: NiftyQuoteWhereInput | NiftyQuoteWhereInput[]
    timestamp?: DateTimeFilter<"NiftyQuote"> | Date | string
    quoteData?: JsonFilter<"NiftyQuote">
    dayChangePerc?: DecimalFilter<"NiftyQuote"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"NiftyQuote"> | Date | string
    updatedAt?: DateTimeFilter<"NiftyQuote"> | Date | string
  }, "id">

  export type NiftyQuoteOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    quoteData?: SortOrder
    dayChangePerc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NiftyQuoteCountOrderByAggregateInput
    _avg?: NiftyQuoteAvgOrderByAggregateInput
    _max?: NiftyQuoteMaxOrderByAggregateInput
    _min?: NiftyQuoteMinOrderByAggregateInput
    _sum?: NiftyQuoteSumOrderByAggregateInput
  }

  export type NiftyQuoteScalarWhereWithAggregatesInput = {
    AND?: NiftyQuoteScalarWhereWithAggregatesInput | NiftyQuoteScalarWhereWithAggregatesInput[]
    OR?: NiftyQuoteScalarWhereWithAggregatesInput[]
    NOT?: NiftyQuoteScalarWhereWithAggregatesInput | NiftyQuoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NiftyQuote"> | string
    timestamp?: DateTimeWithAggregatesFilter<"NiftyQuote"> | Date | string
    quoteData?: JsonWithAggregatesFilter<"NiftyQuote">
    dayChangePerc?: DecimalWithAggregatesFilter<"NiftyQuote"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"NiftyQuote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NiftyQuote"> | Date | string
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

  export type QuoteSnapshotCreateInput = {
    id?: string
    timestamp: Date | string
    nseSymbol: string
    quoteData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteSnapshotUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    nseSymbol: string
    quoteData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    quoteData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuoteSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    quoteData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuoteSnapshotCreateManyInput = {
    id?: string
    timestamp: Date | string
    nseSymbol: string
    quoteData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    quoteData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuoteSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    nseSymbol?: StringFieldUpdateOperationsInput | string
    quoteData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NiftyQuoteCreateInput = {
    id?: string
    timestamp: Date | string
    quoteData: JsonNullValueInput | InputJsonValue
    dayChangePerc: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NiftyQuoteUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    quoteData: JsonNullValueInput | InputJsonValue
    dayChangePerc: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NiftyQuoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    quoteData?: JsonNullValueInput | InputJsonValue
    dayChangePerc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NiftyQuoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    quoteData?: JsonNullValueInput | InputJsonValue
    dayChangePerc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NiftyQuoteCreateManyInput = {
    id?: string
    timestamp: Date | string
    quoteData: JsonNullValueInput | InputJsonValue
    dayChangePerc: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NiftyQuoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    quoteData?: JsonNullValueInput | InputJsonValue
    dayChangePerc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NiftyQuoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    quoteData?: JsonNullValueInput | InputJsonValue
    dayChangePerc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
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

  export type QuoteSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    nseSymbol?: SortOrder
    quoteData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    nseSymbol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    nseSymbol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type NiftyQuoteCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    quoteData?: SortOrder
    dayChangePerc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NiftyQuoteAvgOrderByAggregateInput = {
    dayChangePerc?: SortOrder
  }

  export type NiftyQuoteMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    dayChangePerc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NiftyQuoteMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    dayChangePerc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NiftyQuoteSumOrderByAggregateInput = {
    dayChangePerc?: SortOrder
  }

  export type EnumShortlistTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeFilter<$PrismaModel> | $Enums.ShortlistType
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