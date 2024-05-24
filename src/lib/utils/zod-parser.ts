import { createParser, type ParserBuilder } from "nuqs";
import { type z } from "zod";

export const createZodParser = <T extends z.Schema>(
  schema: T,
  serialize: (value: T) => string = JSON.stringify,
): ParserBuilder<T["_output"]> => {
  return createParser({
    parse(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return schema.parse(value);
    },
    serialize,
  });
};
