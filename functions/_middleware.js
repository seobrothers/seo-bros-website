// Force a trailing slash on every page path. Runs before _redirects and static
// asset serving, so requests for `/foo` get a 301 to `/foo/` at the edge.
// Skips paths that look like files (anything with a dot in the last segment)
// so static assets like /favicon.ico, /images/x.png, /sitemap.xml pass through.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const lastSegment = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);

  if (url.pathname.endsWith("/") || lastSegment.includes(".")) {
    return context.next();
  }

  url.pathname += "/";
  return Response.redirect(url.toString(), 301);
}
