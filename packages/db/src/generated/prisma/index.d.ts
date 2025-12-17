
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
 * Model ShortlistSnapshot
 * 
 */
export type ShortlistSnapshot = $Result.DefaultSelection<Prisma.$ShortlistSnapshotPayload>
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
 * Model DeveloperToken
 * 
 */
export type DeveloperToken = $Result.DefaultSelection<Prisma.$DeveloperTokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ShortlistType: {
  TOP_GAINERS: 'TOP_GAINERS',
  VOLUME_SHOCKERS: 'VOLUME_SHOCKERS'
};

export type ShortlistType = (typeof ShortlistType)[keyof typeof ShortlistType]

}

export type ShortlistType = $Enums.ShortlistType

export const ShortlistType: typeof $Enums.ShortlistType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ShortlistSnapshots
 * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany()
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
   * // Fetch zero or more ShortlistSnapshots
   * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany()
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
   * `prisma.shortlistSnapshot`: Exposes CRUD operations for the **ShortlistSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShortlistSnapshots
    * const shortlistSnapshots = await prisma.shortlistSnapshot.findMany()
    * ```
    */
  get shortlistSnapshot(): Prisma.ShortlistSnapshotDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.developerToken`: Exposes CRUD operations for the **DeveloperToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeveloperTokens
    * const developerTokens = await prisma.developerToken.findMany()
    * ```
    */
  get developerToken(): Prisma.DeveloperTokenDelegate<ExtArgs, ClientOptions>;
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
    ShortlistSnapshot: 'ShortlistSnapshot',
    QuoteSnapshot: 'QuoteSnapshot',
    NiftyQuote: 'NiftyQuote',
    DeveloperToken: 'DeveloperToken'
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
      modelProps: "shortlistSnapshot" | "quoteSnapshot" | "niftyQuote" | "developerToken"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
      DeveloperToken: {
        payload: Prisma.$DeveloperTokenPayload<ExtArgs>
        fields: Prisma.DeveloperTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeveloperTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeveloperTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          findFirst: {
            args: Prisma.DeveloperTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeveloperTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          findMany: {
            args: Prisma.DeveloperTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>[]
          }
          create: {
            args: Prisma.DeveloperTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          createMany: {
            args: Prisma.DeveloperTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeveloperTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>[]
          }
          delete: {
            args: Prisma.DeveloperTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          update: {
            args: Prisma.DeveloperTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          deleteMany: {
            args: Prisma.DeveloperTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeveloperTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeveloperTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>[]
          }
          upsert: {
            args: Prisma.DeveloperTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeveloperTokenPayload>
          }
          aggregate: {
            args: Prisma.DeveloperTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeveloperToken>
          }
          groupBy: {
            args: Prisma.DeveloperTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeveloperTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeveloperTokenCountArgs<ExtArgs>
            result: $Utils.Optional<DeveloperTokenCountAggregateOutputType> | number
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
    shortlistSnapshot?: ShortlistSnapshotOmit
    quoteSnapshot?: QuoteSnapshotOmit
    niftyQuote?: NiftyQuoteOmit
    developerToken?: DeveloperTokenOmit
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
   * Models
   */

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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShortlistSnapshotMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    shortlistType: $Enums.ShortlistType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShortlistSnapshotCountAggregateOutputType = {
    id: number
    timestamp: number
    shortlistType: number
    entries: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShortlistSnapshotMinAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShortlistSnapshotMaxAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShortlistSnapshotCountAggregateInputType = {
    id?: true
    timestamp?: true
    shortlistType?: true
    entries?: true
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
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shortlistSnapshot"]>

  export type ShortlistSnapshotSelectScalar = {
    id?: boolean
    timestamp?: boolean
    shortlistType?: boolean
    entries?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShortlistSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "shortlistType" | "entries" | "createdAt" | "updatedAt", ExtArgs["result"]["shortlistSnapshot"]>

  export type $ShortlistSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShortlistSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      shortlistType: $Enums.ShortlistType
      entries: Prisma.JsonValue
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
   * Model DeveloperToken
   */

  export type AggregateDeveloperToken = {
    _count: DeveloperTokenCountAggregateOutputType | null
    _min: DeveloperTokenMinAggregateOutputType | null
    _max: DeveloperTokenMaxAggregateOutputType | null
  }

  export type DeveloperTokenMinAggregateOutputType = {
    username: string | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeveloperTokenMaxAggregateOutputType = {
    username: string | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeveloperTokenCountAggregateOutputType = {
    username: number
    token: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeveloperTokenMinAggregateInputType = {
    username?: true
    token?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeveloperTokenMaxAggregateInputType = {
    username?: true
    token?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeveloperTokenCountAggregateInputType = {
    username?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeveloperTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeveloperToken to aggregate.
     */
    where?: DeveloperTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeveloperTokens to fetch.
     */
    orderBy?: DeveloperTokenOrderByWithRelationInput | DeveloperTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeveloperTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeveloperTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeveloperTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeveloperTokens
    **/
    _count?: true | DeveloperTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeveloperTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeveloperTokenMaxAggregateInputType
  }

  export type GetDeveloperTokenAggregateType<T extends DeveloperTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateDeveloperToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeveloperToken[P]>
      : GetScalarType<T[P], AggregateDeveloperToken[P]>
  }




  export type DeveloperTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeveloperTokenWhereInput
    orderBy?: DeveloperTokenOrderByWithAggregationInput | DeveloperTokenOrderByWithAggregationInput[]
    by: DeveloperTokenScalarFieldEnum[] | DeveloperTokenScalarFieldEnum
    having?: DeveloperTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeveloperTokenCountAggregateInputType | true
    _min?: DeveloperTokenMinAggregateInputType
    _max?: DeveloperTokenMaxAggregateInputType
  }

  export type DeveloperTokenGroupByOutputType = {
    username: string
    token: string
    createdAt: Date
    updatedAt: Date
    _count: DeveloperTokenCountAggregateOutputType | null
    _min: DeveloperTokenMinAggregateOutputType | null
    _max: DeveloperTokenMaxAggregateOutputType | null
  }

  type GetDeveloperTokenGroupByPayload<T extends DeveloperTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeveloperTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeveloperTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeveloperTokenGroupByOutputType[P]>
            : GetScalarType<T[P], DeveloperTokenGroupByOutputType[P]>
        }
      >
    >


  export type DeveloperTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["developerToken"]>

  export type DeveloperTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["developerToken"]>

  export type DeveloperTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["developerToken"]>

  export type DeveloperTokenSelectScalar = {
    username?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeveloperTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"username" | "token" | "createdAt" | "updatedAt", ExtArgs["result"]["developerToken"]>

  export type $DeveloperTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeveloperToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      username: string
      token: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["developerToken"]>
    composites: {}
  }

  type DeveloperTokenGetPayload<S extends boolean | null | undefined | DeveloperTokenDefaultArgs> = $Result.GetResult<Prisma.$DeveloperTokenPayload, S>

  type DeveloperTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeveloperTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeveloperTokenCountAggregateInputType | true
    }

  export interface DeveloperTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeveloperToken'], meta: { name: 'DeveloperToken' } }
    /**
     * Find zero or one DeveloperToken that matches the filter.
     * @param {DeveloperTokenFindUniqueArgs} args - Arguments to find a DeveloperToken
     * @example
     * // Get one DeveloperToken
     * const developerToken = await prisma.developerToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeveloperTokenFindUniqueArgs>(args: SelectSubset<T, DeveloperTokenFindUniqueArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeveloperToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeveloperTokenFindUniqueOrThrowArgs} args - Arguments to find a DeveloperToken
     * @example
     * // Get one DeveloperToken
     * const developerToken = await prisma.developerToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeveloperTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, DeveloperTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeveloperToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenFindFirstArgs} args - Arguments to find a DeveloperToken
     * @example
     * // Get one DeveloperToken
     * const developerToken = await prisma.developerToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeveloperTokenFindFirstArgs>(args?: SelectSubset<T, DeveloperTokenFindFirstArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeveloperToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenFindFirstOrThrowArgs} args - Arguments to find a DeveloperToken
     * @example
     * // Get one DeveloperToken
     * const developerToken = await prisma.developerToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeveloperTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, DeveloperTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeveloperTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeveloperTokens
     * const developerTokens = await prisma.developerToken.findMany()
     * 
     * // Get first 10 DeveloperTokens
     * const developerTokens = await prisma.developerToken.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const developerTokenWithUsernameOnly = await prisma.developerToken.findMany({ select: { username: true } })
     * 
     */
    findMany<T extends DeveloperTokenFindManyArgs>(args?: SelectSubset<T, DeveloperTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeveloperToken.
     * @param {DeveloperTokenCreateArgs} args - Arguments to create a DeveloperToken.
     * @example
     * // Create one DeveloperToken
     * const DeveloperToken = await prisma.developerToken.create({
     *   data: {
     *     // ... data to create a DeveloperToken
     *   }
     * })
     * 
     */
    create<T extends DeveloperTokenCreateArgs>(args: SelectSubset<T, DeveloperTokenCreateArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeveloperTokens.
     * @param {DeveloperTokenCreateManyArgs} args - Arguments to create many DeveloperTokens.
     * @example
     * // Create many DeveloperTokens
     * const developerToken = await prisma.developerToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeveloperTokenCreateManyArgs>(args?: SelectSubset<T, DeveloperTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeveloperTokens and returns the data saved in the database.
     * @param {DeveloperTokenCreateManyAndReturnArgs} args - Arguments to create many DeveloperTokens.
     * @example
     * // Create many DeveloperTokens
     * const developerToken = await prisma.developerToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeveloperTokens and only return the `username`
     * const developerTokenWithUsernameOnly = await prisma.developerToken.createManyAndReturn({
     *   select: { username: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeveloperTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, DeveloperTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeveloperToken.
     * @param {DeveloperTokenDeleteArgs} args - Arguments to delete one DeveloperToken.
     * @example
     * // Delete one DeveloperToken
     * const DeveloperToken = await prisma.developerToken.delete({
     *   where: {
     *     // ... filter to delete one DeveloperToken
     *   }
     * })
     * 
     */
    delete<T extends DeveloperTokenDeleteArgs>(args: SelectSubset<T, DeveloperTokenDeleteArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeveloperToken.
     * @param {DeveloperTokenUpdateArgs} args - Arguments to update one DeveloperToken.
     * @example
     * // Update one DeveloperToken
     * const developerToken = await prisma.developerToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeveloperTokenUpdateArgs>(args: SelectSubset<T, DeveloperTokenUpdateArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeveloperTokens.
     * @param {DeveloperTokenDeleteManyArgs} args - Arguments to filter DeveloperTokens to delete.
     * @example
     * // Delete a few DeveloperTokens
     * const { count } = await prisma.developerToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeveloperTokenDeleteManyArgs>(args?: SelectSubset<T, DeveloperTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeveloperTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeveloperTokens
     * const developerToken = await prisma.developerToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeveloperTokenUpdateManyArgs>(args: SelectSubset<T, DeveloperTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeveloperTokens and returns the data updated in the database.
     * @param {DeveloperTokenUpdateManyAndReturnArgs} args - Arguments to update many DeveloperTokens.
     * @example
     * // Update many DeveloperTokens
     * const developerToken = await prisma.developerToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeveloperTokens and only return the `username`
     * const developerTokenWithUsernameOnly = await prisma.developerToken.updateManyAndReturn({
     *   select: { username: true },
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
    updateManyAndReturn<T extends DeveloperTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, DeveloperTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeveloperToken.
     * @param {DeveloperTokenUpsertArgs} args - Arguments to update or create a DeveloperToken.
     * @example
     * // Update or create a DeveloperToken
     * const developerToken = await prisma.developerToken.upsert({
     *   create: {
     *     // ... data to create a DeveloperToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeveloperToken we want to update
     *   }
     * })
     */
    upsert<T extends DeveloperTokenUpsertArgs>(args: SelectSubset<T, DeveloperTokenUpsertArgs<ExtArgs>>): Prisma__DeveloperTokenClient<$Result.GetResult<Prisma.$DeveloperTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeveloperTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenCountArgs} args - Arguments to filter DeveloperTokens to count.
     * @example
     * // Count the number of DeveloperTokens
     * const count = await prisma.developerToken.count({
     *   where: {
     *     // ... the filter for the DeveloperTokens we want to count
     *   }
     * })
    **/
    count<T extends DeveloperTokenCountArgs>(
      args?: Subset<T, DeveloperTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeveloperTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeveloperToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeveloperTokenAggregateArgs>(args: Subset<T, DeveloperTokenAggregateArgs>): Prisma.PrismaPromise<GetDeveloperTokenAggregateType<T>>

    /**
     * Group by DeveloperToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeveloperTokenGroupByArgs} args - Group by arguments.
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
      T extends DeveloperTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeveloperTokenGroupByArgs['orderBy'] }
        : { orderBy?: DeveloperTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DeveloperTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeveloperTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeveloperToken model
   */
  readonly fields: DeveloperTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeveloperToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeveloperTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DeveloperToken model
   */
  interface DeveloperTokenFieldRefs {
    readonly username: FieldRef<"DeveloperToken", 'String'>
    readonly token: FieldRef<"DeveloperToken", 'String'>
    readonly createdAt: FieldRef<"DeveloperToken", 'DateTime'>
    readonly updatedAt: FieldRef<"DeveloperToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DeveloperToken findUnique
   */
  export type DeveloperTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter, which DeveloperToken to fetch.
     */
    where: DeveloperTokenWhereUniqueInput
  }

  /**
   * DeveloperToken findUniqueOrThrow
   */
  export type DeveloperTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter, which DeveloperToken to fetch.
     */
    where: DeveloperTokenWhereUniqueInput
  }

  /**
   * DeveloperToken findFirst
   */
  export type DeveloperTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter, which DeveloperToken to fetch.
     */
    where?: DeveloperTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeveloperTokens to fetch.
     */
    orderBy?: DeveloperTokenOrderByWithRelationInput | DeveloperTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeveloperTokens.
     */
    cursor?: DeveloperTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeveloperTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeveloperTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeveloperTokens.
     */
    distinct?: DeveloperTokenScalarFieldEnum | DeveloperTokenScalarFieldEnum[]
  }

  /**
   * DeveloperToken findFirstOrThrow
   */
  export type DeveloperTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter, which DeveloperToken to fetch.
     */
    where?: DeveloperTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeveloperTokens to fetch.
     */
    orderBy?: DeveloperTokenOrderByWithRelationInput | DeveloperTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeveloperTokens.
     */
    cursor?: DeveloperTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeveloperTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeveloperTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeveloperTokens.
     */
    distinct?: DeveloperTokenScalarFieldEnum | DeveloperTokenScalarFieldEnum[]
  }

  /**
   * DeveloperToken findMany
   */
  export type DeveloperTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter, which DeveloperTokens to fetch.
     */
    where?: DeveloperTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeveloperTokens to fetch.
     */
    orderBy?: DeveloperTokenOrderByWithRelationInput | DeveloperTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeveloperTokens.
     */
    cursor?: DeveloperTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeveloperTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeveloperTokens.
     */
    skip?: number
    distinct?: DeveloperTokenScalarFieldEnum | DeveloperTokenScalarFieldEnum[]
  }

  /**
   * DeveloperToken create
   */
  export type DeveloperTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a DeveloperToken.
     */
    data: XOR<DeveloperTokenCreateInput, DeveloperTokenUncheckedCreateInput>
  }

  /**
   * DeveloperToken createMany
   */
  export type DeveloperTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeveloperTokens.
     */
    data: DeveloperTokenCreateManyInput | DeveloperTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeveloperToken createManyAndReturn
   */
  export type DeveloperTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * The data used to create many DeveloperTokens.
     */
    data: DeveloperTokenCreateManyInput | DeveloperTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeveloperToken update
   */
  export type DeveloperTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a DeveloperToken.
     */
    data: XOR<DeveloperTokenUpdateInput, DeveloperTokenUncheckedUpdateInput>
    /**
     * Choose, which DeveloperToken to update.
     */
    where: DeveloperTokenWhereUniqueInput
  }

  /**
   * DeveloperToken updateMany
   */
  export type DeveloperTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeveloperTokens.
     */
    data: XOR<DeveloperTokenUpdateManyMutationInput, DeveloperTokenUncheckedUpdateManyInput>
    /**
     * Filter which DeveloperTokens to update
     */
    where?: DeveloperTokenWhereInput
    /**
     * Limit how many DeveloperTokens to update.
     */
    limit?: number
  }

  /**
   * DeveloperToken updateManyAndReturn
   */
  export type DeveloperTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * The data used to update DeveloperTokens.
     */
    data: XOR<DeveloperTokenUpdateManyMutationInput, DeveloperTokenUncheckedUpdateManyInput>
    /**
     * Filter which DeveloperTokens to update
     */
    where?: DeveloperTokenWhereInput
    /**
     * Limit how many DeveloperTokens to update.
     */
    limit?: number
  }

  /**
   * DeveloperToken upsert
   */
  export type DeveloperTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the DeveloperToken to update in case it exists.
     */
    where: DeveloperTokenWhereUniqueInput
    /**
     * In case the DeveloperToken found by the `where` argument doesn't exist, create a new DeveloperToken with this data.
     */
    create: XOR<DeveloperTokenCreateInput, DeveloperTokenUncheckedCreateInput>
    /**
     * In case the DeveloperToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeveloperTokenUpdateInput, DeveloperTokenUncheckedUpdateInput>
  }

  /**
   * DeveloperToken delete
   */
  export type DeveloperTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
    /**
     * Filter which DeveloperToken to delete.
     */
    where: DeveloperTokenWhereUniqueInput
  }

  /**
   * DeveloperToken deleteMany
   */
  export type DeveloperTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeveloperTokens to delete
     */
    where?: DeveloperTokenWhereInput
    /**
     * Limit how many DeveloperTokens to delete.
     */
    limit?: number
  }

  /**
   * DeveloperToken without action
   */
  export type DeveloperTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeveloperToken
     */
    select?: DeveloperTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeveloperToken
     */
    omit?: DeveloperTokenOmit<ExtArgs> | null
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


  export const ShortlistSnapshotScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    shortlistType: 'shortlistType',
    entries: 'entries',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShortlistSnapshotScalarFieldEnum = (typeof ShortlistSnapshotScalarFieldEnum)[keyof typeof ShortlistSnapshotScalarFieldEnum]


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


  export const DeveloperTokenScalarFieldEnum: {
    username: 'username',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeveloperTokenScalarFieldEnum = (typeof DeveloperTokenScalarFieldEnum)[keyof typeof DeveloperTokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


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


  export type ShortlistSnapshotWhereInput = {
    AND?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    OR?: ShortlistSnapshotWhereInput[]
    NOT?: ShortlistSnapshotWhereInput | ShortlistSnapshotWhereInput[]
    id?: StringFilter<"ShortlistSnapshot"> | string
    timestamp?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    shortlistType?: EnumShortlistTypeFilter<"ShortlistSnapshot"> | $Enums.ShortlistType
    entries?: JsonFilter<"ShortlistSnapshot">
    createdAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
  }

  export type ShortlistSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
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
    createdAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ShortlistSnapshot"> | Date | string
  }, "id">

  export type ShortlistSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
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
    createdAt?: DateTimeWithAggregatesFilter<"ShortlistSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ShortlistSnapshot"> | Date | string
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

  export type DeveloperTokenWhereInput = {
    AND?: DeveloperTokenWhereInput | DeveloperTokenWhereInput[]
    OR?: DeveloperTokenWhereInput[]
    NOT?: DeveloperTokenWhereInput | DeveloperTokenWhereInput[]
    username?: StringFilter<"DeveloperToken"> | string
    token?: StringFilter<"DeveloperToken"> | string
    createdAt?: DateTimeFilter<"DeveloperToken"> | Date | string
    updatedAt?: DateTimeFilter<"DeveloperToken"> | Date | string
  }

  export type DeveloperTokenOrderByWithRelationInput = {
    username?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeveloperTokenWhereUniqueInput = Prisma.AtLeast<{
    username?: string
    token?: string
    AND?: DeveloperTokenWhereInput | DeveloperTokenWhereInput[]
    OR?: DeveloperTokenWhereInput[]
    NOT?: DeveloperTokenWhereInput | DeveloperTokenWhereInput[]
    createdAt?: DateTimeFilter<"DeveloperToken"> | Date | string
    updatedAt?: DateTimeFilter<"DeveloperToken"> | Date | string
  }, "username" | "username" | "token">

  export type DeveloperTokenOrderByWithAggregationInput = {
    username?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeveloperTokenCountOrderByAggregateInput
    _max?: DeveloperTokenMaxOrderByAggregateInput
    _min?: DeveloperTokenMinOrderByAggregateInput
  }

  export type DeveloperTokenScalarWhereWithAggregatesInput = {
    AND?: DeveloperTokenScalarWhereWithAggregatesInput | DeveloperTokenScalarWhereWithAggregatesInput[]
    OR?: DeveloperTokenScalarWhereWithAggregatesInput[]
    NOT?: DeveloperTokenScalarWhereWithAggregatesInput | DeveloperTokenScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"DeveloperToken"> | string
    token?: StringWithAggregatesFilter<"DeveloperToken"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DeveloperToken"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DeveloperToken"> | Date | string
  }

  export type ShortlistSnapshotCreateInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotCreateManyInput = {
    id?: string
    timestamp: Date | string
    shortlistType: $Enums.ShortlistType
    entries: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShortlistSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShortlistSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    shortlistType?: EnumShortlistTypeFieldUpdateOperationsInput | $Enums.ShortlistType
    entries?: JsonNullValueInput | InputJsonValue
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

  export type DeveloperTokenCreateInput = {
    username: string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperTokenUncheckedCreateInput = {
    username: string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperTokenUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeveloperTokenUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeveloperTokenCreateManyInput = {
    username: string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeveloperTokenUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeveloperTokenUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
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

  export type ShortlistSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    entries?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShortlistSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShortlistSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    shortlistType?: SortOrder
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

  export type DeveloperTokenCountOrderByAggregateInput = {
    username?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeveloperTokenMaxOrderByAggregateInput = {
    username?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeveloperTokenMinOrderByAggregateInput = {
    username?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumShortlistTypeFieldUpdateOperationsInput = {
    set?: $Enums.ShortlistType
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
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

  export type NestedEnumShortlistTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ShortlistType | EnumShortlistTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShortlistType[] | ListEnumShortlistTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumShortlistTypeFilter<$PrismaModel> | $Enums.ShortlistType
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