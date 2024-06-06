import { NextRequest, NextResponse } from "next/server";
import CheckAuthMiddleware from "@/middlewares/checkAuthMiddleware";

const middlewareSelector = (path: string) => {
  switch (path) {
    case "/editor":
      return [CheckAuthMiddleware];
    case "/login":
      return [CheckAuthMiddleware];
    case "/dashboard":
      return [CheckAuthMiddleware];
    default:
      return [];
  }
};

type CustomMiddlewareResponse = {
  response: NextResponse;
  halt: boolean;
};

export default async function middleware(request: NextRequest) {
  const middlewares = middlewareSelector(request.nextUrl.pathname);
  let response = NextResponse.next();

  for (const customMiddleware of middlewares) {
    const customResponse = (await customMiddleware(
      request,
      response
    )) as CustomMiddlewareResponse;
    response = customResponse.response;
    if (customResponse.halt) {
      break;
    }
  }

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
