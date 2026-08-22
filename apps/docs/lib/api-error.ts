export type ApiErrorBody = {
  error: {
    code: string;
    hint: string;
    message: string;
  };
};

export const apiErrorCodes = {
  methodNotAllowed: "method_not_allowed",
  notAcceptable: "not_acceptable",
  notFound: "not_found",
} as const;

export const apiErrorBody = (
  code: string,
  message: string,
  hint: string
): ApiErrorBody => {
  return {
    error: {
      code,
      hint,
      message,
    },
  };
};

export const jsonErrorResponse = (
  status: number,
  code: string,
  message: string,
  hint: string
): Response => {
  return Response.json(apiErrorBody(code, message, hint), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
    },
    status,
  });
};
