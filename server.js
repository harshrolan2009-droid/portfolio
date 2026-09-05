import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url)).replace(/[\\/]+$/, "");
const port = Number(process.env.PORT || 3000);
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".svg":"image/svg+xml", ".ico":"image/x-icon", ".txt":"text/plain; charset=utf-8" };
const routes = { "/":"index.html", "/about":"about.html", "/skills":"skills.html", "/projects":"projects.html", "/project-detail":"project-detail.html", "/services":"services.html", "/education":"education.html", "/experience":"experience.html", "/testimonials":"testimonials.html", "/contact":"contact.html", "/resume":"resume.html", "/admin":"admin.html", "/admin/login":"admin.html", "/admin/hero":"admin.html", "/admin/about":"admin.html", "/admin/skills":"admin.html", "/admin/projects":"admin.html", "/admin/services":"admin.html", "/admin/education":"admin.html", "/admin/experience":"admin.html", "/admin/testimonials":"admin.html", "/admin/navigation":"admin.html", "/admin/messages":"admin.html", "/admin/media":"admin.html", "/admin/appearance":"admin.html", "/admin/seo":"admin.html", "/admin/resume":"admin.html", "/admin/settings":"admin.html", "/admin-login":"admin-login.html" };
function safePath(urlPath) {
  const requested = decodeURIComponent(urlPath.split("?")[0]);
  const file = requested.startsWith("/assets/") || requested.startsWith("/static/") || requested.startsWith("/css/") || requested.startsWith("/js/") || requested === "/favicon.svg" ? requested : (routes[requested] || (requested.endsWith(".html") ? requested : "/404.html"));
  const resolved = normalize(join(root, file));
  return resolved.startsWith(root + sep) || resolved === join(root, "index.html") ? resolved : join(root, "404.html");
}
createServer(async (request, response) => {
  try {
    const file = safePath(request.url || "/");
    const info = await stat(file);
    if (!info.isFile()) throw new Error("not a file");
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": extname(file) === ".html" ? "no-cache" : "public, max-age=3600" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(join(root, "404.html")));
  }
}).listen(port, "0.0.0.0", () => console.log(`Harsh Rolan portfolio listening on ${port}`));