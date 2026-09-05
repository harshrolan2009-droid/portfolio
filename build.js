import { cp, mkdir, rm, access } from "node:fs/promises";
import { join } from "node:path";
const root = new URL(".", import.meta.url).pathname;
const destination = join(root, "dist", "public");
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of ["index.html", "404.html", "about.html", "skills.html", "projects.html", "project-detail.html", "services.html", "education.html", "experience.html", "testimonials.html", "contact.html", "resume.html", "admin.html", "admin-login.html", "css", "js", "assets", "static", "public"]) {
  const source = join(root, entry);
  try {
    await access(source);
  } catch (error) {
    // Empty folders (e.g. "static") aren't tracked by git, so they can be
    // legitimately missing from a fresh checkout — skip instead of crashing
    // the whole build over a folder with nothing in it.
    console.log(`Skipping "${entry}" — not present in this checkout.`);
    continue;
  }
  await cp(source, join(destination, entry), { recursive: true });
}
console.log("Static portfolio copied to dist/public.");
