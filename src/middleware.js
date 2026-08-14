export const onRequest = async (context, next) => {
  const { pathname } = new URL(context.request.url);

  // Pages/endpoints that require the admin password.
  // GET /api/announcements stays public — the homepage reads it.
  const isDashboard = pathname.startsWith("/admindashboard");
  const isAnnouncementWrite =
    pathname.startsWith("/api/announcements") && context.request.method !== "GET";

  if (isDashboard || isAnnouncementWrite) {
    const auth = context.request.headers.get("authorization") ?? "";
    const expected = "Basic " + btoa(`admin:${process.env.ADMIN_PASSWORD}`);

    if (!process.env.ADMIN_PASSWORD || auth !== expected) {
      return new Response("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="ZeCoat Admin"' },
      });
    }
  }

  return next();
};
