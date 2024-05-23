import { NextRequest, NextResponse } from "next/server";
import { deleteCookie, getCookies } from "cookies-next";

const redirectToLogin = (request: NextRequest, response: NextResponse) => {
  const redirectResponse = NextResponse.redirect(
    `${process.env.NEXT_HOST}/login`
  );
  deleteCookie("accessToken", { res: redirectResponse, req: request });

  if (request.nextUrl.pathname === "/login") {
    return {
      response,
      halt: true,
    };
  }

  return {
    response: redirectResponse,
    halt: true,
  };
};

const handleLoginPath = async (
  request: NextRequest,
  response: NextResponse
) => {
  const token = getCookies({ res: response, req: request }).accessToken;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/users/me`,
    {
      method: "GET",
      headers,
    }
  );

  if (apiResponse.status === 401) {
    return redirectToLogin(request, response);
  }

  if (request.nextUrl.pathname === "/login" && apiResponse.status === 200) {
    return {
      response: NextResponse.redirect(`${process.env.NEXT_HOST}/editor`),
      halt: true,
    };
  }

  return {
    response,
    halt: true,
  };
};

const checkAuthMiddleware = async (
  request: NextRequest,
  response: NextResponse
) => {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/logout") {
    return redirectToLogin(request, response);
  }

  const cookies = getCookies({ res: response, req: request });

  if (!cookies.accessToken) {
    return redirectToLogin(request, response);
  }

  return handleLoginPath(request, response);
};

export default checkAuthMiddleware;
